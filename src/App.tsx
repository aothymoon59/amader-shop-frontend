import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { CmsProvider } from "@/context/CmsContext";
import AntdProvider from "./context/AntdProvider";
import LiveNotificationBridge from "@/components/notifications/LiveNotificationBridge";
import SiteConfigRuntime from "@/components/site-config/SiteConfigRuntime";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AntdProvider>
      <CmsProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <SiteConfigRuntime />
            <LiveNotificationBridge />
            <Outlet />
          </TooltipProvider>
        </CartProvider>
      </CmsProvider>
    </AntdProvider>
  </QueryClientProvider>
);

export default App;
