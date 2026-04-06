import type { RouteObject } from "react-router-dom";

import AdminLogin from "../pages/AdminLogin";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const authRoutes: RouteObject[] = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "admin/login",
    element: <AdminLogin />,
  },
];
