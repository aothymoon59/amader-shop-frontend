import type { RouteObject } from "react-router-dom";

import ProviderApply from "../pages/provider/ProviderApply";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ProviderOrders from "../pages/provider/ProviderOrders";
import ProviderPOS from "../pages/provider/ProviderPOS";
import ProviderProducts from "../pages/provider/ProviderProducts";
import ProviderReceipts from "../pages/provider/ProviderReceipts";
import ProviderReports from "../pages/provider/ProviderReports";
import ProviderSettings from "../pages/provider/ProviderSettings";

export const providerRoutes: RouteObject[] = [
  {
    path: "provider/apply",
    element: <ProviderApply />,
  },
  {
    path: "provider/dashboard",
    element: <ProviderDashboard />,
  },
  {
    path: "provider/products",
    element: <ProviderProducts />,
  },
  {
    path: "provider/orders",
    element: <ProviderOrders />,
  },
  {
    path: "provider/pos",
    element: <ProviderPOS />,
  },
  {
    path: "provider/receipts",
    element: <ProviderReceipts />,
  },
  {
    path: "provider/reports",
    element: <ProviderReports />,
  },
  {
    path: "provider/settings",
    element: <ProviderSettings />,
  },
];
