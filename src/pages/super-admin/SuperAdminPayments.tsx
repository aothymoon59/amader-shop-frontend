import DashboardLayout from "@/components/layouts/DashboardLayout";
import LiveOrderManagementBoard from "@/components/orders/LiveOrderManagementBoard";

const SuperAdminPayments = () => (
  <DashboardLayout role="super-admin">
    <LiveOrderManagementBoard role="super-admin" section="payments" />
  </DashboardLayout>
);

export default SuperAdminPayments;
