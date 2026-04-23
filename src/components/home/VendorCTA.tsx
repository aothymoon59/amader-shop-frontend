import { ArrowRight, Store } from "lucide-react";
import { Link } from "react-router-dom";

import type { HomePageSection } from "@/types/homePageCms";
import { Button } from "../ui/button";

type VendorCTAProps = {
  section: HomePageSection;
};

const VendorCTA = ({ section }: VendorCTAProps) => {
  const content = section.content as {
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="rounded-[2rem] gradient-primary px-6 py-12 text-center text-primary-foreground shadow-lg md:px-12">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Store className="h-8 w-8" />
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{section.title}</h2>
            <p className="mb-8 text-base text-primary-foreground/85 md:text-lg">
              {section.subtitle}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to={content.primaryButtonLink || "/provider/apply"}>
                <Button size="lg" variant="secondary" className="px-8 py-6 text-base">
                  {content.primaryButtonText || "Apply as Vendor"}{" "}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={content.secondaryButtonLink || "/products"}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent px-8 py-6 text-base text-white hover:bg-white/10"
                >
                  {content.secondaryButtonText || "Explore Marketplace"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorCTA;
