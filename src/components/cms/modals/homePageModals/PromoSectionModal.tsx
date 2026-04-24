import RepeaterSectionFields from "../../sections/sharedSectionFields/RepeaterSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildPromoContent = (values: FormValues) => ({
  items: (values.items || []).map((item) => ({
    title: trimField(item.title),
    subtitle: trimField(item.subtitle),
    emoji: trimField(item.extra),
    theme: trimField(item.extraTwo) || "primary",
  })),
});

const PromoSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildPromoContent}
  >
    {() => <RepeaterSectionFields sectionKey="promo" />}
  </CmsSectionEditorModal>
);

export default PromoSectionModal;
