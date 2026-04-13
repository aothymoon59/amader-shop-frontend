import { Link } from "react-router-dom";
import { Empty, Skeleton } from "antd";
import { ArrowRight } from "lucide-react";

import MarketplaceProductCard from "@/components/products/MarketplaceProductCard";
import { Button } from "@/components/ui/button";
import { useGetAllProductsQuery } from "@/redux/features/products/productApi";

const FeaturedProductsSection = () => {
  const { data, isLoading, isError } = useGetAllProductsQuery({
    isFeatured: true,
    limit: 6,
    page: 1,
  });

  const products = data?.data ?? [];

  return (
    <section className="bg-secondary/50 py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Top picks from our best vendors
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border bg-card p-4"
              >
                <Skeleton.Image active className="!h-44 !w-full" />
                <Skeleton active paragraph={{ rows: 3 }} className="mt-4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
            <p className="font-semibold text-destructive">
              Failed to load featured products.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please try again in a moment.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border bg-card px-6 py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No featured products available right now."
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
