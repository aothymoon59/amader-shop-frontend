import DashboardLayout from "@/components/layouts/DashboardLayout";
import OrderManagementBoard from "@/components/orders/OrderManagementBoard";

const AdminOrders = () => (
  <DashboardLayout role="admin">
    <OrderManagementBoard role="admin" />
  </DashboardLayout>
);

export default AdminOrders;
