import { ArrowRight, Store } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const VendorCTA = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="rounded-[2rem] gradient-primary px-6 py-12 text-center text-primary-foreground shadow-lg md:px-12">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Store className="h-8 w-8" />
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Own a grocery shop or local store?
            </h2>
            <p className="mb-8 text-base text-primary-foreground/85 md:text-lg">
              Join our marketplace, list your products, manage orders, and grow
              your business with more local customers.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/provider/apply">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-6 text-base"
                >
                  Apply as Vendor <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent px-8 py-6 text-base text-white hover:bg-white/10"
                >
                  Explore Marketplace
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
