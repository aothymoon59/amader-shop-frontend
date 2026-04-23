import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../components/layouts/DashboardLayout";
import AdminProviders from "@/pages/admin/AdminProviders";
import SuperAdminAdmins from "../pages/super-admin/SuperAdminAdmins";
import SuperAdminAuditLog from "../pages/super-admin/SuperAdminAuditLog";
import SuperAdminAnalytics from "../pages/super-admin/SuperAdminAnalytics";
import SuperAdminCMS from "../pages/super-admin/SuperAdminCMS";
import SuperAdminDashboard from "../pages/super-admin/SuperAdminDashboard";
import SuperAdminDeliveryZones from "../pages/super-admin/SuperAdminDeliveryZones";
import SuperAdminOrders from "../pages/super-admin/SuperAdminOrders";
import SuperAdminPayments from "../pages/super-admin/SuperAdminPayments";
import SuperAdminSiteConfig from "../pages/super-admin/SuperAdminSiteConfig";
import SuperAdminSettings from "../pages/super-admin/SuperAdminSettings";

export const superAdminRoutes: RouteObject[] = [
  {
    path: "super-admin",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <DashboardLayout role="super-admin" />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <SuperAdminDashboard /> },
      { path: "admins", element: <SuperAdminAdmins /> },
      { path: "providers", element: <AdminProviders /> },
      { path: "analytics", element: <SuperAdminAnalytics /> },
      { path: "orders", element: <SuperAdminOrders /> },
      { path: "delivery-zones", element: <SuperAdminDeliveryZones /> },
      { path: "payments", element: <SuperAdminPayments /> },
      { path: "settings", element: <SuperAdminSettings /> },
      { path: "audit-log", element: <SuperAdminAuditLog /> },
      { path: "cms", element: <SuperAdminCMS /> },
      { path: "cms/management", element: <SuperAdminCMS /> },
      { path: "cms/site-config", element: <SuperAdminSiteConfig /> },
    ],
  },
];
