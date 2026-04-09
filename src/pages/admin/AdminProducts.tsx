import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProductManagementPage from "@/components/products/ProductManagementPage";

const AdminProducts = () => {
  return (
    <DashboardLayout role="admin">
      <ProductManagementPage role="admin" />
    </DashboardLayout>
  );
};

export default AdminProducts;
