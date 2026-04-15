import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import SuperAdminAdmins from "../pages/super-admin/SuperAdminAdmins";
import SuperAdminAuditLog from "../pages/super-admin/SuperAdminAuditLog";
import SuperAdminAnalytics from "../pages/super-admin/SuperAdminAnalytics";
import SuperAdminCMS from "../pages/super-admin/SuperAdminCMS";
import SuperAdminDashboard from "../pages/super-admin/SuperAdminDashboard";
import SuperAdminOrders from "../pages/super-admin/SuperAdminOrders";
import SuperAdminPayments from "../pages/super-admin/SuperAdminPayments";
import SuperAdminSettings from "../pages/super-admin/SuperAdminSettings";
import AdminProviders from "@/pages/admin/AdminProviders";

export const superAdminRoutes: RouteObject[] = [
  {
    path: "super-admin/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "super-admin/admins",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <SuperAdminAdmins />
      </ProtectedRoute>
    ),
  },
  {
    path: "super-admin/providers",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <AdminProviders />
      </ProtectedRoute>
    ),
  },
  {
    path: "super-admin/analytics",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <SuperAdminAnalytics />
      </ProtectedRoute>
    ),
  },
  {
    path: "super-admin/orders",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <SuperAdminOrders />
      </ProtectedRoute>
    ),
  },
  {
    path: "super-admin/payments",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <SuperAdminPayments />
      </ProtectedRoute>
    ),
  },
  {
    path: "super-admin/settings",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <SuperAdminSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: "super-admin/audit-log",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <SuperAdminAuditLog />
      </ProtectedRoute>
    ),
  },
  {
    path: "super-admin/cms",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <SuperAdminCMS />
      </ProtectedRoute>
    ),
  },
];
