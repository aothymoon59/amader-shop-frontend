import RepeaterSectionFields from "../../sections/sharedSectionFields/RepeaterSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildStatsContent = (values: FormValues) => ({
  items: (values.items || []).map((item) => ({
    label: trimField(item.title),
    value: trimField(item.subtitle),
  })),
});

const StatsSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildStatsContent}
  >
    {() => <RepeaterSectionFields sectionKey="stats" />}
  </CmsSectionEditorModal>
);

export default StatsSectionModal;
