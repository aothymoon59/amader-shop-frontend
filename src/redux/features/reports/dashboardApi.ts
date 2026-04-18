import { baseApi } from "@/redux/api/baseApi";

export type DashboardStat = {
  value: number;
  change: number;
};

export type DashboardSeriesPoint = {
  date: string;
  orders?: number;
  revenue?: number;
  sales?: number;
};

export type AdminRecentOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export type AdminTopProduct = {
  name: string;
  quantitySold: number;
  revenue: number;
  stock: number;
};

export type AdminDashboardOverview = {
  role: "ADMIN";
  stats: {
    totalRevenue: DashboardStat;
    orders: DashboardStat;
    products: DashboardStat;
    customers: DashboardStat;
  };
  spotlight: {
    todaySales: number;
    newOrders: number;
    visitors: number;
    summaryTitle: string;
    summaryText: string;
  };
  quickSummary: {
    pendingOrders: number;
    lowStockProducts: number;
    newCustomers: number;
  };
  recentOrders: AdminRecentOrder[];
  charts: {
    performance: DashboardSeriesPoint[];
    topProducts: AdminTopProduct[];
  };
};

export type ProviderRecentSale = {
  id: string;
  product: string;
  amount: number;
  quantity: number;
  status: string;
  createdAt: string;
};

export type ProviderTopProduct = {
  name: string;
  sold: number;
  stock: number;
  revenue: number;
};

export type ProviderWalletSnapshot = {
  availableBalance: number;
  pendingBalance: number;
  lockedBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
};

export type ProviderDashboardOverview = {
  role: "PROVIDER";
  profile: {
    shopName: string;
    status: string;
    isActive: boolean;
  };
  stats: {
    revenue: DashboardStat;
    products: DashboardStat;
    orders: DashboardStat;
    growth: DashboardStat;
  };
  spotlight: {
    todaySales: number;
    pendingOrders: number;
    activeProducts: number;
    summaryTitle: string;
    summaryText: string;
  };
  recentSales: ProviderRecentSale[];
  quickSummary: {
    walletBalance: number;
    pendingBalance: number;
    itemsLowInStock: number;
    totalWithdrawn: number;
  };
  charts: {
    performance: DashboardSeriesPoint[];
    topProducts: ProviderTopProduct[];
  };
  wallet: ProviderWalletSnapshot;
};

export type SuperAdminActivity = {
  action: string;
  createdAt: string;
};

export type SuperAdminDashboardOverview = {
  role: "SUPER_ADMIN";
  stats: {
    totalAdmins: number;
    totalProviders: number;
    totalUsers: number;
    totalOrders: number;
    pendingProviderApplications: number;
    activeProviders: number;
  };
  charts: {
    systemOrders: DashboardSeriesPoint[];
  };
  recentActivity: SuperAdminActivity[];
};

export type DashboardOverviewData =
  | AdminDashboardOverview
  | ProviderDashboardOverview
  | SuperAdminDashboardOverview;

export type DashboardOverviewResponse = {
  success: boolean;
  message?: string;
  data: DashboardOverviewData;
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverviewResponse, void>({
      query: () => ({
        url: "/dashboard-overview",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardApi;
