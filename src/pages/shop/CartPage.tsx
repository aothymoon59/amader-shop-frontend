import { Link, useLocation } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Select } from "antd";

import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { formatCurrencyAmount } from "@/utils/currency";

const isImageUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://");

const CartPage = () => {
  const location = useLocation();
  const {
    items,
    subtotal,
    shipping,
    total,
    removeFromCart,
    updateQuantity,
    deliveryZoneId,
    setDeliveryZoneId,
    deliveryMode,
    setDeliveryMode,
    eligibleDeliveryZones,
    pricingMessage,
    canCheckout,
    isCartSyncing,
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const isPurchaseDisabled =
    user?.role === "admin" ||
    user?.role === "super-admin" ||
    user?.role === "provider";
  const checkoutPath = isAuthenticated ? "/checkout" : "/login";
  const checkoutState = isAuthenticated
    ? undefined
    : {
        from: {
          pathname:
            location.pathname === "/cart" ? "/checkout" : location.pathname,
        },
      };

  console.log("eligibleDeliveryZones:", eligibleDeliveryZones);

  return (
    <PublicLayout>
      <div className="container py-8 lg:py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 && (
              <div className="rounded-xl border bg-card p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Add a product to your cart to see the order summary and
                  continue to checkout.
                </p>
                <Link to="/products">
                  <Button variant="hero">Browse Products</Button>
                </Link>
              </div>
            )}

            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl border bg-card"
              >
                <div className="h-20 w-20 rounded-lg bg-secondary flex items-center justify-center text-3xl shrink-0">
                  {isImageUrl(item.image) ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    item.image
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <div className="text-primary font-bold">
                    {formatCurrencyAmount(item.price, currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    by {item.vendor}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card p-6 h-fit">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="space-y-2 rounded-lg border bg-secondary/30 p-3">
                <div className="text-sm font-medium">Delivery</div>
                <Select
                  className="w-full"
                  placeholder="Select delivery zone"
                  value={deliveryZoneId || undefined}
                  onChange={(value) => setDeliveryZoneId(value)}
                  options={eligibleDeliveryZones.map((zone) => ({
                    value: zone.id,
                    label: zone.name,
                  }))}
                />
                <Select
                  className="w-full"
                  value={deliveryMode}
                  onChange={(value) => setDeliveryMode(value)}
                  options={[
                    { value: "NORMAL", label: "Normal delivery" },
                    { value: "EXPRESS", label: "Express delivery" },
                  ]}
                />
                {pricingMessage ? (
                  <div className="text-xs text-muted-foreground">
                    {pricingMessage}
                  </div>
                ) : null}
                {isCartSyncing ? (
                  <div className="text-xs text-muted-foreground">
                    Updating common delivery zones...
                  </div>
                ) : null}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrencyAmount(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-accent font-medium">
                  {shipping === 0
                    ? "Free"
                    : formatCurrencyAmount(shipping, currency)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">
                  {formatCurrencyAmount(total, currency)}
                </span>
              </div>
            </div>
            {isPurchaseDisabled ? (
              <Button variant="hero" className="mt-6 w-full" size="lg" disabled>
                <ShoppingBag className="mr-2 h-5 w-5" /> Checkout
              </Button>
            ) : (
              <Link to={checkoutPath} state={checkoutState}>
                <Button
                  variant="hero"
                  className="mt-6 w-full"
                  size="lg"
                  disabled={
                    items.length === 0 ||
                    (isAuthenticated && (!canCheckout || isCartSyncing))
                  }
                >
                  <ShoppingBag className="mr-2 h-5 w-5" /> Checkout
                </Button>
              </Link>
            )}
            {!isAuthenticated && items.length > 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                You can add items to cart as a guest. Login is required only
                when you continue to checkout.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CartPage;
