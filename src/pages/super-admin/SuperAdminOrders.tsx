import DashboardLayout from "@/components/layouts/DashboardLayout";
import LiveOrderManagementBoard from "@/components/orders/LiveOrderManagementBoard";

const SuperAdminOrders = () => (
  <DashboardLayout role="super-admin">
    <LiveOrderManagementBoard role="super-admin" />
  </DashboardLayout>
);

export default SuperAdminOrders;
