import TopPromoBarSectionFields from "../../sections/homePageSections/TopPromoBarSectionFields";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";
import type { FormValues } from "../../sections/sharedSectionFields/types";

const buildTopPromoBarContent = (values: FormValues) => ({
  primaryText: trimField(values.primaryText),
  secondaryText: trimField(values.secondaryText),
});

const TopPromoBarSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildTopPromoBarContent}
  >
    {() => <TopPromoBarSectionFields />}
  </CmsSectionEditorModal>
);

export default TopPromoBarSectionModal;
