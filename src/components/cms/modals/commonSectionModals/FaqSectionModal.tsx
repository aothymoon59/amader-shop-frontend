import FaqSectionFields from "../../sections/commonSections/FaqSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildFaqContent = (values: FormValues) => ({
  items: (values.items || []).map((item) => ({
    question: trimField(item.title),
    answer: trimField(item.subtitle),
  })),
});

const FaqSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildFaqContent}
  >
    {() => <FaqSectionFields />}
  </CmsSectionEditorModal>
);

export default FaqSectionModal;
