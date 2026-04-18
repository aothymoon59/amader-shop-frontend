import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { Select } from "antd";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import {
  useCheckoutMutation,
  type CheckoutPaymentMethod,
} from "@/redux/features/orders/orderApi";
import { formatCurrencyAmount } from "@/utils/currency";

const isImageUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://");

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    items,
    subtotal,
    shipping,
    total,
    placeOrder,
    deliveryZoneId,
    setDeliveryZoneId,
    deliveryMode,
    setDeliveryMode,
    eligibleDeliveryZones,
    pricingMessage,
    canCheckout,
    isCartSyncing,
    refreshCartPricing,
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const [checkout, { isLoading }] = useCheckoutMutation();
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    address: user?.personalAddress || "",
    city: "Dhaka",
    zipCode: "1207",
    phone: user?.personalContact || "",
    email: user?.email || "",
  });
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("COD");
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  const isPurchaseDisabled =
    user?.role === "admin" ||
    user?.role === "super-admin" ||
    user?.role === "provider";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: { from: { pathname: location.pathname } },
      });
      return;
    }

    if (isPurchaseDisabled) {
      toast({
        title: "Checkout unavailable",
        description:
          "Admin, super admin, and provider accounts cannot place customer orders.",
        variant: "destructive",
      });
      navigate("/products", { replace: true });
    }
  }, [
    isAuthenticated,
    isPurchaseDisabled,
    location.pathname,
    navigate,
  ]);

  const vendorBreakdown = useMemo(() => {
    const map = new Map<
      string,
      { vendor: string; total: number; items: typeof items }
    >();

    items.forEach((item) => {
      if (!map.has(item.vendor)) {
        map.set(item.vendor, {
          vendor: item.vendor,
          total: 0,
          items: [],
        });
      }

      const current = map.get(item.vendor);
      if (!current) return;

      current.total += item.price * item.quantity;
      current.items.push(item);
    });

    return Array.from(map.values());
  }, [items]);

  if (!isAuthenticated || isPurchaseDisabled) {
    return null;
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasEmptyField = Object.values(formData).some((value) => !value.trim());
    if (hasEmptyField) {
      toast({
        title: "Complete the checkout form",
        description: "Please fill in all fields before placing your order.",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryZoneId || !canCheckout) {
      toast({
        title: "Select delivery settings",
        description:
          pricingMessage || "Choose a valid delivery zone before placing the order.",
        variant: "destructive",
      });
      return;
    }

    try {
      const latestCart = await refreshCartPricing();
      const latestPricing = latestCart?.pricing;

      if (
        !latestPricing?.canCheckout ||
        !latestPricing?.selectedZone ||
        latestPricing.selectedZone.id !== deliveryZoneId
      ) {
        toast({
          title: "Delivery options changed",
          description:
            latestPricing?.message ||
            "Your cart's common delivery zone is no longer available. Please review your cart delivery settings.",
          variant: "destructive",
        });
        return;
      }

      const response = await checkout({
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerPhone: formData.phone,
        customerEmail: formData.email,
        shippingAddress: formData.address,
        shippingCity: formData.city,
        shippingPostalCode: formData.zipCode,
        shippingCountry: "Bangladesh",
        deliveryZoneId,
        deliveryMode,
        paymentMethod,
        idempotencyKey,
      }).unwrap();

      if (
        response.data.nextAction.type === "REDIRECT" &&
        response.data.payment?.redirectUrl
      ) {
        window.location.href = response.data.payment.redirectUrl;
        return;
      }

      placeOrder({
        ...formData,
        deliveryZoneId,
        deliveryMode,
      });
      setIdempotencyKey(crypto.randomUUID());
      navigate(
        `/checkout/payment-status?status=success&orderNumber=${encodeURIComponent(response.data.order.orderNumber)}&paymentMethod=${encodeURIComponent(response.data.order.paymentMethod)}&paymentStatus=${encodeURIComponent(response.data.order.paymentStatus)}${response.data.order.receipt?.receiptNumber ? `&receiptNumber=${encodeURIComponent(response.data.order.receipt.receiptNumber)}` : ""}`,
        { replace: true },
      );
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
          ? String(error.data.message)
          : "Something went wrong while placing the order.";

      toast({
        title: "Checkout failed",
        description: message,
        variant: "destructive",
      });
      setIdempotencyKey(crypto.randomUUID());
      navigate(
        `/checkout/payment-status?status=failed&paymentMethod=${encodeURIComponent(paymentMethod)}&message=${encodeURIComponent(message)}`,
        { replace: true },
      );
    }
  };

  return (
    <PublicLayout>
      <div className="container max-w-6xl py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-muted-foreground">
            Review your address, order summary, and payment method before placing
            the order.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold">No items ready for checkout</h2>
            <p className="mb-6 text-muted-foreground">
              Add some products to your cart first, then come back here to place
              your order.
            </p>
            <Link to="/products">
              <Button variant="hero">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <form
            className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]"
            onSubmit={handlePlaceOrder}
          >
            <div className="space-y-8">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Address</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>ZIP Code</Label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Delivery</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Delivery Zone</Label>
                    <Select
                      className="mt-1.5 w-full"
                      value={deliveryZoneId || undefined}
                      onChange={(value) => setDeliveryZoneId(value)}
                      options={eligibleDeliveryZones.map((zone) => ({
                        value: zone.id,
                        label: zone.name,
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Delivery Speed</Label>
                    <Select
                      className="mt-1.5 w-full"
                      value={deliveryMode}
                      onChange={(value) => setDeliveryMode(value)}
                      options={[
                        { value: "NORMAL", label: "Normal delivery" },
                        { value: "EXPRESS", label: "Express delivery" },
                      ]}
                    />
                  </div>
                </div>
                {pricingMessage ? (
                  <p className="mt-3 text-sm text-muted-foreground">{pricingMessage}</p>
                ) : null}
                {isCartSyncing ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Updating cart delivery availability...
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Summary</h2>
                <div className="space-y-6">
                  {vendorBreakdown.map((vendorGroup) => (
                    <div key={vendorGroup.vendor} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="font-medium">{vendorGroup.vendor}</div>
                        <div className="text-sm font-semibold text-primary">
                          {formatCurrencyAmount(vendorGroup.total, currency)}
                        </div>
                      </div>
                      <div className="space-y-3">
                        {vendorGroup.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                              {isImageUrl(item.image) ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                item.image
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.quantity} x {formatCurrencyAmount(item.price, currency)}
                              </div>
                            </div>
                            <div className="font-medium">
                              {formatCurrencyAmount(item.quantity * item.price, currency)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-fit rounded-xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Payment Method</h2>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Order is created immediately and confirmed for delivery.
                    </div>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                    className="mt-1"
                  />
                  <div className="w-full">
                  <div className="font-medium">Online Payment</div>
                  <div className="text-sm text-muted-foreground">
                    You will be redirected directly to SSLCommerz. Success
                    confirms the order and failure lets you retry.
                  </div>
                  {paymentMethod === "ONLINE" ? (
                    <div className="mt-4 rounded-md border bg-secondary/30 p-3 text-sm text-muted-foreground">
                      SSLCommerz will open after you click <span className="font-medium">Place Order</span>.
                    </div>
                  ) : null}
                  </div>
                </label>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrencyAmount(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatCurrencyAmount(shipping, currency)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrencyAmount(total, currency)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="mt-6 w-full"
                disabled={isLoading || isCartSyncing || !canCheckout}
              >
                {isLoading ? "Processing..." : isCartSyncing ? "Updating Cart..." : "Place Order"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </PublicLayout>
  );
};

export default CheckoutPage;
