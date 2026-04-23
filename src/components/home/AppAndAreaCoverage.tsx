import { CheckCircle2, MapPin, SmartphoneNfc } from "lucide-react";
import { Link } from "react-router-dom";

import type { HomePageSection } from "@/types/homePageCms";
import { Button } from "../ui/button";

type AppAndAreaCoverageProps = {
  section: HomePageSection;
};

const AppAndAreaCoverage = ({ section }: AppAndAreaCoverageProps) => {
  const content = section.content as {
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    coverageSubtitle?: string;
    coverageItems?: string[];
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border bg-gradient-to-br from-primary/12 via-background to-accent/10 p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <SmartphoneNfc className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">{section.title}</h3>
            <p className="mb-6 text-muted-foreground">{section.subtitle}</p>
            <div className="flex gap-3">
              <Link to={content.primaryButtonLink || "#"}>
                <Button>{content.primaryButtonText || "Download App"}</Button>
              </Link>
              <Link to={content.secondaryButtonLink || "#"}>
                <Button variant="outline">{content.secondaryButtonText || "Learn More"}</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">
              {section.description || "Coverage & local vendors"}
            </h3>
            <p className="mb-6 text-muted-foreground">
              {content.coverageSubtitle ||
                "We partner with neighborhood grocery shops, fresh markets, and specialty food sellers to ensure variety and freshness."}
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {(content.coverageItems || []).map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppAndAreaCoverage;
