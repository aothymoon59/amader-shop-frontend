import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

const cartItems = [
  { id: 1, name: "Wireless Headphones Pro", price: 89.99, qty: 1, emoji: "🎧" },
  { id: 2, name: "Organic Cotton Tee", price: 34.99, qty: 2, emoji: "👕" },
];

const Cart = () => {
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <PublicLayout>
      <div className="container py-8 lg:py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                <div className="h-20 w-20 rounded-lg bg-secondary flex items-center justify-center text-3xl shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <div className="text-primary font-bold">${item.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8"><Minus className="h-3 w-3" /></Button>
                  <span className="w-8 text-center font-medium">{item.qty}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8"><Plus className="h-3 w-3" /></Button>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
          <div className="rounded-xl border bg-card p-6 h-fit">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-accent font-medium">Free</span></div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base">
                <span>Total</span><span className="text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button variant="hero" className="w-full mt-6" size="lg">
                <ShoppingBag className="mr-2 h-5 w-5" /> Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Cart;
