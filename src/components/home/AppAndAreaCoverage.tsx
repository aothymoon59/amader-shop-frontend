import { CheckCircle2, MapPin, SmartphoneNfc } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const AppAndAreaCoverage = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border bg-gradient-to-br from-primary/12 via-background to-accent/10 p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <SmartphoneNfc className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Shop anytime, anywhere</h3>
            <p className="mb-6 text-muted-foreground">
              A mobile-first shopping experience designed for quick repeat
              orders, daily needs, and easy checkout.
            </p>
            <div className="flex gap-3">
              <Button>Download App</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">
              Coverage & local vendors
            </h3>
            <p className="mb-6 text-muted-foreground">
              We partner with neighborhood grocery shops, fresh markets, and
              specialty food sellers to ensure variety and freshness.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                City-based delivery zones
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Vendor onboarding & approval
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Better local product availability
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppAndAreaCoverage;
