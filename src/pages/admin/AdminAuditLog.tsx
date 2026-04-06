import DashboardLayout from "@/components/layouts/DashboardLayout";
import AuditLogBoard from "@/components/admins/AuditLogBoard";

const AdminAuditLog = () => (
  <DashboardLayout role="admin">
    <AuditLogBoard role="admin" />
  </DashboardLayout>
);

export default AdminAuditLog;
