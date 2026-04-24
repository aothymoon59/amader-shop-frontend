import type { CmsSectionFormModalProps } from "../../sections/sharedSectionFields/types";
import {
  VendorCtaSectionModal,
  WhyChooseUsSectionModal,
} from "../commonSectionModals";
import GenericSectionModal from "../sectionModalShared/GenericSectionModal";
import AppAndCoverageSectionModal from "./AppAndCoverageSectionModal";
import CategoriesSectionModal from "./CategoriesSectionModal";
import HeroSectionModal from "./HeroSectionModal";
import HowItWorksSectionModal from "./HowItWorksSectionModal";
import ProductSectionModal from "./ProductSectionModal";
import PromoSectionModal from "./PromoSectionModal";
import StatsSectionModal from "./StatsSectionModal";
import TestimonialsSectionModal from "./TestimonialsSectionModal";
import TopPromoBarSectionModal from "./TopPromoBarSectionModal";

const CmsHomePageFormModal = (props: CmsSectionFormModalProps) => {
  switch (props.section?.key) {
    case "topPromoBar":
      return <TopPromoBarSectionModal {...props} />;
    case "hero":
      return <HeroSectionModal {...props} />;
    case "stats":
      return <StatsSectionModal {...props} />;
    case "popularProducts":
    case "featuredProducts":
      return <ProductSectionModal {...props} />;
    case "categories":
      return <CategoriesSectionModal {...props} />;
    case "promo":
      return <PromoSectionModal {...props} />;
    case "whyChooseUs":
      return <WhyChooseUsSectionModal {...props} />;
    case "howItWorks":
      return <HowItWorksSectionModal {...props} />;
    case "appAndCoverage":
      return <AppAndCoverageSectionModal {...props} />;
    case "testimonials":
      return <TestimonialsSectionModal {...props} />;
    case "vendorCta":
      return <VendorCtaSectionModal {...props} />;
    default:
      return <GenericSectionModal {...props} />;
  }
};

export default CmsHomePageFormModal;
