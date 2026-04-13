import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getProductById,
  type Product as LegacyProduct,
} from "@/data/products";
import type { Product as ApiProduct } from "@/redux/features/products/productApi";

type CartProduct = {
  id: string | number;
  name: string;
  price: number;
  vendor: string;
  image: string;
  category: string;
  description: string;
  rating?: number;
  reviews?: number;
};

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
};

type CartItem = CartProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: LegacyProduct | ApiProduct | CartProduct, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
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
  id: string | number;
  quantity: number;
  name?: string;
  price?: number;
  vendor?: string;
  image?: string;
  category?: string;
  description?: string;
  rating?: number;
  reviews?: number;
};

const STORAGE_KEY = "smallshop-cart";
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 9.99;

const CartContext = createContext<CartContextValue | null>(null);

const getApiProductImage = (product: ApiProduct) =>
  product.images?.[0]?.url ||
  "https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image";

const normalizeProduct = (
  product: LegacyProduct | ApiProduct | CartProduct,
): CartProduct => {
  if ("provider" in product) {
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      vendor: product.provider?.providerProfile?.shopName || product.provider?.name,
      image: getApiProductImage(product),
      category: product.category?.name || "",
      description:
        product.shortDescription || product.description || "No description available.",
    };
  }

  return {
    id: product.id,
    name: product.name,
    price: Number(product.price || 0),
    vendor: product.vendor,
    image: product.image,
    category: product.category,
    description: product.description,
    rating: product.rating,
    reviews: product.reviews,
  };
};

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
      .map((item) => {
        if (
          item.name &&
          item.vendor &&
          item.image &&
          item.category &&
          item.description &&
          typeof item.price === "number"
        ) {
          return {
            id: item.id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
            vendor: item.vendor,
            image: item.image,
            category: item.category,
            description: item.description,
            rating: item.rating,
            reviews: item.reviews,
          };
        }

        if (typeof item.id !== "number") {
          return null;
        }

        const product = getProductById(item.id);
        if (!product) {
          return null;
        }

        return {
          ...normalizeProduct(product),
          quantity: item.quantity,
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
      JSON.stringify(items),
    );
  }, [items]);

  const addToCart = (
    product: LegacyProduct | ApiProduct | CartProduct,
    quantity = 1,
  ) => {
    const normalizedProduct = normalizeProduct(product);

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === normalizedProduct.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === normalizedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...currentItems, { ...normalizedProduct, quantity }];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
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
