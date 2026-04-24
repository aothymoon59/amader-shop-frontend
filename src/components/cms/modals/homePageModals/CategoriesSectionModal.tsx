import CategoriesSectionFields from "../../sections/homePageSections/CategoriesSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildCategoriesContent = (values: FormValues) => ({
  cardSubtitle: trimField(values.cardSubtitle),
  ctaText: trimField(values.ctaText),
  ctaLink: trimField(values.ctaLink),
  emptyStateText: trimField(values.emptyStateText),
  errorTitle: trimField(values.errorTitle),
  errorDescription: trimField(values.errorDescription),
});

const CategoriesSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildCategoriesContent}
  >
    {() => <CategoriesSectionFields />}
  </CmsSectionEditorModal>
);

export default CategoriesSectionModal;
