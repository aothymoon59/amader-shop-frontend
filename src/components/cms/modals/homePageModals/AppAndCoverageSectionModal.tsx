import AppAndCoverageSectionFields from "../../sections/homePageSections/AppAndCoverageSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import renderButtonFields from "../sectionModalShared/buttonFields";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField, trimList } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildAppAndCoverageContent = (values: FormValues) => ({
  primaryButtonText: trimField(values.primaryButtonText),
  primaryButtonLink: trimField(values.primaryButtonLink),
  secondaryButtonText: trimField(values.secondaryButtonText),
  secondaryButtonLink: trimField(values.secondaryButtonLink),
  coverageSubtitle: trimField(values.coverageSubtitle),
  coverageItems: trimList(values.coverageItems),
});

const AppAndCoverageSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildAppAndCoverageContent}
  >
    {() => (
      <AppAndCoverageSectionFields renderButtonFields={renderButtonFields} />
    )}
  </CmsSectionEditorModal>
);

export default AppAndCoverageSectionModal;
