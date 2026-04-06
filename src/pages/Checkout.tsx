import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Checkout = () => (
  <PublicLayout>
    <div className="container py-8 lg:py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="space-y-8">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input placeholder="John" className="mt-1.5" /></div>
            <div><Label>Last Name</Label><Input placeholder="Doe" className="mt-1.5" /></div>
            <div className="sm:col-span-2"><Label>Address</Label><Input placeholder="123 Main St" className="mt-1.5" /></div>
            <div><Label>City</Label><Input placeholder="New York" className="mt-1.5" /></div>
            <div><Label>ZIP Code</Label><Input placeholder="10001" className="mt-1.5" /></div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><Label>Card Number</Label><Input placeholder="4242 4242 4242 4242" className="mt-1.5" /></div>
            <div><Label>Expiry</Label><Input placeholder="MM/YY" className="mt-1.5" /></div>
            <div><Label>CVC</Label><Input placeholder="123" className="mt-1.5" /></div>
          </div>
        </div>
        <Button variant="hero" size="lg" className="w-full">Place Order — $159.97</Button>
      </div>
    </div>
  </PublicLayout>
);

export default Checkout;
