import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { useTranslation } from "react-i18next";

const ProductDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
  const relatedQ = useQuery({
    queryKey: ["related-products", data?.category],
    queryFn: fetchProducts,
    enabled: !!data?.category,
    staleTime: 1000 * 60 * 5,
  });
  const related = useMemo(
    () => (relatedQ.data ?? []).filter((p) => p.category === data?.category && p.id !== data?.id).slice(0, 4),
    [relatedQ.data, data?.category, data?.id],
  );

  return (
    <main className="container py-8">
      {data && (
        <Seo
          title={data.title}
          description={data.description}
          keywords={`${data.category}, helmy ecommerce, premium fashion`}
          image={data.image}
          path={`/product/${data.id}`}
        />
      )}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 rounded-full">
        <ArrowLeft className="me-2 h-4 w-4" /> {t("productDetails.back")}
      </Button>

      {isLoading && (
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      )}

      {isError && <div className="text-destructive">{t("productDetails.loadError")}</div>}

      {data && (
        <article className="grid items-start gap-8 md:grid-cols-2 lg:gap-14">
          <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-10">
            <img
              src={data.image}
              alt={data.title}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="mx-auto h-[420px] w-full max-w-[420px] object-contain"
            />
          </section>

          <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{data.category}</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight md:text-4xl">{data.title}</h1>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-foreground text-foreground" />
              <span className="font-semibold">{data.rating.rate.toFixed(1)}</span>
              <span className="text-muted-foreground">({data.rating.count} {t("productDetails.reviews")})</span>
            </div>

            <p className="mt-6 text-3xl font-bold">${data.price.toFixed(2)}</p>

            <div className="mt-6 border-t pt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide">{t("productDetails.description")}</h2>
              <p className="leading-relaxed text-muted-foreground">{data.description}</p>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 text-lg transition hover:bg-muted"
                  aria-label={t("productDetails.decreaseQty")}
                >
                  -
                </button>
                <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-10 w-10 text-lg transition hover:bg-muted"
                  aria-label={t("productDetails.increaseQty")}
                >
                  +
                </button>
              </div>

              <Button
                size="lg"
                className="h-10 rounded-full px-6"
                onClick={() => {
                  if (!user) {
                    toast.error(t("common.pleaseLogin"));
                    navigate("/login");
                    return;
                  }
                  for (let i = 0; i < quantity; i += 1) addToCart(data);
                  toast.success(t("common.itemAddedToCart"));
                }}
              >
                <ShoppingBag className="me-2 h-4 w-4" />
                {t("productDetails.addToCart")}
              </Button>
            </div>
          </section>
        </article>
      )}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-semibold">{t("productDetails.related")}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetails;
