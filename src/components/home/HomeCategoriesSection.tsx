import { Empty, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetCategoriesQuery } from "@/redux/features/generalApi/categoriesApi";
import type { HomePageSection } from "@/types/homePageCms";
import { Store } from "lucide-react";
import { getCategoryVisual } from "@/utils/categoryPresentation";

type HomeCategoriesSectionProps = {
  section: HomePageSection;
};

const HomeCategoriesSection = ({ section }: HomeCategoriesSectionProps) => {
  const { data, isLoading, isError } = useGetCategoriesQuery();
  const categories = data?.data ?? [];

  const content = section.content as {
    cardSubtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    emptyStateText?: string;
    errorTitle?: string;
    errorDescription?: string;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-background py-16 lg:py-24">
      <div className="absolute left-0 top-16 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/20 blur-[120px]" />

      <div className="container relative">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {section.title || "Browse daily essentials"}
            </h2>

            <p className="mt-3 max-w-xl text-muted-foreground">
              {section.subtitle ||
                "Find fresh groceries, snacks, beverages, household items, and more from trusted local vendors."}
            </p>
          </div>

          <Link to={content.ctaLink || "/products"} className="hidden md:block">
            <Button variant="outline" className="rounded-full px-6">
              <Store className="mr-2 h-4 w-4" />
              {content.ctaText || "Explore All Categories"}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border bg-card p-5 shadow-sm"
              >
                <Skeleton.Avatar active size={62} shape="circle" />
                <Skeleton active paragraph={{ rows: 2 }} className="mt-4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center">
            <p className="font-semibold text-destructive">
              {content.errorTitle || "Failed to load categories."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {content.errorDescription || "Please try again in a moment."}
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-3xl border bg-card px-6 py-16 shadow-sm">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                content.emptyStateText || "No categories available right now."
              }
            />
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: categories.length > 6,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {categories.map((category) => {
                const visual = getCategoryVisual(category.name);
                const Icon = visual.icon;

                return (
                  <CarouselItem
                    key={category.id}
                    className="basis-[70%] pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"
                  >
                    <Link
                      to={`/products?categoryId=${category.id}`}
                      className={`group relative block rounded-2xl border ${visual.border} bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
                    >
                      {/* Badge */}
                      <div className="absolute right-3 top-3 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {visual.badge}
                      </div>

                      {/* Icon */}
                      <div
                        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${visual.color} transition-transform duration-300 group-hover:scale-105`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold leading-tight text-foreground line-clamp-1">
                        {category.name}
                      </h3>

                      {/* Subtitle */}
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {content.cardSubtitle || "Browse"}
                      </p>

                      {/* CTA */}
                      <div className="mt-2 text-xs font-medium text-primary">
                        Shop →
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious className="-left-2 top-1/2 h-8 w-8 border-border bg-background shadow-sm" />
            <CarouselNext className="-right-2 top-1/2 h-8 w-8 border-border bg-background shadow-sm" />
          </Carousel>
        )}

        <div className="mt-10 flex justify-center md:hidden">
          <Link to={content.ctaLink || "/products"}>
            <Button variant="outline" className="rounded-full px-6">
              <Store className="mr-2 h-4 w-4" />
              {content.ctaText || "Explore All Categories"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCategoriesSection;
