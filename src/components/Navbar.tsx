import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, User, LogOut, ShoppingBag, Palette, Check, Globe, Menu } from "lucide-react";
import i18n from "@/i18n";

const themeOptions = [
  { value: "light", labelKey: "theme.light" },
  { value: "dark", labelKey: "theme.dark" },
  { value: "spotify", labelKey: "theme.spotify" },
  { value: "discord", labelKey: "theme.discord" },
] as const;

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToProductsSection = () => {
    let attempts = 0;
    const maxAttempts = 12;
    const timer = window.setInterval(() => {
      const section = document.getElementById("products");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        window.clearInterval(timer);
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) window.clearInterval(timer);
    }, 120);
  };

  const switchLang = (lng: "en" | "ar") => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };

  const handleSearch = (e: FormEvent, isMobile = false) => {
    e.preventDefault();
    const next = query.trim();
    navigate(next ? `/?q=${encodeURIComponent(next)}#products` : "/#products");
    scrollToProductsSection();
    if (isMobile) setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("nav.openMenu")} className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[90vw] sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>{t("brand")}</SheetTitle>
              </SheetHeader>
              <form onSubmit={(e) => handleSearch(e, true)} className="mt-6 flex items-center gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("nav.search")}
                  className="h-10 rounded-full"
                />
                <Button size="icon" type="submit" className="rounded-full hidden md:block">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <div className="mt-6 space-y-3 text-sm">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block rounded-md p-2 hover:bg-muted">{t("nav.products")}</Link>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block rounded-md p-2 hover:bg-muted">{t("nav.cart")}</Link>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">{t("brand")}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={(e) => handleSearch(e)} className="relative hidden lg:block">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("nav.search")}
              className="h-10 w-[240px] rounded-full border-border bg-background ps-9 xl:w-[320px]"
            />
            <button type="submit" className="sr-only ">{t("nav.search")}</button>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("lang.label")}>
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("lang.label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => switchLang("en")}>{t("lang.en")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLang("ar")}>{t("lang.ar")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("theme.label")}>
                <Palette className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("theme.label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {themeOptions.map((option) => (
                <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)}>
                  <span className="me-2 inline-flex w-4 items-center justify-center">
                    {theme === option.value ? <Check className="h-4 w-4" /> : null}
                  </span>
                  {t(option.labelKey)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" aria-label={t("nav.cart")} onClick={() => navigate("/cart")} className="relative">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -end-1 -top-1 rounded-full bg-black px-1.5 text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t("nav.account")}>
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>{t("nav.account")}</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="me-2 h-4 w-4" /> {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>
                {t("nav.login")}
              </Button>
              <Button size="sm" className="hidden rounded-full px-5 sm:inline-flex" onClick={() => navigate("/register")}>
                {t("nav.register")}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
