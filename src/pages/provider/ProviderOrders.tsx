import DashboardLayout from "@/components/layouts/DashboardLayout";
import OrderManagementBoard from "@/components/orders/OrderManagementBoard";

const ProviderOrders = () => (
  <DashboardLayout role="provider">
    <OrderManagementBoard role="provider" />
  </DashboardLayout>
);

export default ProviderOrders;
