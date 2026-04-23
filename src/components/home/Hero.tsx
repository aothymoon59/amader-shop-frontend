import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-14 lg:py-24">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="container relative">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm">
              Fresh groceries • local stores • fast delivery
            </span>

            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Your everyday grocery shopping,
              <span className="block text-primary">delivered fresh & fast</span>
            </h1>

            <p className="mb-8 max-w-xl text-base text-muted-foreground md:text-lg">
              Shop fruits, vegetables, meat, dairy, snacks, and household
              essentials from trusted local vendors — all in one convenient
              marketplace.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/products">
                <Button size="lg" className="px-8 py-6 text-base">
                  Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link to="/provider/apply">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-base"
                >
                  Become a Grocery Vendor
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Fresh stock daily
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Verified sellers
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Easy returns on eligible items
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border bg-card/95 p-6 shadow-sm sm:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Today’s essentials
                  </p>
                  <h3 className="text-xl font-bold">Up to 25% off</h3>
                </div>
                <div className="text-5xl">🛍️</div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {["🥬", "🍅", "🥛"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-muted/50 p-4 text-3xl"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border bg-card/95 p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Delivery</p>
              <h4 className="mt-1 text-lg font-bold">30–60 min</h4>
              <div className="mt-4 text-4xl">🚚</div>
            </div>

            <div className="rounded-3xl border bg-card/95 p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Trusted by</p>
              <h4 className="mt-1 text-lg font-bold">10K+ families</h4>
              <div className="mt-4 text-4xl">🏠</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
