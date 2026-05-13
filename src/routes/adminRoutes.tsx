import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../components/layouts/DashboardLayout";
import AdminAuditLog from "../pages/admin/AdminAuditLog";
import AdminCMS from "../pages/admin/AdminCMS";
import AdminCMSAbout from "../pages/admin/AdminCMSAbout";
import AdminCMSCommon from "../pages/admin/AdminCMSCommon";
import AdminCMSContact from "../pages/admin/AdminCMSContact";
import AdminCMSHome from "../pages/admin/AdminCMSHome";
import AdminCMSLegal from "../pages/admin/AdminCMSLegal";
import AdminCMSProducts from "../pages/admin/AdminCMSProducts";
import AdminCmsSystem from "../pages/admin/AdminCmsSystem";
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminContactMessages from "../pages/admin/AdminContactMessages";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminDeliveryZones from "../pages/admin/AdminDeliveryZones";
import AdminInventory from "../pages/admin/AdminInventory";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProviders from "../pages/admin/AdminProviders";
import AdminReports from "../pages/admin/AdminReports";
import AdminReviews from "../pages/admin/AdminReviews";
import AdminSiteConfig from "../pages/admin/AdminSiteConfig";
import AdminStores from "../pages/admin/AdminStores";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminWallet from "../pages/admin/AdminWallet";
import ChatPage from "../pages/chat/ChatPage";

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
      { path: "inventory", element: <AdminInventory /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "delivery-zones", element: <AdminDeliveryZones /> },
      { path: "payments", element: <AdminPayments /> },
      { path: "wallet", element: <AdminWallet /> },
      { path: "providers", element: <AdminProviders /> },
      { path: "stores", element: <AdminStores /> },
      { path: "stores/:providerId", element: <AdminStores /> },
      { path: "customers", element: <AdminCustomers /> },
      { path: "contact-messages", element: <AdminContactMessages /> },
      { path: "chat", element: <ChatPage /> },
      { path: "reports", element: <AdminReports /> },
      { path: "reviews", element: <AdminReviews /> },
      { path: "cms", element: <AdminCMS /> },
      { path: "cms/management", element: <AdminCMS /> },
      { path: "cms/management/home", element: <AdminCMSHome /> },
      { path: "cms/management/about", element: <AdminCMSAbout /> },
      { path: "cms/management/products", element: <AdminCMSProducts /> },
      { path: "cms/management/contact", element: <AdminCMSContact /> },
      { path: "cms/management/common", element: <AdminCMSCommon /> },
      { path: "cms/management/legal", element: <AdminCMSLegal /> },
      { path: "cms/site-config", element: <AdminSiteConfig /> },
      { path: "cms/system", element: <AdminCmsSystem /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "audit-log", element: <AdminAuditLog /> },
    ],
  },
];
