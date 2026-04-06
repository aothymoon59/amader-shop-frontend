import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, CreditCard } from "lucide-react";

interface CartItem {
  name: string;
  price: number;
  qty: number;
}

const ProviderPOS = () => {
  const [cart, setCart] = useState<CartItem[]>([
    { name: "Wireless Headphones", price: 89.99, qty: 1 },
    { name: "USB-C Cable", price: 19.99, qty: 2 },
  ]);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product search */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Add Products</h2>
            <Input placeholder="Search or scan barcode..." className="mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {["Headphones $89.99", "Speaker $129.99", "Cable $19.99", "Keyboard $59.99"].map((p) => (
                <button key={p} className="p-4 rounded-lg border bg-secondary/50 hover:bg-secondary text-sm font-medium text-center transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Current Sale</h2>
            <div className="space-y-3 mb-6">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">x{item.qty}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">${(item.price * item.qty).toFixed(2)}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><X className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <Button variant="hero" className="w-full" size="lg">
              <CreditCard className="mr-2 h-5 w-5" /> Complete Sale
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderPOS;
