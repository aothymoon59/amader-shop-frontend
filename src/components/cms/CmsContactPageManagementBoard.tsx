import CmsSectionManagementBoard from "@/components/cms/CmsSectionManagementBoard";
import { CmsContactPageFormModal } from "@/components/cms/modals/contactPageModals";
import {
  useGetAdminContactPageSectionsQuery,
  useUpdateContactPageSectionsMutation,
} from "@/redux/features/generalApi/cmsSectionsApi";
import {
  defaultContactPageSections,
  type ContactPageSection,
} from "@/types/cmsSections";

type CmsContactPageManagementBoardProps = {
  role: "admin" | "super-admin";
};

const CmsContactPageManagementBoard = ({
  role,
}: CmsContactPageManagementBoardProps) => {
  const { data, isLoading, isError, refetch } =
    useGetAdminContactPageSectionsQuery();
  const [updateContactPageSections, { isLoading: isSaving }] =
    useUpdateContactPageSectionsMutation();

  return (
    <CmsSectionManagementBoard<ContactPageSection>
      role={role}
      title="Contact Page CMS"
      description="Manage the Contact page hero, public contact details, form copy, and message recipient."
      metricLabel="Hidden Sections"
      sections={data?.data.sections ?? defaultContactPageSections}
      defaultSections={defaultContactPageSections}
      isLoading={isLoading}
      isError={isError}
      isSaving={isSaving}
      refetch={refetch}
      onPersist={(sections) => updateContactPageSections({ sections }).unwrap()}
      FormModalComponent={CmsContactPageFormModal}
    />
  );
};

export default CmsContactPageManagementBoard;
