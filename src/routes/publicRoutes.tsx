import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AccountSettings from "../pages/AccountSettings";
import About from "../pages/About";
import Contact from "../pages/Contact";
import CmsContentPage from "../pages/CmsContentPage";
import Index from "../pages/Index";
import OrderHistory from "../pages/OrderHistory";
import PaymentHistory from "../pages/PaymentHistory";
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
    path: "terms",
    element: <CmsContentPage slug="terms" />,
  },
  {
    path: "privacy",
    element: <CmsContentPage slug="privacy" />,
  },
  {
    path: "account/settings",
    element: <ProtectedRoute allowedRoles={["customer"]}><AccountSettings /></ProtectedRoute>,
  },
  {
    path: "account/orders",
    element: <ProtectedRoute allowedRoles={["customer"]}><OrderHistory /></ProtectedRoute>,
  },
  {
    path: "account/payments",
    element: <ProtectedRoute allowedRoles={["customer"]}><PaymentHistory /></ProtectedRoute>,
  },
];
