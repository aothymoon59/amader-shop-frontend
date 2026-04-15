import DashboardLayout from "@/components/layouts/DashboardLayout";
import DeliveryZonesManagementPage from "@/components/delivery-zones/DeliveryZonesManagementPage";

const SuperAdminDeliveryZones = () => (
  <DashboardLayout role="super-admin">
    <DeliveryZonesManagementPage />
  </DashboardLayout>
);

export default SuperAdminDeliveryZones;
