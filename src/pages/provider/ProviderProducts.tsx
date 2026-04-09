import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProductManagementPage from "@/components/products/ProductManagementPage";

const ProviderProducts = () => {
  return (
    <DashboardLayout role="provider">
      <ProductManagementPage role="provider" />
    </DashboardLayout>
  );
};

export default ProviderProducts;
