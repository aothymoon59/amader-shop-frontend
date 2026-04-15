import DashboardLayout from "@/components/layouts/DashboardLayout";
import LiveOrderManagementBoard from "@/components/orders/LiveOrderManagementBoard";

const SuperAdminOrders = () => (
  <DashboardLayout role="super-admin">
    <LiveOrderManagementBoard role="super-admin" section="orders" />
  </DashboardLayout>
);

export default SuperAdminOrders;
