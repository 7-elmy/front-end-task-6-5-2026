import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Seo from "@/components/Seo";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container py-10">
      <Seo
        title={t("nav.account")}
        description="Manage your Helmy account profile and session."
        keywords="helmy profile, account settings"
        path="/profile"
      />
      <div className="mx-auto max-w-3xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight">{t("profile.title")}</h1>

        <Card className="rounded-2xl p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("profile.fullName")}</p>
              <p className="mt-1 text-base font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("profile.email")}</p>
              <p className="mt-1 text-base font-medium">{user.email}</p>
            </div>
           
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button className="rounded-full px-6" onClick={() => navigate("/cart")}>
            {t("profile.goToCart")}
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-6"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            {t("nav.logout")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
