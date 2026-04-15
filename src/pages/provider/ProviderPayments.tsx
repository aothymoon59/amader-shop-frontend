import DashboardLayout from "@/components/layouts/DashboardLayout";
import LiveOrderManagementBoard from "@/components/orders/LiveOrderManagementBoard";

const ProviderPayments = () => (
  <DashboardLayout role="provider">
    <LiveOrderManagementBoard role="provider" section="payments" />
  </DashboardLayout>
);

export default ProviderPayments;
