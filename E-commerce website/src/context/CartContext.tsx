import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { CartItem, Product } from "../types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const key = (item: CartItem) => `${item.product.id}::${item.size ?? ""}::${item.color ?? ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1, size?: string, color?: string) => {
    setItems((prev) => {
      const targetKey = `${product.id}::${size ?? ""}::${color ?? ""}`;
      const existing = prev.find((i) => key(i) === targetKey);
      if (existing) {
        return prev.map((i) =>
          key(i) === targetKey ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity, size, color }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, size?: string, color?: string) => {
    const targetKey = `${productId}::${size ?? ""}::${color ?? ""}`;
    setItems((prev) => prev.filter((i) => key(i) !== targetKey));
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    const targetKey = `${productId}::${size ?? ""}::${color ?? ""}`;
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => key(i) !== targetKey));
    } else {
      setItems((prev) =>
        prev.map((i) => (key(i) === targetKey ? { ...i, quantity } : i))
      );
    }
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
