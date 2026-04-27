import { ContactFormSectionFields } from "../../sections/contactPageSections";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const ContactFormSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={(values) => ({
      recipientEmail: trimField(values.recipientEmail),
      successMessage: trimField(values.successMessage),
    })}
  >
    {() => <ContactFormSectionFields />}
  </CmsSectionEditorModal>
);

export default ContactFormSectionModal;
