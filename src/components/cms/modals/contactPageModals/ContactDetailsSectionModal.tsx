import { ContactDetailsSectionFields } from "../../sections/contactPageSections";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const ContactDetailsSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={(values) => ({
      contactEmail: trimField(values.contactEmail),
      contactPhone: trimField(values.contactPhone),
      contactAddress: trimField(values.contactAddress),
      supportHours: trimField(values.supportHours),
      mapEmbedUrl: trimField(values.mapEmbedUrl),
      responseTimeText: trimField(values.responseTimeText),
    })}
  >
    {() => <ContactDetailsSectionFields />}
  </CmsSectionEditorModal>
);

export default ContactDetailsSectionModal;
