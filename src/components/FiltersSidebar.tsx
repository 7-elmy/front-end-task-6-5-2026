import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface FiltersState {
  category: string;
  sort: "default" | "low-high" | "high-low";
  priceRange: [number, number];
}

interface FiltersSidebarProps {
  categories: string[];
  value: FiltersState;
  onChange: (value: FiltersState) => void;
}

const FilterBody = ({ categories, value, onChange }: FiltersSidebarProps) => {
  const { t } = useTranslation();
  const [openPrice, setOpenPrice] = useState(true);
  const hasCustomFilters = useMemo(
    () => value.category !== "all" || value.sort !== "default" || value.priceRange[0] !== 0 || value.priceRange[1] !== 500,
    [value],
  );

  const clearAll = () =>
    onChange({
      category: "all",
      sort: "default",
      priceRange: [0, 500],
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
          <SlidersHorizontal className="h-4 w-4" />
          {t("filters.title")}
        </h2>
        {hasCustomFilters && (
          <button
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
            onClick={clearAll}
          >
            <X className="h-3.5 w-3.5" />
            {t("filters.clear")}
          </button>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("filters.categories")}
        </h3>
        <div className="space-y-2">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm capitalize transition ${
                value.category === c
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => onChange({ ...value, category: c })}
            >
              {c}
              {value.category === c ? <span className="text-[10px] uppercase tracking-wider">{t("filters.selected")}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div>
        <button className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground" onClick={() => setOpenPrice((s) => !s)}>
          {t("filters.priceRange")} <ChevronDown className={`h-4 w-4 transition ${openPrice ? "rotate-180" : ""}`} />
        </button>
        <div className={`grid overflow-hidden transition-all ${openPrice ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="min-h-0 space-y-4 rounded-xl border bg-muted/40 p-4">
            <Slider
              min={0}
              max={500}
              step={5}
              value={value.priceRange}
              onValueChange={(v) => onChange({ ...value, priceRange: [v[0], v[1]] })}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="rounded-md border bg-background px-2 py-1">${value.priceRange[0]}</span>
              <span className="text-muted-foreground">{t("filters.to")}</span>
              <span className="rounded-md border bg-background px-2 py-1">${value.priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("filters.sort")}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {[
            ["default", t("filters.featured")],
            ["low-high", t("filters.lowHigh")],
            ["high-low", t("filters.highLow")],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`block w-full rounded-lg px-3 py-2 text-left transition ${
                value.sort === key
                  ? "bg-foreground text-background"
                  : "hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => onChange({ ...value, sort: key as FiltersState["sort"] })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full rounded-full" onClick={() => onChange({ ...value })}>
        {t("filters.apply")}
      </Button>
    </div>
  );
};

const FiltersSidebar = ({ categories, value, onChange }: FiltersSidebarProps) => {
  const { t } = useTranslation();
  return (
    <>
      <aside className="sticky top-24 hidden h-fit rounded-2xl border bg-card p-5 shadow-sm lg:block">
        <FilterBody categories={categories} value={value} onChange={onChange} />
      </aside>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="mb-4 rounded-full lg:hidden">
            <SlidersHorizontal className="me-2 h-4 w-4" />
            {t("filters.title")}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("filters.title")}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterBody categories={categories} value={value} onChange={onChange} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FiltersSidebar;
