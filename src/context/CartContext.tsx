import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  getProductById,
  type Product as LegacyProduct,
} from "@/data/products";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import type { Product as ApiProduct } from "@/redux/features/products/productApi";
import {
  type CartApiCart,
  useAddCartItemMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/redux/features/cart/cartApi";
import { useGetDeliveryZonesQuery } from "@/redux/features/generalApi/deliveryZonesApi";
import type { DeliveryZone } from "@/redux/features/generalApi/deliveryZonesApi";

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
  deliveryZones?: DeliveryZone[];
};

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  deliveryZoneId: string;
  deliveryMode: "NORMAL" | "EXPRESS";
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
  deliveryZoneId: string;
  setDeliveryZoneId: (deliveryZoneId: string) => void;
  deliveryMode: "NORMAL" | "EXPRESS";
  setDeliveryMode: (deliveryMode: "NORMAL" | "EXPRESS") => void;
  eligibleDeliveryZones: DeliveryZone[];
  pricingMessage: string | null;
  canCheckout: boolean;
  isCartSyncing: boolean;
  refreshCartPricing: () => Promise<CartApiCart | null>;
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

type StoredCartState = {
  items: StoredCartItem[];
  syncedUserId: string | null;
};

const STORAGE_KEY = "smallshop-cart";
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
      deliveryZones:
        product.deliveryZones?.map((zone) => zone.deliveryZone).filter(Boolean) || [],
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

const getStoredCartState = (): StoredCartState => {
  if (typeof window === "undefined") {
    return {
      items: [],
      syncedUserId: null,
    };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        items: [],
        syncedUserId: null,
      };
    }

    const parsed = JSON.parse(stored) as StoredCartItem[] | StoredCartState;
    const items = Array.isArray(parsed) ? parsed : parsed.items || [];
    const syncedUserId = Array.isArray(parsed) ? null : parsed.syncedUserId || null;

    return {
      items: items
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
        .filter((item): item is CartItem => Boolean(item)),
      syncedUserId,
    };
  } catch {
    return {
      items: [],
      syncedUserId: null,
    };
  }
};

