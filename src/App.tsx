import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReports from "./pages/admin/AdminReports";
import AdminCMS from "./pages/admin/AdminCMS";
import AdminSettings from "./pages/admin/AdminSettings";

import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderProducts from "./pages/provider/ProviderProducts";
import ProviderOrders from "./pages/provider/ProviderOrders";
import ProviderPOS from "./pages/provider/ProviderPOS";
import ProviderReceipts from "./pages/provider/ProviderReceipts";
import ProviderReports from "./pages/provider/ProviderReports";
import ProviderSettings from "./pages/provider/ProviderSettings";
import ProviderApply from "./pages/provider/ProviderApply";

import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import SuperAdminAdmins from "./pages/super-admin/SuperAdminAdmins";
import SuperAdminProviders from "./pages/super-admin/SuperAdminProviders";
import SuperAdminAnalytics from "./pages/super-admin/SuperAdminAnalytics";
import SuperAdminSettings from "./pages/super-admin/SuperAdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/providers" element={<AdminProviders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/cms" element={<AdminCMS />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Provider */}
          <Route path="/provider/apply" element={<ProviderApply />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/products" element={<ProviderProducts />} />
          <Route path="/provider/orders" element={<ProviderOrders />} />
          <Route path="/provider/pos" element={<ProviderPOS />} />
          <Route path="/provider/receipts" element={<ProviderReceipts />} />
          <Route path="/provider/reports" element={<ProviderReports />} />
          <Route path="/provider/settings" element={<ProviderSettings />} />

          {/* Super Admin */}
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/admins" element={<SuperAdminAdmins />} />
          <Route path="/super-admin/providers" element={<SuperAdminProviders />} />
          <Route path="/super-admin/analytics" element={<SuperAdminAnalytics />} />
          <Route path="/super-admin/settings" element={<SuperAdminSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
