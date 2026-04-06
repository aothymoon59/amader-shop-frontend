import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Printer, Eye } from "lucide-react";

const receipts = [
  { id: "RCP-001", date: "2026-04-05", items: 3, total: "$129.97", type: "POS" },
  { id: "RCP-002", date: "2026-04-04", items: 1, total: "$89.99", type: "Online" },
  { id: "RCP-003", date: "2026-04-03", items: 5, total: "$234.95", type: "POS" },
];

const ProviderReceipts = () => (
  <DashboardLayout role="provider">
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Receipts</h1>
      <div className="grid gap-4">
        {receipts.map((r) => (
          <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{r.id}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{r.type}</span>
              </div>
              <p className="text-sm text-muted-foreground">{r.date} · {r.items} items · {r.total}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Eye className="mr-1 h-4 w-4" /> View</Button>
              <Button variant="ghost" size="sm"><Printer className="mr-1 h-4 w-4" /> Print</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default ProviderReceipts;
