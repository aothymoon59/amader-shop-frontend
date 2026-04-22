import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
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
    path: "admin/dashboard",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: "admin/products",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminProducts /></ProtectedRoute>,
  },
  {
    path: "admin/manage-products",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminProducts /></ProtectedRoute>,
  },
  {
    path: "admin/orders",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminOrders /></ProtectedRoute>,
  },
  {
    path: "admin/delivery-zones",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminDeliveryZones /></ProtectedRoute>,
  },
  {
    path: "admin/payments",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminPayments /></ProtectedRoute>,
  },
  {
    path: "admin/wallet",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminWallet /></ProtectedRoute>,
  },
  {
    path: "admin/providers",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminProviders /></ProtectedRoute>,
  },
  {
    path: "admin/customers",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminCustomers /></ProtectedRoute>,
  },
  {
    path: "admin/reports",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminReports /></ProtectedRoute>,
  },
  {
    path: "admin/reviews",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminReviews /></ProtectedRoute>,
  },
  {
    path: "admin/cms",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminCMS /></ProtectedRoute>,
  },
  {
    path: "admin/cms/management",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminCMS /></ProtectedRoute>,
  },
  {
    path: "admin/cms/site-config",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminSiteConfig /></ProtectedRoute>,
  },
  {
    path: "admin/settings",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>,
  },
  {
    path: "admin/audit-log",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminAuditLog /></ProtectedRoute>,
  },
];
