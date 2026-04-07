import type { RouteObject } from "react-router-dom";

import PublicOnlyRoute from "../components/auth/PublicOnlyRoute";
import AdminLogin from "../pages/auth/AdminLogin";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

export const authRoutes: RouteObject[] = [
  {
    path: "login",
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "register",
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "admin/login",
    element: (
      <PublicOnlyRoute>
        <AdminLogin />
      </PublicOnlyRoute>
    ),
  },
];
