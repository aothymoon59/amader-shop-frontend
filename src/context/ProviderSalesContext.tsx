import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PosProduct = {
  id: number;
  name: string;
  price: number;
  sku: string;
};

type SaleCartItem = PosProduct & {
  qty: number;
};

export type ReceiptRecord = {
  id: string;
  date: string;
  items: SaleCartItem[];
  itemCount: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  type: "POS" | "Online";
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  paymentMethod: string;
  cashier: string;
};

const PROVIDER_PRODUCTS: PosProduct[] = [
  { id: 1, name: "Wireless Headphones Pro", price: 89.99, sku: "PRO-1001" },
  { id: 2, name: "Smart Speaker Mini", price: 129.99, sku: "SPK-1002" },
  { id: 3, name: "USB-C Cable Pack", price: 19.99, sku: "USB-1003" },
  { id: 4, name: "Bluetooth Keyboard", price: 59.99, sku: "KEY-1004" },
];

const INITIAL_RECEIPTS: ReceiptRecord[] = [
  {
    id: "RCP-001",
    date: "2026-04-05 14:10",
    items: [
      { id: 1, name: "Wireless Headphones Pro", price: 89.99, qty: 1, sku: "PRO-1001" },
      { id: 3, name: "USB-C Cable Pack", price: 19.99, qty: 2, sku: "USB-1003" },
    ],
    itemCount: 3,
    subtotal: 129.97,
    discountPercent: 0,
    discountAmount: 0,
    total: 129.97,
    type: "POS",
    customerName: "Walk-in Customer",
    customerMobile: "+880171500001",
    customerEmail: "",
    paymentMethod: "Cash",
    cashier: "TechStore Counter",
  },
  {
    id: "RCP-002",
    date: "2026-04-04 11:45",
    items: [
      { id: 1, name: "Wireless Headphones Pro", price: 89.99, qty: 1, sku: "PRO-1001" },
    ],
    itemCount: 1,
    subtotal: 89.99,
    discountPercent: 0,
    discountAmount: 0,
    total: 89.99,
    type: "Online",
    customerName: "John Doe",
    customerMobile: "+880171500002",
    customerEmail: "john@example.com",
    paymentMethod: "Online Payment",
    cashier: "Website Checkout",
  },
];

type ProviderSalesContextValue = {
  products: PosProduct[];
  cart: SaleCartItem[];
  receipts: ReceiptRecord[];
  subtotal: number;
  totalItems: number;
  addToSale: (product: PosProduct) => void;
  updateQty: (productId: number, qty: number) => void;
  removeFromSale: (productId: number) => void;
  clearSale: () => void;
  completeSale: (input: {
    customerName: string;
    customerMobile: string;
    customerEmail?: string;
    paymentMethod: string;
    discountPercent: number;
  }) => ReceiptRecord | null;
};

const STORAGE_KEY = "smallshop-provider-receipts";

const ProviderSalesContext = createContext<ProviderSalesContextValue | null>(null);

const getInitialReceipts = (): ReceiptRecord[] => {
  if (typeof window === "undefined") {
    return INITIAL_RECEIPTS;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ReceiptRecord[]) : INITIAL_RECEIPTS;
  } catch {
    return INITIAL_RECEIPTS;
  }
};

export const ProviderSalesProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<SaleCartItem[]>([]);
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(getInitialReceipts);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  }, [receipts]);

  const addToSale = (product: PosProduct) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }

      return [...current, { ...product, qty: 1 }];
    });
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      setCart((current) => current.filter((item) => item.id !== productId));
      return;
    }

    setCart((current) =>
      current.map((item) => (item.id === productId ? { ...item, qty } : item)),
    );
  };

  const removeFromSale = (productId: number) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const clearSale = () => {
    setCart([]);
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart],
  );
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const completeSale = ({
    customerName,
    customerMobile,
    customerEmail,
    paymentMethod,
    discountPercent,
  }: {
    customerName: string;
    customerMobile: string;
    customerEmail?: string;
    paymentMethod: string;
    discountPercent: number;
  }) => {
    if (!cart.length) {
      return null;
    }

    const discountAmount = subtotal * (Math.max(discountPercent, 0) / 100);
    const total = Math.max(subtotal - discountAmount, 0);
    const now = new Date();
    const receipt: ReceiptRecord = {
      id: `RCP-${Date.now().toString().slice(-6)}`,
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      items: cart,
      itemCount: totalItems,
      subtotal,
      discountPercent,
      discountAmount,
      total,
      type: "POS",
      customerName,
      customerMobile,
      customerEmail,
      paymentMethod,
      cashier: "TechStore Counter",
    };

    setReceipts((current) => [receipt, ...current]);
    clearSale();

    return receipt;
  };

  return (
    <ProviderSalesContext.Provider
      value={{
        products: PROVIDER_PRODUCTS,
        cart,
        receipts,
        subtotal,
        totalItems,
        addToSale,
        updateQty,
        removeFromSale,
        clearSale,
        completeSale,
      }}
    >
      {children}
    </ProviderSalesContext.Provider>
  );
};

export const useProviderSales = () => {
  const context = useContext(ProviderSalesContext);

  if (!context) {
    throw new Error("useProviderSales must be used within ProviderSalesProvider");
  }

  return context;
};
