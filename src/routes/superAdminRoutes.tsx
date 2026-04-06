import type { RouteObject } from "react-router-dom";

import SuperAdminAdmins from "../pages/super-admin/SuperAdminAdmins";
import SuperAdminAnalytics from "../pages/super-admin/SuperAdminAnalytics";
import SuperAdminDashboard from "../pages/super-admin/SuperAdminDashboard";
import SuperAdminProviders from "../pages/super-admin/SuperAdminProviders";
import SuperAdminSettings from "../pages/super-admin/SuperAdminSettings";

export const superAdminRoutes: RouteObject[] = [
  {
    path: "super-admin/dashboard",
    element: <SuperAdminDashboard />,
  },
  {
    path: "super-admin/admins",
    element: <SuperAdminAdmins />,
  },
  {
    path: "super-admin/providers",
    element: <SuperAdminProviders />,
  },
  {
    path: "super-admin/analytics",
    element: <SuperAdminAnalytics />,
  },
  {
    path: "super-admin/settings",
    element: <SuperAdminSettings />,
  },
];
