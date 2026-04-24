import VendorCtaSectionFields from "../../sections/commonSections/VendorCtaSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import renderButtonFields from "../sectionModalShared/buttonFields";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildVendorCtaContent = (values: FormValues) => ({
  primaryButtonText: trimField(values.primaryButtonText),
  primaryButtonLink: trimField(values.primaryButtonLink),
  secondaryButtonText: trimField(values.secondaryButtonText),
  secondaryButtonLink: trimField(values.secondaryButtonLink),
});

const VendorCtaSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildVendorCtaContent}
  >
    {() => <VendorCtaSectionFields renderButtonFields={renderButtonFields} />}
  </CmsSectionEditorModal>
);

export default VendorCtaSectionModal;
