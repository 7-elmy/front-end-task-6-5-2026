import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="mt-20 border-t bg-muted/30">
      <div className="container grid gap-8 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold tracking-tight">Helmy</h3>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {t("footer.description")}
          </p>
          <form className="mt-5 flex max-w-sm gap-2">
            <input
              type="email"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              placeholder={t("footer.subscribePlaceholder")}
            />
            <button className="rounded-md bg-foreground px-4 text-sm text-background transition hover:opacity-90">
              {t("footer.join")}
            </button>
          </form>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">{t("footer.about")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t("footer.ourStory")}</li>
            <li>{t("footer.careers")}</li>
            <li>{t("footer.stores")}</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">{t("footer.help")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t("footer.shipping")}</li>
            <li>{t("footer.returns")}</li>
            <li>{t("footer.contact")}</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">{t("footer.categories")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t("nav.men")}</li>
            <li>{t("nav.women")}</li>
            <li>{t("nav.newArrivals")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4">
        <p className="container text-xs text-muted-foreground">
          © {new Date().getFullYear()} Helmy Ecommerce. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
