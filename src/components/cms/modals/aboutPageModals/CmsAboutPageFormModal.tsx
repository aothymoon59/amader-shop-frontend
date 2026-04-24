import type { CmsSectionFormModalProps } from "../../sections/sharedSectionFields/types";
import GenericSectionModal from "../sectionModalShared/GenericSectionModal";
import HeroSectionModal from "./HeroSectionModal";
import StorySectionModal from "./StorySectionModal";

const CmsAboutPageFormModal = (props: CmsSectionFormModalProps) => {
  switch (props.section?.key) {
    case "hero":
      return <HeroSectionModal {...props} />;
    case "story":
      return <StorySectionModal {...props} />;
    default:
      return <GenericSectionModal {...props} />;
  }
};

export default CmsAboutPageFormModal;
