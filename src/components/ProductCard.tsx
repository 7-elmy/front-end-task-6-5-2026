import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <Card className="group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden bg-secondary/60 p-6">
          <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground line-clamp-1">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold">{product.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
          <Link to={`/product/${product.id}`} className="text-xs text-muted-foreground transition group-hover:text-foreground">
            View Details
          </Link>
        </div>
        <Button
          className="mt-4 w-full rounded-full"
          onClick={() => {
            if (!user) {
              toast.error(t("common.pleaseLogin"));
              navigate("/login");
              return;
            }
            addToCart(product);
            toast.success(t("common.addedToCart"));
          }}
        >
          {t("productCard.addToCart")}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
