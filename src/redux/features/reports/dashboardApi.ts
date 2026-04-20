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

export type AdminAnalyticsMetric = {
  value: number;
  change: number;
};

export type AdminAnalyticsCategory = {
  name: string;
  value: number;
  revenue: number;
  quantitySold: number;
};

export type AdminAnalyticsProvider = {
  name: string;
  revenue: number;
  orders: number;
};

export type AdminAnalyticsInsight = {
  title?: string;
  text?: string;
  change?: number;
  label?: string;
  revenue?: number;
  orders?: number;
  name?: string;
  share?: number;
};

export type AdminReportsAnalytics = {
  generatedAt: string;
  periodLabel: string;
  summary: {
    dailySales: AdminAnalyticsMetric;
    monthlyRevenue: AdminAnalyticsMetric;
    ordersToday: AdminAnalyticsMetric;
    netProfit: AdminAnalyticsMetric;
  };
  charts: {
    weeklySales: DashboardSeriesPoint[];
    salesByCategory: AdminAnalyticsCategory[];
    topProviders: AdminAnalyticsProvider[];
  };
  insights: {
    bestSalesDay: AdminAnalyticsInsight;
    topCategory: AdminAnalyticsInsight;
    providerLeader: AdminAnalyticsInsight;
    growthNote: AdminAnalyticsInsight;
  };
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

export type AdminReportsAnalyticsResponse = {
  success: boolean;
  message?: string;
  data: AdminReportsAnalytics;
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverviewResponse, void>({
      query: () => ({
        url: "/dashboard-overview",
        method: "GET",
      }),
    }),
    getAdminReportsAnalytics:
      builder.query<AdminReportsAnalyticsResponse, void>({
        query: () => ({
          url: "/reports/admin-analytics",
          method: "GET",
        }),
      }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetAdminReportsAnalyticsQuery,
} = dashboardApi;
