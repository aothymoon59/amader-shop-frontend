import AppAndAreaCoverage from "@/components/home/AppAndAreaCoverage";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import Hero from "@/components/home/Hero";
import HomeCategoriesSection from "@/components/home/HomeCategoriesSection";
import HomePopularProductsSection from "@/components/home/HomePopularProductsSection";
import HowItWorks from "@/components/home/HowItWorks";
import Promo from "@/components/home/Promo";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import TopPromoBar from "@/components/home/TopPromoBar";
import VendorCTA from "@/components/home/VendorCTA";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { useGetPublicHomePageSectionsQuery } from "@/redux/features/generalApi/homePageCmsApi";
import { HomePageSection } from "@/types/cmsSections";
import { defaultHomePageSections } from "@/types/homePageCms";

const Index = () => {
  const { data } = useGetPublicHomePageSectionsQuery();
  const sections = [...(data?.data.sections ?? defaultHomePageSections)]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  const renderSection = (section: HomePageSection) => {
    switch (section.key) {
      case "topPromoBar":
        return <TopPromoBar key={section.key} section={section} />;
      case "hero":
        return <Hero key={section.key} section={section} />;
      case "stats":
        return <Stats key={section.key} section={section} />;
      case "popularProducts":
        return (
          <HomePopularProductsSection key={section.key} section={section} />
        );
      case "categories":
        return <HomeCategoriesSection key={section.key} section={section} />;
      case "featuredProducts":
        return <FeaturedProductsSection key={section.key} section={section} />;
      case "promo":
        return <Promo key={section.key} section={section} />;
      case "whyChooseUs":
        return <WhyChooseUs key={section.key} section={section} />;
      case "howItWorks":
        return <HowItWorks key={section.key} section={section} />;
      case "appAndCoverage":
        return <AppAndAreaCoverage key={section.key} section={section} />;
      case "testimonials":
        return <Testimonials key={section.key} section={section} />;
      case "vendorCta":
        return <VendorCTA key={section.key} section={section} />;
      default:
        return null;
    }
  };

  return <>{sections.map((section) => renderSection(section))}</>;
};

export default Index;
