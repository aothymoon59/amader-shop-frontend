import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useProviderSales } from "@/context/ProviderSalesContext";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { CreditCard, Minus, Plus, ReceiptText, Search, X } from "lucide-react";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { formatCurrencyAmount } from "@/utils/currency";

const ProviderPOS = () => {
  const navigate = useNavigate();
  const { products, cart, subtotal, totalItems, addToSale, updateQty, removeFromSale, completeSale } = useProviderSales();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discount, setDiscount] = useState("0");

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        [product.name, product.sku].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [products, search],
  );

  const discountValue = Number(discount) || 0;
  const discountAmount = subtotal * (Math.max(discountValue, 0) / 100);
  const grandTotal = Math.max(subtotal - discountAmount, 0);

  const handleCompleteSale = () => {
    if (!cart.length) {
      toast({
        title: "No items in cart",
        description: "Add products to the current sale before checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!customerMobile.trim()) {
      toast({
        title: "Customer mobile is required",
        description: "Please enter the customer's mobile number before completing the sale.",
        variant: "destructive",
      });
      return;
    }

    const receipt = completeSale({
      customerName: customerName.trim() || "Walk-in Customer",
      customerMobile: customerMobile.trim(),
      customerEmail: customerEmail.trim(),
      paymentMethod,
      discountPercent: discountValue,
    });

    if (!receipt) {
      return;
    }

    toast({
      title: "Sale completed",
      description: `${receipt.id} created successfully.`,
    });
    setCustomerName("Walk-in Customer");
    setCustomerMobile("");
    setCustomerEmail("");
    setPaymentMethod("Cash");
    setDiscount("0");
    navigate("/provider/receipts");
  };

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Add Products</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search or scan barcode..."
                className="pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  className="p-4 rounded-lg border bg-secondary/50 hover:bg-secondary text-sm font-medium text-left transition-colors"
                  onClick={() => addToSale(product)}
                >
                  <div>{product.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{product.sku}</div>
                  <div className="text-primary font-semibold mt-2">
                    {formatCurrencyAmount(product.price, currency)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Current Sale</h2>
            <div className="space-y-3 mb-6">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.sku}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.id, item.qty - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-medium w-6 text-center">{item.qty}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.id, item.qty + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="font-medium text-sm">
                      {formatCurrencyAmount(item.price * item.qty, currency)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromSale(item.id)}><X className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-sm text-muted-foreground py-6 text-center">
                  Add products from the left to start a new POS sale.
                </div>
              )}
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium">Customer Name</label>
                <Input className="mt-1.5" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Customer Mobile</label>
                <Input
                  className="mt-1.5"
                  value={customerMobile}
                  onChange={(event) => setCustomerMobile(event.target.value)}
                  placeholder="+8801XXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground mt-1">Required for POS checkout.</p>
              </div>
              <div>
                <label className="text-sm font-medium">Customer Email</label>
                <Input
                  type="email"
                  className="mt-1.5"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder="customer@example.com"
                />
                <p className="text-xs text-muted-foreground mt-1">Optional.</p>
              </div>
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Discount Percentage</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  className="mt-1.5"
                  value={discount}
                  onChange={(event) => setDiscount(event.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Enter percentage, for example `10` for 10%.</p>
              </div>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Items</span><span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Subtotal</span><span>{formatCurrencyAmount(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Discount ({discountValue.toFixed(2)}%)</span><span>{formatCurrencyAmount(discountAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span><span className="text-primary">{formatCurrencyAmount(grandTotal, currency)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" size="lg" onClick={() => navigate("/provider/receipts")}>
                <ReceiptText className="mr-2 h-5 w-5" /> Receipts
              </Button>
              <Button variant="hero" className="flex-1" size="lg" onClick={handleCompleteSale}>
              <CreditCard className="mr-2 h-5 w-5" /> Complete Sale
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderPOS;
