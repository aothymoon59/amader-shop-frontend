import { Empty, Skeleton } from "antd";
import { Link } from "react-router-dom";

import MarketplaceProductCard from "@/components/products/MarketplaceProductCard";
import { Button } from "@/components/ui/button";
import { useGetAllProductsQuery } from "@/redux/features/products/productApi";
import type { HomePageSection } from "@/types/homePageCms";

type HomePopularProductsSectionProps = {
  section: HomePageSection;
};

const HomePopularProductsSection = ({ section }: HomePopularProductsSectionProps) => {
  const {
    data: popularProductsResponse,
    isLoading,
    isError,
  } = useGetAllProductsQuery({
    limit: 4,
    page: 1,
    sortBy: "popular",
  });

  const popularProducts = popularProductsResponse?.data ?? [];
  const content = section.content as {
    ctaText?: string;
    ctaLink?: string;
    emptyStateText?: string;
    errorTitle?: string;
    errorDescription?: string;
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">{section.title}</h2>
            <p className="mt-2 text-muted-foreground">{section.subtitle}</p>
          </div>
          <Link to={content.ctaLink || "/products"} className="hidden md:inline-flex">
            <Button variant="outline">{content.ctaText || "View all products"}</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border bg-card p-4">
                <Skeleton.Image active className="!h-44 !w-full" />
                <Skeleton active paragraph={{ rows: 3 }} className="mt-4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
            <p className="font-semibold text-destructive">
              {content.errorTitle || "Failed to load popular products."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {content.errorDescription || "Please try again in a moment."}
            </p>
          </div>
        ) : popularProducts.length === 0 ? (
          <div className="rounded-2xl border bg-card px-6 py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={content.emptyStateText || "No popular products available right now."}
            />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularProducts.map((product) => (
              <MarketplaceProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomePopularProductsSection;
