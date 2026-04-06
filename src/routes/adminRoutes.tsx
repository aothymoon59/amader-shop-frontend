import type { RouteObject } from "react-router-dom";

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
    element: <AdminDashboard />,
  },
  {
    path: "admin/products",
    element: <AdminProducts />,
  },
  {
    path: "admin/orders",
    element: <AdminOrders />,
  },
  {
    path: "admin/providers",
    element: <AdminProviders />,
  },
  {
    path: "admin/customers",
    element: <AdminCustomers />,
  },
  {
    path: "admin/reports",
    element: <AdminReports />,
  },
  {
    path: "admin/cms",
    element: <AdminCMS />,
  },
  {
    path: "admin/settings",
    element: <AdminSettings />,
  },
];
