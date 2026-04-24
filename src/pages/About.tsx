import Hero from "@/components/home/Hero";
import VendorCTA from "@/components/home/VendorCTA";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FaqSection from "@/components/home/FaqSection";
import {
  useGetPublicAboutPageSectionsQuery,
  useGetPublicCommonSectionsQuery,
} from "@/redux/features/generalApi/cmsSectionsApi";
import {
  defaultAboutPageSections,
  defaultCommonSections,
} from "@/types/cmsSections";

const About = () => {
  const { data: aboutData } = useGetPublicAboutPageSectionsQuery();
  const { data: commonData } = useGetPublicCommonSectionsQuery();
  const aboutSections = [
    ...(aboutData?.data.sections ?? defaultAboutPageSections),
  ]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);
  const commonSections = [
    ...(commonData?.data.sections ?? defaultCommonSections),
  ]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  const aboutHero = aboutSections.find((section) => section.key === "hero");
  const storySection = aboutSections.find((section) => section.key === "story");
  const whyChooseUsSection = commonSections.find(
    (section) => section.key === "whyChooseUs",
  );
  const faqSection = commonSections.find((section) => section.key === "faq");
  const vendorCtaSection = commonSections.find(
    (section) => section.key === "vendorCta",
  );

  return (
    <>
      {aboutHero ? <Hero section={aboutHero} /> : null}

      {storySection ? (
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl rounded-3xl border bg-card p-8 shadow-sm md:p-10">
              <div className="mb-8">
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
                  About Us
                </p>
                <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                  {storySection.title}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {storySection.subtitle}
                </p>
              </div>
              <div className="space-y-4 leading-8 text-muted-foreground">
                {storySection.description
                  .split("\n")
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {whyChooseUsSection ? <WhyChooseUs section={whyChooseUsSection} /> : null}
      {faqSection ? <FaqSection section={faqSection} /> : null}
      {vendorCtaSection ? <VendorCTA section={vendorCtaSection} /> : null}
    </>
  );
};

export default About;
