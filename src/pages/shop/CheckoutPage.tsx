import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";

const isImageUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://");

const CheckoutPage = () => {
  const { items, subtotal, shipping, total, placeOrder, lastOrder } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handlePlaceOrder = (event: FormEvent<HTMLFormElement>) => {
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

    placeOrder(formData);
    toast({
      title: "Order placed successfully",
      description: "Your order has been saved. You can plug in payment later.",
    });
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zipCode: "",
      phone: "",
      email: "",
    });
  };

  return (
    <PublicLayout>
      <div className="container py-8 lg:py-12 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {lastOrder && items.length === 0 && (
          <div className="rounded-xl border bg-card p-8 text-center mb-8">
            <h2 className="text-2xl font-semibold mb-3">Order placed successfully</h2>
            <p className="text-muted-foreground mb-2">
              Thank you, {lastOrder.customerName || "Customer"}.
            </p>
            <p className="text-muted-foreground mb-6">
              Your order for {lastOrder.itemCount} item(s) totaling ${lastOrder.total.toFixed(2)} has been recorded.
            </p>
            <Link to="/products">
              <Button variant="hero">Continue Shopping</Button>
            </Link>
          </div>
        )}

        {items.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No items ready for checkout</h2>
            <p className="text-muted-foreground mb-6">
              Add some products to your cart first, then come back here to place the order.
            </p>
            <Link to="/products">
              <Button variant="hero">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handlePlaceOrder}>
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} placeholder="John" className="mt-1.5" /></div>
                  <div><Label>Last Name</Label><Input value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Doe" className="mt-1.5" /></div>
                  <div className="sm:col-span-2"><Label>Address</Label><Input value={formData.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="123 Main St" className="mt-1.5" /></div>
                  <div><Label>City</Label><Input value={formData.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="Dhaka" className="mt-1.5" /></div>
                  <div><Label>ZIP Code</Label><Input value={formData.zipCode} onChange={(e) => handleChange("zipCode", e.target.value)} placeholder="1207" className="mt-1.5" /></div>
                  <div><Label>Phone</Label><Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+8801XXXXXXXXX" className="mt-1.5" /></div>
                  <div><Label>Email</Label><Input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="john@example.com" className="mt-1.5" /></div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
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
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="font-semibold text-primary">
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 h-fit">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full mt-6">
                Place Order - ${total.toFixed(2)}
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Payment gateway integration can be added later. This currently saves the order flow only.
              </p>
            </div>
          </form>
        )}
      </div>
    </PublicLayout>
  );
};

export default CheckoutPage;
