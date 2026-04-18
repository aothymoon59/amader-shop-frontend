import { useDeferredValue, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Empty, Pagination, Spin } from "antd";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  type AuditLogCategory,
  type AuditLogRecord,
  useGetAuditLogsQuery,
} from "@/redux/features/audit-logs/auditLogsApi";

const categories: Array<AuditLogCategory | "All"> = [
  "All",
  "Audit/Compliance",
  "Security",
  "Operations",
  "Business",
];

const AuditLogBoard = ({ role }: { role: "admin" | "super-admin" }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<AuditLogCategory | "All">("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, deferredSearch]);

  const { data, isLoading, isFetching } = useGetAuditLogsQuery({
    page,
    limit,
    search: deferredSearch || undefined,
    category: activeCategory,
  });

  const summary = data?.data?.summary || [];
  const logs = data?.data?.logs || [];
  const meta = data?.meta;

  const formatLogTime = (value: string) =>
    new Date(value).toLocaleString("en-BD", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

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
        {categories
          .filter((category): category is AuditLogCategory => category !== "All")
          .map((category) => {
            const item = summary.find((summaryItem) => summaryItem.category === category);
            return (
              <div key={category} className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">{category}</div>
                <div className="text-2xl font-bold mt-2">{item?.count || 0}</div>
              </div>
            );
          })}
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
        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <Spin size="large" />
          </div>
        ) : logs.length ? (
          <>
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
                {logs.map((log: AuditLogRecord) => (
                  <tr key={`${log.id}-${log.time}`} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-3 font-medium">{log.id}</td>
                    <td className="p-3 text-muted-foreground">{formatLogTime(log.time)}</td>
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
            <div className="flex items-center justify-between gap-4 border-t px-4 py-3">
              <div className="text-sm text-muted-foreground">
                Showing {logs.length} of {meta?.total || 0} log entries
              </div>
              <Pagination
                current={meta?.page || page}
                pageSize={meta?.limit || limit}
                total={meta?.total || 0}
                showSizeChanger
                pageSizeOptions={["10", "20", "50", "100"]}
                onChange={(nextPage, nextPageSize) => {
                  setPage(nextPage);
                  setLimit(nextPageSize);
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center">
            <Empty
              description={
                isFetching ? "Refreshing audit logs..." : "No log records found for the current filter."
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogBoard;
