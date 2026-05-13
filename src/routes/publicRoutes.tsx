import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AccountSettings from "../pages/auth/AccountSettings";
import About from "../pages/About";
import Contact from "../pages/Contact";
import CmsContentPage from "../pages/CmsContentPage";
import Index from "../pages/Index";
import OrderHistory from "../pages/OrderHistory";
import PaymentHistory from "../pages/PaymentHistory";
import Products from "../pages/Products.new";
import WishlistPage from "../pages/WishlistPage";
import ProviderApply from "../pages/provider/ProviderApply";
import CartPage from "../pages/shop/CartPage";
import CheckoutPage from "../pages/shop/CheckoutPage";
import CheckoutPaymentStatusPage from "../pages/shop/CheckoutPaymentStatusPage";
import ProductDetailPage from "../pages/shop/ProductDetailPage.new";
import ChatPage from "../pages/chat/ChatPage";

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
    path: "products/:slug",
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
    path: "checkout/payment-status",
    element: <CheckoutPaymentStatusPage />,
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
    path: "provider/apply",
    element: <ProviderApply />,
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
    element: (
      <ProtectedRoute allowedRoles={["customer"]}>
        <AccountSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: "account/orders",
    element: (
      <ProtectedRoute allowedRoles={["customer"]}>
        <OrderHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: "account/payments",
    element: (
      <ProtectedRoute allowedRoles={["customer"]}>
        <PaymentHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: "account/wishlist",
    element: (
      <ProtectedRoute allowedRoles={["customer"]}>
        <WishlistPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "account/chat",
    element: (
      <ProtectedRoute allowedRoles={["customer"]}>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
];
