import CmsSectionManagementBoard from "@/components/cms/CmsSectionManagementBoard";
import { CmsProductsPageFormModal } from "@/components/cms/modals/productsPageModals";
import {
  useGetAdminProductsPageSectionsQuery,
  useUpdateProductsPageSectionsMutation,
} from "@/redux/features/generalApi/cmsSectionsApi";
import {
  defaultProductsPageSections,
  type ProductsPageSection,
} from "@/types/cmsSections";

type CmsProductsPageManagementBoardProps = {
  role: "admin" | "super-admin";
};

const CmsProductsPageManagementBoard = ({
  role,
}: CmsProductsPageManagementBoardProps) => {
  const { data, isLoading, isError, refetch } =
    useGetAdminProductsPageSectionsQuery();
  const [updateProductsPageSections, { isLoading: isSaving }] =
    useUpdateProductsPageSectionsMutation();

  return (
    <CmsSectionManagementBoard<ProductsPageSection>
      role={role}
      title="Products Page CMS"
      description="Manage the Products page banner and product listing header content."
      metricLabel="Products Sections"
      sections={data?.data.sections ?? defaultProductsPageSections}
      defaultSections={defaultProductsPageSections}
      isLoading={isLoading}
      isError={isError}
      isSaving={isSaving}
      refetch={refetch}
      onPersist={(sections) => updateProductsPageSections({ sections }).unwrap()}
      FormModalComponent={CmsProductsPageFormModal}
    />
  );
};

export default CmsProductsPageManagementBoard;
