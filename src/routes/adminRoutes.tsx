import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../components/layouts/DashboardLayout";
import AdminAuditLog from "../pages/admin/AdminAuditLog";
import AdminCMS from "../pages/admin/AdminCMS";
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminDeliveryZones from "../pages/admin/AdminDeliveryZones";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProviders from "../pages/admin/AdminProviders";
import AdminReports from "../pages/admin/AdminReports";
import AdminReviews from "../pages/admin/AdminReviews";
import AdminSiteConfig from "../pages/admin/AdminSiteConfig";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminWallet from "../pages/admin/AdminWallet";

export const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout role="admin" />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "products", element: <AdminProducts /> },
      { path: "manage-products", element: <AdminProducts /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "delivery-zones", element: <AdminDeliveryZones /> },
      { path: "payments", element: <AdminPayments /> },
      { path: "wallet", element: <AdminWallet /> },
      { path: "providers", element: <AdminProviders /> },
      { path: "customers", element: <AdminCustomers /> },
      { path: "reports", element: <AdminReports /> },
      { path: "reviews", element: <AdminReviews /> },
      { path: "cms", element: <AdminCMS /> },
      { path: "cms/management", element: <AdminCMS /> },
      { path: "cms/site-config", element: <AdminSiteConfig /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "audit-log", element: <AdminAuditLog /> },
    ],
  },
];
