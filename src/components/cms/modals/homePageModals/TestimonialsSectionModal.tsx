import TestimonialsSectionFields from "../../sections/homePageSections/TestimonialsSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildTestimonialsContent = (values: FormValues) => ({
  emptyStateText: trimField(values.emptyStateText),
});

const TestimonialsSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildTestimonialsContent}
  >
    {() => <TestimonialsSectionFields />}
  </CmsSectionEditorModal>
);

export default TestimonialsSectionModal;
