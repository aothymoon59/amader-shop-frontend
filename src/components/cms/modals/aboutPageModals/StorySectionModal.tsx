import StorySectionFields from "../../sections/aboutPageSections/StorySectionFields";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import type { SectionModalProps } from "../sectionModalShared/types";

const StorySectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={(_, section) => section.content || {}}
  >
    {() => <StorySectionFields />}
  </CmsSectionEditorModal>
);

export default StorySectionModal;
