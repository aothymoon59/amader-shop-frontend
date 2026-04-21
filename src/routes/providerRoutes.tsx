import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import ProviderApply from "../pages/provider/ProviderApply";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ProviderExpenseTracker from "../pages/provider/ProviderExpenseTracker";
import ProviderOrders from "../pages/provider/ProviderOrders";
import ProviderPayments from "../pages/provider/ProviderPayments";
import ProviderPOS from "../pages/provider/ProviderPOS";
import ProviderProducts from "../pages/provider/ProviderProducts";
import ProviderReceipts from "../pages/provider/ProviderReceipts";
import ProviderReports from "../pages/provider/ProviderReports";
import ProviderSettings from "../pages/provider/ProviderSettings";
import ProviderWallet from "../pages/provider/ProviderWallet";

export const providerRoutes: RouteObject[] = [
  {
    path: "provider/apply",
    element: <ProviderApply />,
  },
  {
    path: "provider/dashboard",
    element: <ProtectedRoute allowedRoles={["provider"]}><ProviderDashboard /></ProtectedRoute>,
  },
  {
    path: "provider/products",
    element: <ProtectedRoute allowedRoles={["provider"]}><ProviderProducts /></ProtectedRoute>,
  },
  {
    path: "provider/orders",
    element: <ProtectedRoute allowedRoles={["provider"]}><ProviderOrders /></ProtectedRoute>,
  },
  {
    path: "provider/payments",
    element: <ProtectedRoute allowedRoles={["provider"]}><ProviderPayments /></ProtectedRoute>,
  },
  {
    path: "provider/wallet",
    element: <ProtectedRoute allowedRoles={["provider"]}><ProviderWallet /></ProtectedRoute>,
  },
  {
    path: "provider/expense-tracker",
    element: <ProtectedRoute allowedRoles={["provider"]}><ProviderExpenseTracker /></ProtectedRoute>,
  },
  {
    path: "provider/pos",
    element: <ProtectedRoute allowedRoles={["provider"]}><ProviderPOS /></ProtectedRoute>,
  },
  {
    path: "provider/receipts",
    element: <ProtectedRoute allowedRoles={["provider"]}><ProviderReceipts /></ProtectedRoute>,
  },
  {
    path: "provider/reports",
    element: <ProtectedRoute allowedRoles={["provider"]}><ProviderReports /></ProtectedRoute>,
  },
  {
    path: "provider/settings",
    element: <ProtectedRoute allowedRoles={["provider"]}><ProviderSettings /></ProtectedRoute>,
  },
];
