import CmsSectionManagementBoard from "@/components/cms/CmsSectionManagementBoard";
import { CmsCommonSectionFormModal } from "@/components/cms/modals/commonSectionModals";
import {
  useGetAdminCommonSectionsQuery,
  useUpdateCommonSectionsMutation,
} from "@/redux/features/generalApi/cmsSectionsApi";
import {
  defaultCommonSections,
  type CommonCmsSection,
} from "@/types/cmsSections";

type CmsCommonSectionsManagementBoardProps = {
  role: "admin" | "super-admin";
};

const CmsCommonSectionsManagementBoard = ({
  role,
}: CmsCommonSectionsManagementBoardProps) => {
  const { data, isLoading, isError, refetch } = useGetAdminCommonSectionsQuery();
  const [updateCommonSections, { isLoading: isSaving }] =
    useUpdateCommonSectionsMutation();

  return (
    <CmsSectionManagementBoard<CommonCmsSection>
      role={role}
      title="Common Sections CMS"
      description="Manage reusable public sections such as Vendor CTA, Why Choose Us, and FAQ."
      metricLabel="Common Sections"
      sections={data?.data.sections ?? defaultCommonSections}
      defaultSections={defaultCommonSections}
      isLoading={isLoading}
      isError={isError}
      isSaving={isSaving}
      refetch={refetch}
      onPersist={(sections) => updateCommonSections({ sections }).unwrap()}
      FormModalComponent={CmsCommonSectionFormModal}
    />
  );
};

export default CmsCommonSectionsManagementBoard;
