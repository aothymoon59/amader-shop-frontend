import RepeaterSectionFields from "../../sections/sharedSectionFields/RepeaterSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildHowItWorksContent = (values: FormValues) => ({
  items: (values.items || []).map((item) => ({
    title: trimField(item.title),
    desc: trimField(item.subtitle),
  })),
});

const HowItWorksSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildHowItWorksContent}
  >
    {() => <RepeaterSectionFields sectionKey="howItWorks" />}
  </CmsSectionEditorModal>
);

export default HowItWorksSectionModal;
