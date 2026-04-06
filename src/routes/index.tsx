import { createBrowserRouter } from "react-router-dom";

import App from "../App";
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
      ...publicRoutes,
      ...authRoutes,
      ...adminRoutes,
      ...providerRoutes,
      ...superAdminRoutes,
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
