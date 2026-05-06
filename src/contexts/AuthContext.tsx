import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  getProfileWithApi,
  loginWithApi,
  refreshTokenWithApi,
  registerWithApi,
} from "@/lib/authApi";

interface User {
  id: string | number;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_KEY = "helmy_auth_session";
const PROFILE_CACHE_KEY = "helmy_auth_profile_cache";

interface SessionState {
  user: User | null;
  token: string;
  refreshToken: string;
}

const decodeJwtExpiry = (jwt: string) => {
  try {
    const payload = jwt.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const parsed = JSON.parse(atob(normalized));
    if (typeof parsed?.exp !== "number") return 0;
    return parsed.exp * 1000;
  } catch {
    return 0;
  }
};

const mapProfile = (profile: { id: number; firstName: string; lastName: string; email: string }): User => ({
  id: profile.id,
  name: `${profile.firstName} ${profile.lastName}`.trim(),
  email: profile.email,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return;
      try {
        const saved = JSON.parse(raw) as SessionState;
        const now = Date.now();
        const expiresAt = decodeJwtExpiry(saved.token);
        let activeToken = saved.token;
        let activeRefreshToken = saved.refreshToken;

        if (!expiresAt || expiresAt <= now + 10000) {
          const refreshed = await refreshTokenWithApi(saved.refreshToken);
          activeToken = refreshed.accessToken;
          activeRefreshToken = refreshed.refreshToken;
        }

        const cachedRaw = localStorage.getItem(PROFILE_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as { user: User; expiresAt: number };
          if (cached.expiresAt > now) {
            setUser(cached.user);
            setToken(activeToken);
            localStorage.setItem(
              SESSION_KEY,
              JSON.stringify({ user: cached.user, token: activeToken, refreshToken: activeRefreshToken }),
            );
            return;
          }
        }

        const profile = await getProfileWithApi(activeToken);
        const nextUser = mapProfile(profile);
        setUser(nextUser);
        setToken(activeToken);
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ user: nextUser, token: activeToken, refreshToken: activeRefreshToken }),
        );
        localStorage.setItem(
          PROFILE_CACHE_KEY,
          JSON.stringify({ user: nextUser, expiresAt: now + 1000 * 60 * 5 }),
        );
      } catch {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(PROFILE_CACHE_KEY);
      }
    };
    bootstrap();
  }, []);

  const persist = (u: User, t: string, r: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: u, token: t, refreshToken: r }));
    localStorage.setItem(
      PROFILE_CACHE_KEY,
      JSON.stringify({ user: u, expiresAt: Date.now() + 1000 * 60 * 5 }),
    );
  };

  const buildUsername = (identifier: string) => {
    const base = identifier.includes("@") ? identifier.split("@")[0] : identifier;
    return base.toLowerCase().replace(/[^a-z0-9_.-]/g, "") || `user${Date.now()}`;
  };

  const register: AuthContextValue["register"] = async (name, email, password) => {
    try {
      const [firstName, ...rest] = name.trim().split(" ");
      const lastName = rest.join(" ") || "User";
      const username = `${buildUsername(email)}${Math.floor(Math.random() * 1000)}`;
      await registerWithApi({
        firstName: firstName || "Helmy",
        lastName,
        email,
        username,
        password,
      });
      const session = await loginWithApi(username, password);
      persist(mapProfile(session), session.accessToken, session.refreshToken);
      return { ok: true };
    } catch {
      return { ok: false, error: "exists" };
    }
  };

  const login: AuthContextValue["login"] = async (identifier, password) => {
    try {
      const username = buildUsername(identifier);
      const session = await loginWithApi(username, password);
      persist(mapProfile(session), session.accessToken, session.refreshToken);
      return { ok: true };
    } catch {
      return { ok: false, error: "invalid" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PROFILE_CACHE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
