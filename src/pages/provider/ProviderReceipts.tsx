import { useMemo, useState } from "react";
import { Eye, Printer, Search } from "lucide-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useProviderSales, type ReceiptRecord } from "@/context/ProviderSalesContext";

const ProviderReceipts = () => {
  const { receipts } = useProviderSales();
  const [search, setSearch] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord | null>(null);

  const filteredReceipts = useMemo(
    () =>
      receipts.filter((receipt) =>
        [
          receipt.id,
          receipt.customerName,
          receipt.customerMobile,
          receipt.customerEmail || "",
          receipt.paymentMethod,
          receipt.type,
        ].some((value) => value.toLowerCase().includes(search.toLowerCase())),
      ),
    [receipts, search],
  );

  const handlePrint = (receiptId: string) => {
    toast({
      title: "Print ready",
      description: `Receipt ${receiptId} is ready for printer integration.`,
    });
  };

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Receipts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review generated POS and online receipts, then open or print them.
            </p>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search receipts..."
              className="pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredReceipts.map((receipt) => (
            <div key={receipt.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{receipt.id}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{receipt.type}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">{receipt.paymentMethod}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {receipt.date} · {receipt.itemCount} items · ${receipt.total.toFixed(2)} · {receipt.customerName}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedReceipt(receipt)}><Eye className="mr-1 h-4 w-4" /> View</Button>
                <Button variant="ghost" size="sm" onClick={() => handlePrint(receipt.id)}><Printer className="mr-1 h-4 w-4" /> Print</Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={Boolean(selectedReceipt)} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
          <DialogContent className="sm:max-w-2xl">
            {selectedReceipt && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedReceipt.id}</DialogTitle>
                  <DialogDescription>
                    Receipt details for {selectedReceipt.customerName}.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Customer</div>
                    <div className="font-medium">{selectedReceipt.customerName}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Customer Mobile</div>
                    <div className="font-medium">{selectedReceipt.customerMobile}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Customer Email</div>
                    <div className="font-medium">{selectedReceipt.customerEmail || "Not provided"}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Payment Method</div>
                    <div className="font-medium">{selectedReceipt.paymentMethod}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Date</div>
                    <div className="font-medium">{selectedReceipt.date}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Cashier</div>
                    <div className="font-medium">{selectedReceipt.cashier}</div>
                  </div>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium text-muted-foreground">Item</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Qty</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Unit Price</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReceipt.items.map((item) => (
                        <tr key={`${selectedReceipt.id}-${item.id}`} className="border-b last:border-0">
                          <td className="p-3">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.sku}</div>
                          </td>
                          <td className="p-3">{item.qty}</td>
                          <td className="p-3">${item.price.toFixed(2)}</td>
                          <td className="p-3">${(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2 text-sm mt-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${selectedReceipt.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Discount ({selectedReceipt.discountPercent.toFixed(2)}%)</span><span>${selectedReceipt.discountAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span className="text-primary">${selectedReceipt.total.toFixed(2)}</span></div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedReceipt(null)}>Close</Button>
                  <Button variant="hero" onClick={() => handlePrint(selectedReceipt.id)}><Printer className="mr-2 h-4 w-4" /> Print Receipt</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ProviderReceipts;
