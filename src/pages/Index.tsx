import PublicLayout from "@/components/layouts/PublicLayout";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import HomeCategoriesSection from "@/components/home/HomeCategoriesSection";
import HomePopularProductsSection from "@/components/home/HomePopularProductsSection";
import TopPromoBar from "@/components/home/TopPromoBar";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Promo from "@/components/home/Promo";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AppAndAreaCoverage from "@/components/home/AppAndAreaCoverage";
import Testimonials from "@/components/home/Testimonials";
import VendorCTA from "@/components/home/VendorCTA";
import HowItWorks from "@/components/home/HowItWorks";

const Index = () => {
  return (
    <PublicLayout>
      {/* Top Promo Bar */}
      <TopPromoBar />
      {/* Hero */}
      <Hero />
      {/* Stats */}
      <Stats />
      {/* Popular Products */}
      <HomePopularProductsSection />
      {/* category filter section  */}
      <HomeCategoriesSection />
      {/*  featured products  */}
      <FeaturedProductsSection />
      {/* Promo Cards */}
      <Promo />
      {/* Why choose us */}
      <WhyChooseUs />
      {/* How it works */}
      <HowItWorks />
      {/* App + area coverage */}
      <AppAndAreaCoverage />
      {/* Testimonials */}
      <Testimonials />
      {/* Vendor CTA */}
      <VendorCTA />
    </PublicLayout>
  );
};

export default Index;
