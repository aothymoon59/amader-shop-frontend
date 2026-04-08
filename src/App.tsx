import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { CmsProvider } from "@/context/CmsContext";
import { ProviderSalesProvider } from "@/context/ProviderSalesContext";
import AntdProvider from "./context/AntdProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AntdProvider>
      <CmsProvider>
        <ProviderSalesProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Outlet />
            </TooltipProvider>
          </CartProvider>
        </ProviderSalesProvider>
      </CmsProvider>
    </AntdProvider>
  </QueryClientProvider>
);

export default App;
