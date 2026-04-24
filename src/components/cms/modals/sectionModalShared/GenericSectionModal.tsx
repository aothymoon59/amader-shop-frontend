import { Typography } from "antd";

import CmsSectionEditorModal from "./CmsSectionEditorModal";
import { getSectionDescription } from "./sectionDescriptions";
import type { SectionModalProps } from "./types";

const GenericSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={(_, section) => section.content || {}}
  >
    {() => (
      <Typography.Text type="secondary">
        This section only has shared title, subtitle, description, and status
        fields.
      </Typography.Text>
    )}
  </CmsSectionEditorModal>
);

export default GenericSectionModal;
