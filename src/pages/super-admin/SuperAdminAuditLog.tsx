import DashboardLayout from "@/components/layouts/DashboardLayout";
import AuditLogBoard from "@/components/admins/AuditLogBoard";

const SuperAdminAuditLog = () => (
  <DashboardLayout role="super-admin">
    <AuditLogBoard role="super-admin" />
  </DashboardLayout>
);

export default SuperAdminAuditLog;
