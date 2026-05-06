import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import Seo from "@/components/Seo";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const { t } = useTranslation();
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <div className="container py-10">
      <Seo
        title={t("nav.cart")}
        description="Review your selected products and checkout from Ecommerce Helmy."
        keywords="helmy cart, ecommerce checkout"
      />
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{t("cart.title")}</h1>
        {items.length > 0 && (
          <Button variant="outline" onClick={clearCart}>
            {t("cart.clear")}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">{t("cart.empty")}</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={`${item.product.id}-${item.size || "default"}`} className="flex gap-4 rounded-xl border p-4">
                <img src={item.product.image} alt={item.product.title} className="h-24 w-20 rounded object-contain" />
                <div className="flex-1">
                  <h2 className="line-clamp-2 text-sm font-semibold">{item.product.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t("cart.size")}: {item.size || t("cart.na")}</p>
                  <p className="mt-2 font-medium">${item.product.price.toFixed(2)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}>
                      -
                    </Button>
                    <span className="min-w-7 text-center text-sm">{item.quantity}</span>
                    <Button size="icon" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}>
                      +
                    </Button>
                    <button className="ms-3 text-sm text-destructive" onClick={() => removeFromCart(item.product.id, item.size)}>
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="text-lg font-semibold">{t("cart.orderSummary")}</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cart.shipping")}</span>
                <span>{t("cart.free")}</span>
              </div>
            </div>
            <div className="mt-4 border-t pt-4 text-sm font-semibold">
              {t("cart.total")}: ${subtotal.toFixed(2)}
            </div>
            <Button className="mt-5 h-11 w-full rounded-full">{t("cart.checkout")}</Button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
