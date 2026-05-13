import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../components/layouts/DashboardLayout";
import AdminProviders from "@/pages/admin/AdminProviders";
import SuperAdminAdmins from "../pages/super-admin/SuperAdminAdmins";
import SuperAdminAuditLog from "../pages/super-admin/SuperAdminAuditLog";
import SuperAdminAnalytics from "../pages/super-admin/SuperAdminAnalytics";
import SuperAdminCMS from "../pages/super-admin/SuperAdminCMS";
import SuperAdminCMSAbout from "../pages/super-admin/SuperAdminCMSAbout";
import SuperAdminCMSCommon from "../pages/super-admin/SuperAdminCMSCommon";
import SuperAdminCMSContact from "../pages/super-admin/SuperAdminCMSContact";
import SuperAdminCMSHome from "../pages/super-admin/SuperAdminCMSHome";
import SuperAdminCMSLegal from "../pages/super-admin/SuperAdminCMSLegal";
import SuperAdminCMSProducts from "../pages/super-admin/SuperAdminCMSProducts";
import SuperAdminContactMessages from "../pages/super-admin/SuperAdminContactMessages";
import SuperAdminCmsSystem from "../pages/super-admin/SuperAdminCmsSystem";
import SuperAdminDashboard from "../pages/super-admin/SuperAdminDashboard";
import SuperAdminDeliveryZones from "../pages/super-admin/SuperAdminDeliveryZones";
import SuperAdminInventory from "../pages/super-admin/SuperAdminInventory";
import SuperAdminOrders from "../pages/super-admin/SuperAdminOrders";
import SuperAdminPayments from "../pages/super-admin/SuperAdminPayments";
import SuperAdminSiteConfig from "../pages/super-admin/SuperAdminSiteConfig";
import SuperAdminSettings from "../pages/super-admin/SuperAdminSettings";
import AdminWallet from "../pages/admin/AdminWallet";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminStores from "../pages/admin/AdminStores";
import ChatPage from "../pages/chat/ChatPage";

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
      { path: "stores", element: <AdminStores /> },
      { path: "stores/:providerId", element: <AdminStores /> },
      { path: "manage-products", element: <AdminProducts /> },
      { path: "inventory", element: <SuperAdminInventory /> },
      { path: "analytics", element: <SuperAdminAnalytics /> },
      { path: "orders", element: <SuperAdminOrders /> },
      { path: "delivery-zones", element: <SuperAdminDeliveryZones /> },
      { path: "payments", element: <SuperAdminPayments /> },
      { path: "wallet", element: <AdminWallet /> },
      { path: "contact-messages", element: <SuperAdminContactMessages /> },
      { path: "chat", element: <ChatPage /> },
      { path: "settings", element: <SuperAdminSettings /> },
      { path: "audit-log", element: <SuperAdminAuditLog /> },
      { path: "cms", element: <SuperAdminCMS /> },
      { path: "cms/management", element: <SuperAdminCMS /> },
      { path: "cms/management/home", element: <SuperAdminCMSHome /> },
      { path: "cms/management/about", element: <SuperAdminCMSAbout /> },
      { path: "cms/management/products", element: <SuperAdminCMSProducts /> },
      { path: "cms/management/contact", element: <SuperAdminCMSContact /> },
      { path: "cms/management/common", element: <SuperAdminCMSCommon /> },
      { path: "cms/management/legal", element: <SuperAdminCMSLegal /> },
      { path: "cms/site-config", element: <SuperAdminSiteConfig /> },
      { path: "cms/system", element: <SuperAdminCmsSystem /> },
    ],
  },
];
