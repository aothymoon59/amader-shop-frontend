import { Empty, Skeleton } from "antd";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import MarketplaceProductCard from "@/components/products/MarketplaceProductCard";
import { Button } from "@/components/ui/button";
import { useGetAllProductsQuery } from "@/redux/features/products/productApi";
import type { HomePageSection } from "@/types/homePageCms";

type FeaturedProductsSectionProps = {
  section: HomePageSection;
};

const FeaturedProductsSection = ({ section }: FeaturedProductsSectionProps) => {
  const { data, isLoading, isError } = useGetAllProductsQuery({
    isFeatured: true,
    limit: 6,
    page: 1,
  });

  const products = data?.data ?? [];
  const content = section.content as {
    ctaText?: string;
    ctaLink?: string;
    emptyStateText?: string;
    errorTitle?: string;
    errorDescription?: string;
  };

  return (
    <section className="bg-secondary/50 py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">{section.title}</h2>
            <p className="text-muted-foreground">{section.subtitle}</p>
          </div>
          <Link to={content.ctaLink || "/products"}>
            <Button variant="outline">
              {content.ctaText || "View All"} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border bg-card p-4">
                <Skeleton.Image active className="!h-44 !w-full" />
                <Skeleton active paragraph={{ rows: 3 }} className="mt-4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
            <p className="font-semibold text-destructive">
              {content.errorTitle || "Failed to load featured products."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {content.errorDescription || "Please try again in a moment."}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border bg-card px-6 py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={content.emptyStateText || "No featured products available right now."}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <MarketplaceProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
