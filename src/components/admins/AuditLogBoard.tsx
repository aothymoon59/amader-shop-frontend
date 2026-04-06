import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

const auditLogs = [
  { id: "LOG-1001", time: "2026-04-06 10:45", actor: "Admin Sarah Johnson", action: "Approved provider TechStore", area: "Provider Management", severity: "Info" },
  { id: "LOG-1002", time: "2026-04-06 09:30", actor: "Super Admin", action: "Created admin Mike Chen", area: "Admin Management", severity: "High" },
  { id: "LOG-1003", time: "2026-04-05 18:20", actor: "Admin Lisa Park", action: "Updated order #ORD-1002 to Processing", area: "Orders", severity: "Info" },
  { id: "LOG-1004", time: "2026-04-05 16:10", actor: "Admin Sarah Johnson", action: "Edited product Wireless Headphones", area: "Catalog", severity: "Medium" },
  { id: "LOG-1005", time: "2026-04-05 14:00", actor: "Super Admin", action: "Changed system settings", area: "Settings", severity: "High" },
];

const AuditLogBoard = ({ role }: { role: "admin" | "super-admin" }) => {
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(
    () =>
      auditLogs.filter((log) =>
        [log.id, log.actor, log.action, log.area, log.severity].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [search],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {role === "super-admin"
            ? "Review high-level admin and system activity across the platform."
            : "Review admin activity across operational areas and moderation actions."}
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search audit logs..."
          className="pl-10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Log ID</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Time</th>
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
