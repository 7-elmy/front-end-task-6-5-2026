import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Product } from "@/lib/api";

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: number, size?: string) => void;
  updateQuantity: (productId: number, quantity: number, size?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "helmy_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addToCart = (product: Product, size?: string) => {
    const idx = items.findIndex((i) => i.product.id === product.id && i.size === size);
    if (idx === -1) {
      persist([...items, { product, quantity: 1, size }]);
      return;
    }
    const next = [...items];
    next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
    persist(next);
  };

  const removeFromCart = (productId: number, size?: string) => {
    persist(items.filter((i) => !(i.product.id === productId && i.size === size)));
  };

  const updateQuantity = (productId: number, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    persist(
      items.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => persist([]);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
