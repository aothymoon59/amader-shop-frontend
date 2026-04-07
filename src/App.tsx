import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CmsProvider } from "@/context/CmsContext";
import { ProviderSalesProvider } from "@/context/ProviderSalesContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
