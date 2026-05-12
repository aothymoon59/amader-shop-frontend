import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../components/layouts/DashboardLayout";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ProviderExpenseTracker from "../pages/provider/ProviderExpenseTracker";
import ProviderInventory from "../pages/provider/ProviderInventory";
import ProviderOrders from "../pages/provider/ProviderOrders";
import ProviderPayments from "../pages/provider/ProviderPayments";
import ProviderPOS from "../pages/provider/ProviderPOS";
import ProviderProducts from "../pages/provider/ProviderProducts";
import ProviderReceipts from "../pages/provider/ProviderReceipts";
import ProviderReviews from "../pages/provider/ProviderReviews";
import ProviderReports from "../pages/provider/ProviderReports";
import ProviderSettings from "../pages/provider/ProviderSettings";
import ProviderWallet from "../pages/provider/ProviderWallet";
import ChatPage from "../pages/chat/ChatPage";

export const providerRoutes: RouteObject[] = [
  {
    path: "provider",
    element: (
      <ProtectedRoute allowedRoles={["provider"]}>
        <DashboardLayout role="provider" />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <ProviderDashboard /> },
      { path: "products", element: <ProviderProducts /> },
      { path: "inventory", element: <ProviderInventory /> },
      { path: "orders", element: <ProviderOrders /> },
      { path: "payments", element: <ProviderPayments /> },
      { path: "wallet", element: <ProviderWallet /> },
      { path: "reviews", element: <ProviderReviews /> },
      { path: "expense-tracker", element: <ProviderExpenseTracker /> },
      { path: "pos", element: <ProviderPOS /> },
      { path: "receipts", element: <ProviderReceipts /> },
      { path: "reports", element: <ProviderReports /> },
      { path: "chat", element: <ChatPage /> },
      { path: "settings", element: <ProviderSettings /> },
    ],
  },
];
