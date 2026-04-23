import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { HomePageSection } from "@/types/homePageCms";
import { Button } from "antd";

type HeroProps = {
  section: HomePageSection;
};

const Hero = ({ section }: HeroProps) => {
  const content = section.content as {
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    bannerImageUrls?: string[];
    highlights?: string[];
    promoCardTitle?: string;
    promoCardSubtitle?: string;
    promoCardItems?: string[];
    deliveryTitle?: string;
    deliverySubtitle?: string;
    trustedTitle?: string;
    trustedSubtitle?: string;
  };

  const bannerImageUrls = Array.isArray(content.bannerImageUrls)
    ? content.bannerImageUrls.filter(Boolean)
    : [];

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    if (bannerImageUrls.length <= 1) {
      setActiveBannerIndex(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveBannerIndex(
        (currentIndex) => (currentIndex + 1) % bannerImageUrls.length,
      );
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [bannerImageUrls.length]);

  return (
    <section className="relative overflow-hidden py-14 lg:py-24">
      {/* ===== Banner Background ===== */}
      {bannerImageUrls.length > 0 && (
        <div className="absolute inset-0">
          {bannerImageUrls.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${imageUrl})`,
                opacity: index === activeBannerIndex ? 1 : 0,
                transform:
                  index === activeBannerIndex ? "scale(1)" : "scale(1.05)", // subtle zoom effect
              }}
            />
          ))}

          {/* Premium soft overlay */}
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </div>
      )}

      {/* soft color glow (reduced) */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/30 blur-[120px]" />
      </div>

      <div className="container relative">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* ===== Left Content ===== */}
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-md">
              {section.description ||
                "Fresh groceries, local stores, fast delivery"}
            </span>

            <h1 className="mb-5 text-4xl font-bold leading-tight text-white drop-shadow-xl md:text-5xl lg:text-6xl">
              {section.title}
            </h1>

            <p className="mb-8 max-w-xl text-base text-white/90 drop-shadow md:text-lg">
              {section.subtitle}
            </p>

            {/* ===== CTA Buttons ===== */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to={content.primaryButtonLink || "/products"}>
                <Button
                  size="large"
                  type="primary"
                  className="flex items-center"
                >
                  {content.primaryButtonText || "Start Shopping"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link to={content.secondaryButtonLink || "/provider/apply"}>
                <Button size="large">
                  {content.secondaryButtonText || "Become a Grocery Vendor"}
                </Button>
              </Link>
            </div>

            {/* ===== Highlights ===== */}
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/85">
              {(content.highlights || []).map((highlight) => (
                <div key={highlight} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {highlight}
                </div>
              ))}
            </div>

            {/* ===== Dots ===== */}
            {bannerImageUrls.length > 1 && (
              <div className="mt-8 flex items-center gap-2">
                {bannerImageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveBannerIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeBannerIndex
                        ? "w-8 bg-white"
                        : "w-2.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ===== Right Cards ===== */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl sm:col-span-2 hover:scale-[1.02] transition">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">
                    {content.promoCardSubtitle || "Today's essentials"}
                  </p>
                  <h3 className="text-xl font-bold text-white">
                    {content.promoCardTitle || "Up to 25% off"}
                  </h3>
                </div>
                <div className="text-3xl font-bold text-amber-300">Sale</div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {(content.promoCardItems || []).map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white/10 p-4 text-sm font-semibold text-white backdrop-blur-md"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl hover:scale-[1.03] transition">
              <p className="text-sm text-white/80">
                {content.deliverySubtitle || "Delivery"}
              </p>
              <h4 className="mt-1 text-lg font-bold text-white">
                {content.deliveryTitle || "30-60 min"}
              </h4>
              <div className="mt-4 text-sm font-semibold text-emerald-300">
                Fast
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl hover:scale-[1.03] transition">
              <p className="text-sm text-white/80">
                {content.trustedSubtitle || "Trusted by"}
              </p>
              <h4 className="mt-1 text-lg font-bold text-white">
                {content.trustedTitle || "10K+ families"}
              </h4>
              <div className="mt-4 text-sm font-semibold text-sky-300">
                Local
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
