import DashboardLayout from "@/components/layouts/DashboardLayout";
import LiveOrderManagementBoard from "@/components/orders/LiveOrderManagementBoard";

const ProviderOrders = () => (
  <DashboardLayout role="provider">
    <LiveOrderManagementBoard role="provider" />
  </DashboardLayout>
);

export default ProviderOrders;
