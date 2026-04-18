import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export type AuditLogCategory =
  | "Audit/Compliance"
  | "Security"
  | "Operations"
  | "Business";

export type AuditLogType =
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

export type AuditLogRecord = {
  id: string;
  time: string;
  actor: string;
  action: string;
  area: string;
  severity: "Info" | "Medium" | "High";
  category: AuditLogCategory;
  type: AuditLogType;
};

export type AuditLogSummaryItem = {
  category: AuditLogCategory;
  count: number;
};

export type AuditLogsResponse = {
  success: boolean;
  message: string;
  meta: {
    paginate: boolean;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: {
    summary: AuditLogSummaryItem[];
    logs: AuditLogRecord[];
  };
};

export type GetAuditLogsArgs = {
  page?: number;
  limit?: number;
  search?: string;
  category?: AuditLogCategory | "All";
};

export const auditLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLogsResponse, GetAuditLogsArgs | void>({
      query: (args) => ({
        url: "/audit-logs",
        method: "GET",
        params: {
          page: args?.page,
          limit: args?.limit,
          search: args?.search,
          category: args?.category,
        },
      }),
      providesTags: [tagTypes.AUDIT_LOGS],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditLogsApi;