const normalizeServerCart = (cart: CartApiCart | null | undefined): CartItem[] =>
  cart?.items?.map((item) => ({
    ...normalizeProduct(item.product),
    quantity: item.quantity,
  })) ?? [];

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const initialCartState = getStoredCartState();
  const [items, setItems] = useState<CartItem[]>(initialCartState.items);
  const [syncedUserId, setSyncedUserId] = useState<string | null>(
    initialCartState.syncedUserId,
  );
  const [lastOrder, setLastOrder] = useState<CartContextValue["lastOrder"]>(null);
  const [deliveryZoneId, setDeliveryZoneId] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"NORMAL" | "EXPRESS">("NORMAL");
  const [isCartSyncing, setIsCartSyncing] = useState(false);
  const user = useAppSelector(useCurrentUser);
  const isCustomerAuthenticated = user?.role === "customer" && Boolean(user?.id);
  const itemsRef = useRef(items);
  const syncInProgressRef = useRef(false);
  const [addCartItemRemote] = useAddCartItemMutation();
  const [updateCartItemRemote] = useUpdateCartItemMutation();
  const [removeCartItemRemote] = useRemoveCartItemMutation();
  const { data: deliveryZoneResponse } = useGetDeliveryZonesQuery();
  const { data: cartResponse, refetch, isFetching: isCartFetching } = useGetCartQuery(
    isCustomerAuthenticated
      ? {
          deliveryZoneId: deliveryZoneId || undefined,
          deliveryMode,
        }
      : undefined,
    {
      skip: !isCustomerAuthenticated,
    },
  );

  const applyServerCart = useCallback(
    (cart: CartApiCart | null | undefined) => {
      setItems(normalizeServerCart(cart));
      setSyncedUserId(user?.id ?? null);
    },
    [user?.id],
  );

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        items,
        syncedUserId,
      }),
    );
  }, [items, syncedUserId]);

  useEffect(() => {
    if (isCustomerAuthenticated) {
      return;
    }

    if (syncedUserId !== null) {
      setItems([]);
      setSyncedUserId(null);
    }
  }, [isCustomerAuthenticated, syncedUserId]);

  useEffect(() => {
    const serverEligibleZones = cartResponse?.data?.pricing?.eligibleDeliveryZones || [];
    const fallbackZones = deliveryZoneResponse?.data || [];
    const zones = isCustomerAuthenticated ? serverEligibleZones : fallbackZones;

    if (!zones.length) {
      if (deliveryZoneId) {
        setDeliveryZoneId("");
      }
      return;
    }

    const isCurrentValid = zones.some((zone) => zone.id === deliveryZoneId);
    if (!isCurrentValid) {
      setDeliveryZoneId(zones[0].id);
    }
  }, [
    cartResponse?.data?.pricing?.eligibleDeliveryZones,
    deliveryMode,
    deliveryZoneId,
    deliveryZoneResponse?.data,
    isCustomerAuthenticated,
  ]);

  useEffect(() => {
    const syncGuestCartToServer = async () => {
      if (!isCustomerAuthenticated || !cartResponse?.data || !user?.id) {
        return;
      }

      if (syncInProgressRef.current) {
        return;
      }

      if (syncedUserId === user.id) {
        setItems(normalizeServerCart(cartResponse.data));
        return;
      }

      syncInProgressRef.current = true;
      setIsCartSyncing(true);

      try {
        if (syncedUserId !== null && syncedUserId !== user.id) {
          applyServerCart(cartResponse.data);
          return;
        }

        const guestItems = itemsRef.current.filter(
          (item) => typeof item.id === "string" && item.quantity > 0,
        );

        if (!guestItems.length) {
          applyServerCart(cartResponse.data);
          return;
        }

        let latestCart = cartResponse.data;

        for (const item of guestItems) {
          const response = await addCartItemRemote({
            productId: item.id,
            quantity: item.quantity,
          }).unwrap();

          latestCart = response.data;
        }

        applyServerCart(latestCart);
      } finally {
        syncInProgressRef.current = false;
        setIsCartSyncing(false);
      }
    };

    void syncGuestCartToServer();
  }, [
    addCartItemRemote,
    applyServerCart,
    cartResponse,
    isCustomerAuthenticated,
    syncedUserId,
    user?.id,
  ]);

  const refreshCartPricing = useCallback(async () => {
    if (!isCustomerAuthenticated) {
      return null;
    }

    const response = await refetch();
    if ("data" in response) {
      return response.data?.data || null;
    }

    return null;
  }, [isCustomerAuthenticated, refetch]);

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

    if (!isCustomerAuthenticated || syncedUserId !== user?.id) {
      setSyncedUserId(null);
      return;
    }

    if (typeof normalizedProduct.id !== "string") {
      return;
    }

    void addCartItemRemote({
      productId: normalizedProduct.id,
      quantity,
    })
      .unwrap()
      .then((response) => {
        applyServerCart(response.data);
      })
      .catch(() => {
        void refetch();
      });
  };

  const removeFromCart = (productId: string | number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );

    if (!isCustomerAuthenticated || syncedUserId !== user?.id) {
      setSyncedUserId(null);
      return;
    }

    if (typeof productId !== "string") {
      return;
    }

    void removeCartItemRemote(productId)
      .unwrap()
      .then((response) => {
        applyServerCart(response.data);
      })
      .catch(() => {
        void refetch();
      });
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

    if (!isCustomerAuthenticated || syncedUserId !== user?.id) {
      setSyncedUserId(null);
      return;
    }

    if (typeof productId !== "string") {
      return;
    }

    void updateCartItemRemote({
      productId,
      quantity,
    })
      .unwrap()
      .then((response) => {
        applyServerCart(response.data);
      })
      .catch(() => {
        void refetch();
      });
  };

  const clearCart = () => {
    const currentItems = [...items];
    setItems([]);

    if (!isCustomerAuthenticated || syncedUserId !== user?.id) {
      setSyncedUserId(null);
      return;
    }

    void Promise.all(
      currentItems
        .filter((item) => typeof item.id === "string")
        .map((item) =>
          removeCartItemRemote(item.id as string)
            .unwrap()
            .catch(() => null),
        ),
    ).then(() => {
      void refetch().then((response) => {
        if ("data" in response) {
          applyServerCart(response.data?.data);
        }
      });
    });
  };

  const subtotal = isCustomerAuthenticated
    ? cartResponse?.data?.pricing?.subtotal ||
      items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = isCustomerAuthenticated
    ? cartResponse?.data?.pricing?.deliveryCharge || 0
    : 0;
  const total = isCustomerAuthenticated
    ? cartResponse?.data?.pricing?.total || subtotal
    : subtotal;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const eligibleDeliveryZones = isCustomerAuthenticated
    ? cartResponse?.data?.pricing?.eligibleDeliveryZones || []
    : deliveryZoneResponse?.data || [];
  const pricingMessage = isCustomerAuthenticated
    ? cartResponse?.data?.pricing?.message || null
    : items.length
      ? "Login to calculate delivery charges from the backend."
      : null;
  const canCheckout = isCustomerAuthenticated
    ? Boolean(cartResponse?.data?.pricing?.canCheckout) &&
      !isCartFetching &&
      !isCartSyncing
    : false;

  const placeOrder = (formData: CheckoutFormData) => {
    setLastOrder({
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      total,
      itemCount,
    });
    setItems([]);

    if (!isCustomerAuthenticated || syncedUserId !== user?.id) {
      setSyncedUserId(null);
      return;
    }

    void refetch().then((response) => {
      if ("data" in response) {
        applyServerCart(response.data?.data);
      }
    });
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
        deliveryZoneId,
        setDeliveryZoneId,
        deliveryMode,
        setDeliveryMode,
        eligibleDeliveryZones,
        pricingMessage,
        canCheckout,
        isCartSyncing,
        refreshCartPricing,
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
