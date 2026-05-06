const AUTH_BASE = import.meta.env.VITE_AUTH_BASE_URL || "https://dummyjson.com";

export interface ApiAuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface LoginResponse extends ApiAuthUser {
  accessToken: string;
  refreshToken: string;
}

const handleJson = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = typeof body?.message === "string" ? body.message : "Request failed";
    throw new Error(message);
  }
  return res.json();
};

export const loginWithApi = async (username: string, password: string): Promise<LoginResponse> => {
  const res = await fetch(`${AUTH_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
  return handleJson<LoginResponse>(res);
};

export const registerWithApi = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}) => {
  const res = await fetch(`${AUTH_BASE}/users/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson<ApiAuthUser>(res);
};

export const refreshTokenWithApi = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const res = await fetch(`${AUTH_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken, expiresInMins: 60 }),
  });
  return handleJson<{ accessToken: string; refreshToken: string }>(res);
};

export const getProfileWithApi = async (accessToken: string): Promise<ApiAuthUser> => {
  const res = await fetch(`${AUTH_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return handleJson<ApiAuthUser>(res);
};
