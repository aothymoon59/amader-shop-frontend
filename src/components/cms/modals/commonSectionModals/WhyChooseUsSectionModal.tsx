import RepeaterSectionFields from "../../sections/sharedSectionFields/RepeaterSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildWhyChooseUsContent = (values: FormValues) => ({
  items: (values.items || []).map((item) => ({
    icon: trimField(item.extra) || "Truck",
    title: trimField(item.title),
    desc: trimField(item.subtitle),
  })),
});

const WhyChooseUsSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildWhyChooseUsContent}
  >
    {() => <RepeaterSectionFields sectionKey="whyChooseUs" />}
  </CmsSectionEditorModal>
);

export default WhyChooseUsSectionModal;
