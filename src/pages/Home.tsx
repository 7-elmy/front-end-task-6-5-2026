import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchCategories, fetchProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import HeroSection from "@/components/HeroSection";
import FiltersSidebar from "@/components/FiltersSidebar";
import Seo from "@/components/Seo";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchFromNavbar = searchParams.get("q")?.toLowerCase().trim() ?? "";
  const [filters, setFilters] = useState<{
    category: string;
    sort: "default" | "low-high" | "high-low";
    priceRange: [number, number];
  }>({
    category: "all",
    sort: "default",
    priceRange: [0, 500],
  });
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    setPage(1);
  }, [searchFromNavbar]);

  const productsQ = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });
  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });

  const filtered = useMemo(() => {
    if (!productsQ.data) return [];
    let result = productsQ.data.filter((p) => {
      const matchesCategory = filters.category === "all" || p.category === filters.category;
      const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
      const matchesSearch = !searchFromNavbar || p.title.toLowerCase().includes(searchFromNavbar);
      return matchesCategory && matchesPrice && matchesSearch;
    });
    if (filters.sort === "low-high") result = [...result].sort((a, b) => a.price - b.price);
    if (filters.sort === "high-low") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [productsQ.data, filters, searchFromNavbar]);

  const pageCount = Math.ceil(filtered.length / perPage);
  const visibleProducts = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <Seo
        title="Premium Apparel"
        description="Discover the latest Helmy drops with clean design, refined styles, and premium essentials."
        keywords="Helmy Ecommerce, men clothing, women clothing, fashion shop, premium essentials"
        path="/"
      />
      <HeroSection />

      <section id="products" className="container py-12">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("home.featured")}</h2>
          <p className="text-sm text-muted-foreground">{t("home.itemsCount", { count: filtered.length })}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <FiltersSidebar
            categories={categoriesQ.data ?? []}
            value={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
          />

          <div>
            {productsQ.isLoading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-[360px] w-full rounded-2xl" />
                ))}
              </div>
            )}

            {productsQ.isError && <div className="py-12 text-center text-destructive">{t("products.error")}</div>}

            {productsQ.data && filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">{t("products.empty")}</div>
            )}

            {visibleProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {visibleProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                {pageCount > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    {Array.from({ length: pageCount }, (_, idx) => idx + 1).map((p) => (
                      <button
                        key={p}
                        className={`h-9 w-9 rounded-full text-sm transition ${
                          page === p ? "bg-foreground text-background" : "bg-muted hover:bg-muted/70"
                        }`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
