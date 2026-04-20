import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export type ManualFinanceEntryType = "INCOME" | "EXPENSE";

export type ManualFinanceEntry = {
  id: string;
  providerId: string;
  entryType: ManualFinanceEntryType;
  title: string;
  amount: number;
  note: string | null;
  entryDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ManualFinanceDaySummary = {
  date: string;
  label: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  entryCount: number;
  incomeCount: number;
  expenseCount: number;
};

export type ManualFinanceSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalEntries: number;
  totalDays: number;
  periodLabel: string;
  view: "monthly" | "yearly";
  year: number;
  month: number | null;
};

export type ManualFinanceMeta = {
  paginate: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ManualFinanceDailyResponse = {
  success: boolean;
  message?: string;
  meta: ManualFinanceMeta;
  data: {
    summary: ManualFinanceSummary;
    days: ManualFinanceDaySummary[];
  };
};

export type ManualFinanceDayDetailsResponse = {
  success: boolean;
  message?: string;
  data: {
    date: string;
    label: string;
    entries: ManualFinanceEntry[];
    totals: {
      totalIncome: number;
      totalExpense: number;
      balance: number;
      entryCount: number;
    };
  };
};

export type ManualFinanceEntryResponse = {
  success: boolean;
  message?: string;
  data: ManualFinanceEntry | { id: string };
};

export type ManualFinanceFilterParams = {
  view: "monthly" | "yearly";
  month?: number;
  year: number;
  page?: number;
  limit?: number;
};

export type ManualFinanceEntryPayload = {
  entryType: ManualFinanceEntryType;
  title: string;
  amount: number;
  note?: string;
  entryDate: string;
};

export const manualFinanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManualFinanceDaily: builder.query<
      ManualFinanceDailyResponse,
      ManualFinanceFilterParams
    >({
      query: (params) => ({
        url: "/manual-finance/daily",
        method: "GET",
        params,
      }),
      providesTags: [{ type: tagTypes.MANUAL_FINANCE, id: "LIST" }],
    }),
    getManualFinanceDayDetails: builder.query<
      ManualFinanceDayDetailsResponse,
      string
    >({
      query: (date) => ({
        url: `/manual-finance/daily/${date}`,
        method: "GET",
      }),
      providesTags: (_result, _error, date) => [
        { type: tagTypes.MANUAL_FINANCE, id: "LIST" },
        { type: tagTypes.MANUAL_FINANCE, id: `DAY-${date}` },
      ],
    }),
    createManualFinanceEntry: builder.mutation<
      ManualFinanceEntryResponse,
      ManualFinanceEntryPayload
    >({
      query: (body) => ({
        url: "/manual-finance",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: tagTypes.MANUAL_FINANCE, id: "LIST" }],
    }),
    updateManualFinanceEntry: builder.mutation<
      ManualFinanceEntryResponse,
      { id: string; body: Partial<ManualFinanceEntryPayload> }
    >({
      query: ({ id, body }) => ({
        url: `/manual-finance/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: tagTypes.MANUAL_FINANCE, id: "LIST" },
        { type: tagTypes.MANUAL_FINANCE, id: id },
      ],
    }),
    deleteManualFinanceEntry: builder.mutation<
      ManualFinanceEntryResponse,
      string
    >({
      query: (id) => ({
        url: `/manual-finance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: tagTypes.MANUAL_FINANCE, id: "LIST" }],
    }),
  }),
});

export const {
  useGetManualFinanceDailyQuery,
  useGetManualFinanceDayDetailsQuery,
  useCreateManualFinanceEntryMutation,
  useUpdateManualFinanceEntryMutation,
  useDeleteManualFinanceEntryMutation,
} = manualFinanceApi;
