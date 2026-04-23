import { Link } from "react-router-dom";
import { Empty, Skeleton } from "antd";

import MarketplaceProductCard from "@/components/products/MarketplaceProductCard";
import { Button } from "@/components/ui/button";
import { useGetAllProductsQuery } from "@/redux/features/products/productApi";

const HomePopularProductsSection = () => {
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

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Popular daily essentials
            </h2>
            <p className="mt-2 text-muted-foreground">
              Frequently bought grocery items from trusted shops.
            </p>
          </div>
          <Link to="/products" className="hidden md:inline-flex">
            <Button variant="outline">View all products</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border bg-card p-4"
              >
                <Skeleton.Image active className="!h-44 !w-full" />
                <Skeleton active paragraph={{ rows: 3 }} className="mt-4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
            <p className="font-semibold text-destructive">
              Failed to load popular products.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please try again in a moment.
            </p>
          </div>
        ) : popularProducts.length === 0 ? (
          <div className="rounded-2xl border bg-card px-6 py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No popular products available right now."
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
