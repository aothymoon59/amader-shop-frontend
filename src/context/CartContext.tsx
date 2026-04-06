import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getProductById, type Product } from "@/data/products";

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
};

type CartItem = Product & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  placeOrder: (formData: CheckoutFormData) => void;
  lastOrder: {
    customerName: string;
    total: number;
    itemCount: number;
  } | null;
};

type StoredCartItem = {
  id: number;
  quantity: number;
};

const STORAGE_KEY = "smallshop-cart";
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 9.99;

const CartContext = createContext<CartContextValue | null>(null);

const getInitialItems = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed: StoredCartItem[] = JSON.parse(stored);
    return parsed
      .map(({ id, quantity }) => {
        const product = getProductById(id);
        if (!product) {
          return null;
        }

        return {
          ...product,
          quantity,
        };
      })
      .filter((item): item is CartItem => Boolean(item));
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(getInitialItems);
  const [lastOrder, setLastOrder] = useState<CartContextValue["lastOrder"]>(null);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity }))),
    );
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = (formData: CheckoutFormData) => {
    setLastOrder({
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      total,
      itemCount,
    });
    clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shipping,
        total,
        itemCount,
        placeOrder,
        lastOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
