import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AccountSettings from "../pages/AccountSettings";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Index from "../pages/Index";
import Products from "../pages/Products";
import CartPage from "../pages/shop/CartPage";
import CheckoutPage from "../pages/shop/CheckoutPage";
import ProductDetailPage from "../pages/shop/ProductDetailPage";

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <Index />,
  },
  {
    path: "products",
    element: <Products />,
  },
  {
    path: "products/:id",
    element: <ProductDetailPage />,
  },
  {
    path: "cart",
    element: <CartPage />,
  },
  {
    path: "checkout",
    element: <CheckoutPage />,
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "contact",
    element: <Contact />,
  },
  {
    path: "account/settings",
    element: <ProtectedRoute allowedRoles={["customer"]}><AccountSettings /></ProtectedRoute>,
  },
];
