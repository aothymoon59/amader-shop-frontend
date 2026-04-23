import { Link } from "react-router-dom";
import PublicLayout from "@/components/layouts/PublicLayout";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import HomeCategoriesSection from "@/components/home/HomeCategoriesSection";
import HomePopularProductsSection from "@/components/home/HomePopularProductsSection";
import { Button } from "@/components/ui/button";
import { useGetFeaturedReviewsQuery } from "@/redux/features/reviews/reviewApi";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Star,
  Store,
  Clock3,
  BadgePercent,
  MapPin,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

const highlights = [
  {
    title: "Fresh Vegetables",
    subtitle: "Direct from local markets",
    image: "🥦",
    bg: "from-primary/20 via-primary/10 to-accent/10",
  },
  {
    title: "Daily Grocery Deals",
    subtitle: "Save more on essentials",
    image: "🛒",
    bg: "from-accent/20 via-accent/10 to-primary/10",
  },
  {
    title: "Fast Delivery",
    subtitle: "Get it in as little as 30 mins",
    image: "🚚",
    bg: "from-primary/20 via-background to-accent/10",
  },
];

const stats = [
  { label: "Local Shops", value: "300+" },
  { label: "Daily Orders", value: "8K+" },
  { label: "Products", value: "15K+" },
  { label: "Cities Served", value: "25+" },
];

const features = [
  {
    icon: Truck,
    title: "Express Delivery",
    desc: "Get groceries delivered to your doorstep quickly and safely.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Sellers",
    desc: "Verified grocery vendors and local stores you can rely on.",
  },
  {
    icon: BadgePercent,
    title: "Daily Offers",
    desc: "Enjoy flash deals, combo bundles, and seasonal discounts.",
  },
  {
    icon: Clock3,
    title: "Same-Day Fulfillment",
    desc: "Perfect for urgent household needs and repeat grocery shopping.",
  },
];

const steps = [
  {
    title: "Choose your essentials",
    desc: "Browse vegetables, meat, snacks, dairy, bakery, and household needs.",
  },
  {
    title: "Add to cart",
    desc: "Pick items from trusted local vendors with clear prices and reviews.",
  },
  {
    title: "Receive fast delivery",
    desc: "Sit back while your groceries arrive fresh at your doorstep.",
  },
];

const Index = () => {
  const { data: featuredReviewsResponse } = useGetFeaturedReviewsQuery({
    limit: 6,
  });
  const testimonials = (featuredReviewsResponse?.data || []).map((review) => ({
    ...review,
    text: review.comment,
  }));

  return (
    <PublicLayout>
      {/* Top Promo Bar */}
      <section className="border-b bg-primary/5">
        <div className="container py-3">
          <div className="flex flex-col gap-2 text-center text-sm font-medium text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-center gap-2">
              <BadgePercent className="h-4 w-4 text-primary" />
              <span>Free delivery on orders above $30</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock3 className="h-4 w-4 text-primary" />
              <span>Delivery in 30–60 minutes in selected areas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero */}
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
                <span className="block text-primary">
                  delivered fresh & fast
                </span>
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

      {/* Stats */}
      <section className="border-y bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <HomePopularProductsSection />

      <HomeCategoriesSection />

      {/* Existing featured products component */}
      <FeaturedProductsSection />
      {/* Promo Cards */}
      <section className="py-14 lg:py-20">
        <div className="container">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                What makes us better
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Built for real grocery shopping habits, not just generic product
                browsing.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className={`rounded-3xl border bg-gradient-to-br ${item.bg} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="mb-6 text-5xl">{item.image}</div>
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Why choose us */}
      <section className="bg-secondary/40 py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Why customers choose us
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Built to serve both customers and local grocery providers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Grocery shopping made simple in three steps.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border bg-card p-8 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App + area coverage */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border bg-gradient-to-br from-primary/12 via-background to-accent/10 p-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Smartphone className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">
                Shop anytime, anywhere
              </h3>
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

      {/* Testimonials */}
      <section className="bg-secondary/40 py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              What customers are saying
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.length ? (
              testimonials.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border bg-card p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: item.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mb-5 text-muted-foreground">“{item.text}”</p>
                  <h4 className="font-semibold">{item.customer.name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.product?.shopName || "Purchased shop"}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border bg-card p-6 text-center text-muted-foreground md:col-span-3">
                Featured customer reviews will appear here after an admin marks
                them as featured.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
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
                Join our marketplace, list your products, manage orders, and
                grow your business with more local customers.
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
    </PublicLayout>
  );
};

export default Index;
