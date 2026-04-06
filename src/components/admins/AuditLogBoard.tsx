import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LogCategory =
  | "Audit/Compliance"
  | "Security"
  | "Operations"
  | "Business";

type LogType =
  | "Audit Log"
  | "Admin Log"
  | "Privacy Log"
  | "Auth Log"
  | "Fraud Log"
  | "Access Log"
  | "Error Log"
  | "Job Log"
  | "Integration Log"
  | "Performance Log"
  | "Order Log"
  | "Payment Log"
  | "Inventory Log"
  | "Customer Activity Log"
  | "Search Log";

type LogRecord = {
  id: string;
  time: string;
  actor: string;
  action: string;
  area: string;
  severity: "Info" | "Medium" | "High";
  category: LogCategory;
  type: LogType;
};

const auditLogs: LogRecord[] = [
  { id: "AUD-1001", time: "2026-04-06 10:45", actor: "Admin Sarah Johnson", action: "Approved provider TechStore", area: "Provider Management", severity: "Info", category: "Audit/Compliance", type: "Audit Log" },
  { id: "ADM-1002", time: "2026-04-06 09:30", actor: "Super Admin", action: "Created admin Mike Chen", area: "Admin Management", severity: "High", category: "Audit/Compliance", type: "Admin Log" },
  { id: "PRV-1003", time: "2026-04-06 08:40", actor: "Compliance Bot", action: "Logged customer data export request", area: "Privacy", severity: "Medium", category: "Audit/Compliance", type: "Privacy Log" },
  { id: "AUTH-1004", time: "2026-04-06 07:20", actor: "provider@smallshop.com", action: "Successful login from Dhaka", area: "Authentication", severity: "Info", category: "Security", type: "Auth Log" },
  { id: "FRD-1005", time: "2026-04-05 19:10", actor: "Fraud Monitor", action: "Flagged repeated checkout attempts", area: "Checkout", severity: "High", category: "Security", type: "Fraud Log" },
  { id: "ACC-1006", time: "2026-04-05 17:30", actor: "Admin Lisa Park", action: "Accessed provider financial report", area: "Permissions", severity: "Medium", category: "Security", type: "Access Log" },
  { id: "ERR-1007", time: "2026-04-05 16:20", actor: "System", action: "Webhook timeout on payment sync", area: "Payments", severity: "High", category: "Operations", type: "Error Log" },
  { id: "JOB-1008", time: "2026-04-05 15:05", actor: "Scheduler", action: "Nightly settlement job completed", area: "Background Jobs", severity: "Info", category: "Operations", type: "Job Log" },
  { id: "INT-1009", time: "2026-04-05 14:15", actor: "Integration Service", action: "Courier sync successful", area: "Courier API", severity: "Info", category: "Operations", type: "Integration Log" },
  { id: "PERF-1010", time: "2026-04-05 13:10", actor: "APM Monitor", action: "Checkout page latency crossed threshold", area: "Frontend Performance", severity: "Medium", category: "Operations", type: "Performance Log" },
  { id: "ORD-1011", time: "2026-04-05 12:45", actor: "Admin Sarah Johnson", action: "Updated order #ORD-1002 to Processing", area: "Orders", severity: "Info", category: "Business", type: "Order Log" },
  { id: "PAY-1012", time: "2026-04-05 11:55", actor: "Payment Gateway", action: "Captured payment for PAY-1001", area: "Payments", severity: "Info", category: "Business", type: "Payment Log" },
  { id: "INV-1013", time: "2026-04-05 11:10", actor: "Catalog Service", action: "Reduced stock for Wireless Headphones", area: "Inventory", severity: "Info", category: "Business", type: "Inventory Log" },
  { id: "CUS-1014", time: "2026-04-05 10:50", actor: "Customer Jane Smith", action: "Viewed product and added item to cart", area: "Customer Activity", severity: "Info", category: "Business", type: "Customer Activity Log" },
  { id: "SRC-1015", time: "2026-04-05 09:25", actor: "Search Engine", action: "Trending search detected for wireless headphones", area: "Discovery", severity: "Info", category: "Business", type: "Search Log" },
];

const AuditLogBoard = ({ role }: { role: "admin" | "super-admin" }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<LogCategory | "All">("All");

  const categories: Array<LogCategory | "All"> = [
    "All",
    "Audit/Compliance",
    "Security",
    "Operations",
    "Business",
  ];

  const filteredLogs = useMemo(
    () =>
      auditLogs.filter((log) =>
        (activeCategory === "All" || log.category === activeCategory) &&
        [log.id, log.actor, log.action, log.area, log.severity, log.type, log.category].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [activeCategory, search],
  );

  const summary = useMemo(
    () =>
      categories
        .filter((category): category is LogCategory => category !== "All")
        .map((category) => ({
          category,
          count: auditLogs.filter((log) => log.category === category).length,
        })),
    [],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Log Center</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {role === "super-admin"
            ? "Review audit/compliance, security, operations, and business logs across the platform."
            : "Review operational admin logs across compliance, security, operations, and business activity."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summary.map((item) => (
          <div key={item.category} className="rounded-xl border bg-card p-5">
            <div className="text-sm text-muted-foreground">{item.category}</div>
            <div className="text-2xl font-bold mt-2">{item.count}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Log ID</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Time</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Actor</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Area</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Severity</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium">{log.id}</td>
                <td className="p-3 text-muted-foreground">{log.time}</td>
                <td className="p-3">{log.category}</td>
                <td className="p-3">{log.type}</td>
                <td className="p-3">{log.actor}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3 text-muted-foreground">{log.area}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${log.severity === "High" ? "bg-destructive/10 text-destructive" : log.severity === "Medium" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}>
                    {log.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogBoard;
