import ProductSectionFields from "../../sections/homePageSections/ProductSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import { trimField } from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildProductSectionContent = (values: FormValues) => ({
  ctaText: trimField(values.ctaText),
  ctaLink: trimField(values.ctaLink),
  emptyStateText: trimField(values.emptyStateText),
  errorTitle: trimField(values.errorTitle),
  errorDescription: trimField(values.errorDescription),
});

const ProductSectionModal = (props: SectionModalProps) => (
  <CmsSectionEditorModal
    {...props}
    description={getSectionDescription(props.section)}
    buildContent={buildProductSectionContent}
  >
    {() => <ProductSectionFields />}
  </CmsSectionEditorModal>
);

export default ProductSectionModal;
