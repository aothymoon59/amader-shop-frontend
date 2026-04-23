import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import PublicLayout from "../components/layouts/PublicLayout";
import NotFound from "../pages/NotFound";
import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";
import { providerRoutes } from "./providerRoutes";
import { publicRoutes } from "./publicRoutes";
import { superAdminRoutes } from "./superAdminRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PublicLayout />,
        children: publicRoutes,
      },
      ...adminRoutes,
      ...providerRoutes,
      ...superAdminRoutes,
      ...authRoutes,
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
