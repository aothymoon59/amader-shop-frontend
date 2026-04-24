import CmsSectionManagementBoard from "@/components/cms/CmsSectionManagementBoard";
import {
  useGetAdminAboutPageSectionsQuery,
  useUpdateAboutPageSectionsMutation,
} from "@/redux/features/generalApi/cmsSectionsApi";
import {
  defaultAboutPageSections,
  type AboutPageSection,
} from "@/types/cmsSections";

type CmsAboutPageManagementBoardProps = {
  role: "admin" | "super-admin";
};

const CmsAboutPageManagementBoard = ({
  role,
}: CmsAboutPageManagementBoardProps) => {
  const { data, isLoading, isError, refetch } = useGetAdminAboutPageSectionsQuery();
  const [updateAboutPageSections, { isLoading: isSaving }] =
    useUpdateAboutPageSectionsMutation();

  return (
    <CmsSectionManagementBoard<AboutPageSection>
      role={role}
      title="About Page CMS"
      description="Manage the public About page hero and story content."
      metricLabel="About Sections"
      sections={data?.data.sections ?? defaultAboutPageSections}
      defaultSections={defaultAboutPageSections}
      isLoading={isLoading}
      isError={isError}
      isSaving={isSaving}
      refetch={refetch}
      onPersist={(sections) => updateAboutPageSections({ sections }).unwrap()}
    />
  );
};

export default CmsAboutPageManagementBoard;
