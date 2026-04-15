import DashboardLayout from "@/components/layouts/DashboardLayout";
import LiveOrderManagementBoard from "@/components/orders/LiveOrderManagementBoard";

const AdminPayments = () => (
  <DashboardLayout role="admin">
    <LiveOrderManagementBoard role="admin" section="payments" />
  </DashboardLayout>
);

export default AdminPayments;
