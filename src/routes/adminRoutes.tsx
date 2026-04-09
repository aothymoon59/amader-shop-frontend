import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminAuditLog from "../pages/admin/AdminAuditLog";
import AdminCMS from "../pages/admin/AdminCMS";
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProviders from "../pages/admin/AdminProviders";
import AdminReports from "../pages/admin/AdminReports";
import AdminSettings from "../pages/admin/AdminSettings";

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
    path: "admin/cms",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminCMS /></ProtectedRoute>,
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
