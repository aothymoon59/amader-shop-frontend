import DashboardLayout from "@/components/layouts/DashboardLayout";
import DeliveryZonesManagementPage from "@/components/delivery-zones/DeliveryZonesManagementPage";

const AdminDeliveryZones = () => (
  <DashboardLayout role="admin">
    <DeliveryZonesManagementPage />
  </DashboardLayout>
);

export default AdminDeliveryZones;
