import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1900&q=80"
        alt={t("heroPremium.alt")}
        className="h-[68vh] min-h-[420px] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-transparent" />
      <div className="container absolute inset-0 flex items-center">
        <div className="max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/80">{t("heroPremium.tag")}</p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
            {t("heroPremium.title")}
          </h1>
          <p className="mt-4 text-sm text-white/85 md:text-base">
            {t("heroPremium.subtitle")}
          </p>
          <Button
            className="mt-7 h-11 rounded-full bg-white px-7 text-black hover:bg-white/90"
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t("heroPremium.cta")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
