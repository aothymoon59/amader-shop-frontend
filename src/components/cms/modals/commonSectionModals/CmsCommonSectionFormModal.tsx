import type { CmsSectionFormModalProps } from "../../sections/sharedSectionFields/types";
import GenericSectionModal from "../sectionModalShared/GenericSectionModal";
import FaqSectionModal from "./FaqSectionModal";
import VendorCtaSectionModal from "./VendorCtaSectionModal";
import WhyChooseUsSectionModal from "./WhyChooseUsSectionModal";

const CmsCommonSectionFormModal = (props: CmsSectionFormModalProps) => {
  switch (props.section?.key) {
    case "whyChooseUs":
      return <WhyChooseUsSectionModal {...props} />;
    case "vendorCta":
      return <VendorCtaSectionModal {...props} />;
    case "faq":
      return <FaqSectionModal {...props} />;
    default:
      return <GenericSectionModal {...props} />;
  }
};

export default CmsCommonSectionFormModal;
