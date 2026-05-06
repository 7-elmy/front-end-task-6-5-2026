import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Seo from "@/components/Seo";
import { useTranslation } from "react-i18next";

interface AuthFormProps {
  mode: "login" | "register";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result =
      mode === "login"
        ? await login(email, password)
        : await register(name, email, password);
    setLoading(false);
    if (result.ok) {
      toast.success(t("auth.success", { name: name || email.split("@")[0] }));
      navigate("/");
    } else {
      const nextError =
        result.error === "exists"
          ? t("auth.exists")
          : t("auth.invalid");
      setError(nextError);
      toast.error(nextError);
    }
  };

  return (
    <div className="container grid min-h-[calc(100vh-8rem)] items-center gap-8 py-10 lg:grid-cols-[1fr_460px]">
      <Seo
        title={mode === "login" ? "Login" : "Register"}
        description="Secure account access for Helmy Ecommerce."
        keywords="helmy login, register, ecommerce auth"
      />
      <section className="hidden rounded-3xl border bg-muted/30 p-8 lg:block">
        <p className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t("auth.secureAccess")}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {mode === "login" ? t("auth.welcomeBackHelmy") : t("auth.joinHelmy")}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {mode === "login"
            ? t("auth.loginPitch")
            : t("auth.registerPitch")}
        </p>
        <div className="mt-8 grid gap-3 text-sm">
          <div className="rounded-2xl border bg-background p-4">
            <p className="font-medium">{t("auth.fastCheckout")}</p>
            <p className="mt-1 text-muted-foreground">{t("auth.fastCheckoutDesc")}</p>
          </div>
          <div className="rounded-2xl border bg-background p-4">
            <p className="font-medium">{t("auth.orderUpdates")}</p>
            <p className="mt-1 text-muted-foreground">{t("auth.orderUpdatesDesc")}</p>
          </div>
        </div>
      </section>

      <Card className="w-full rounded-3xl border p-6 shadow-xl md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          {mode === "login" ? t("auth.signInShort") : t("auth.createAccountShort")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? t("auth.loginHint") : t("auth.registerHint")}
        </p>
        {mode === "login" && (
          <div className="mt-4 rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Demo account</p>
            <p className="mt-1">Email: emilys@gmail.com</p>
            <p>Password: emilyspass</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 h-8 rounded-full px-3 text-xs"
              onClick={() => {
                setEmail("emilys@gmail.com");
                setPassword("emilyspass");
              }}
            >
              Use demo account
            </Button>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <div className="relative">
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                className="peer h-12 rounded-xl border-border/80 bg-background pt-4"
              />
              <label
                htmlFor="name"
                className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                {t("auth.name")}
              </label>
            </div>
          )}
          <div className="relative">
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer h-12 rounded-xl border-border/80 bg-background pt-4"
            />
            <label
              htmlFor="email"
              className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs"
            >
              {mode === "login" ? t("auth.emailOrUsername") : t("auth.email")}
            </label>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="peer h-12 rounded-xl border-border/80 bg-background pt-4 pr-10"
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-3 top-3 text-sm text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs"
            >
              {t("auth.password")}
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-4 text-muted-foreground transition hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="h-11 w-full rounded-full text-sm font-medium" disabled={loading}>
            {mode === "login" ? t("auth.continueToAccount") : t("auth.createAccount")}
            <ArrowRight className="ms-2 h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              {t("auth.noAccount")}{" "}
              <Link to="/register" className="font-semibold text-foreground hover:underline">
                {t("nav.register")}
              </Link>
            </>
          ) : (
            <>
              {t("auth.haveAccount")}{" "}
              <Link to="/login" className="font-semibold text-foreground hover:underline">
                {t("nav.login")}
              </Link>
            </>
          )}
        </p>
      </Card>
    </div>
  );
};

export default AuthForm;
