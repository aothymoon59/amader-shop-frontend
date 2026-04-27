import type { CmsSectionFormModalProps } from "../../sections/sharedSectionFields/types";
import GenericSectionModal from "../sectionModalShared/GenericSectionModal";
import ContactDetailsSectionModal from "./ContactDetailsSectionModal";
import ContactFormSectionModal from "./ContactFormSectionModal";

const CmsContactPageFormModal = (props: CmsSectionFormModalProps) => {
  switch (props.section?.key) {
    case "contactDetails":
      return <ContactDetailsSectionModal {...props} />;
    case "contactForm":
      return <ContactFormSectionModal {...props} />;
    default:
      return <GenericSectionModal {...props} />;
  }
};

export default CmsContactPageFormModal;
