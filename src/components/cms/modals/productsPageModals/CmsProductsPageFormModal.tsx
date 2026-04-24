import type { CmsSectionFormModalProps } from "../../sections/sharedSectionFields/types";
import GenericSectionModal from "../sectionModalShared/GenericSectionModal";
import HeroSectionModal from "./HeroSectionModal";

const CmsProductsPageFormModal = (props: CmsSectionFormModalProps) => {
  switch (props.section?.key) {
    case "hero":
      return <HeroSectionModal {...props} />;
    default:
      return <GenericSectionModal {...props} />;
  }
};

export default CmsProductsPageFormModal;
