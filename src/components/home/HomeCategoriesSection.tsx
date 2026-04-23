import { Empty, Skeleton } from "antd";
import {
  Candy,
  CupSoda,
  Package,
  Sandwich,
  ShoppingBasket,
  Store,
} from "lucide-react";
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

const getCategoryVisual = (name: string) => {
  const normalized = name.trim().toLowerCase();

  if (normalized.includes("beverage") || normalized.includes("drink")) {
    return {
      icon: CupSoda,
      color: "bg-primary/10 text-primary",
    };
  }

  if (normalized.includes("snack")) {
    return {
      icon: Candy,
      color: "bg-accent/10 text-accent",
    };
  }

  if (
    normalized.includes("rice") ||
    normalized.includes("oil") ||
    normalized.includes("grocer")
  ) {
    return {
      icon: ShoppingBasket,
      color: "bg-primary/15 text-primary",
    };
  }

  if (normalized.includes("bakery")) {
    return {
      icon: Sandwich,
      color: "bg-accent/15 text-accent",
    };
  }

  return {
    icon: Package,
    color: "bg-primary/10 text-primary",
  };
};

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
    <section className="bg-secondary/40 py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{section.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{section.subtitle}</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border bg-card p-5 shadow-sm">
                <Skeleton.Avatar active size={56} shape="circle" />
                <Skeleton active paragraph={{ rows: 2 }} className="mt-4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
            <p className="font-semibold text-destructive">
              {content.errorTitle || "Failed to load categories."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {content.errorDescription || "Please try again in a moment."}
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border bg-card px-6 py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={content.emptyStateText || "No categories available right now."}
            />
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: categories.length > 4,
            }}
            className="w-full"
          >
            <CarouselContent>
              {categories.map((category) => {
                const visual = getCategoryVisual(category.name);
                const Icon = visual.icon;

                return (
                  <CarouselItem
                    key={category.id}
                    className="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/5"
                  >
                    <Link
                      to={`/products?categoryId=${category.id}`}
                      className="group block rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div
                        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${visual.color}`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-center font-semibold">{category.name}</h3>
                      <p className="mt-1 text-center text-sm text-muted-foreground">
                        {content.cardSubtitle || "Browse products"}
                      </p>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-0 top-1/2 border-border bg-background/95" />
            <CarouselNext className="right-0 top-1/2 border-border bg-background/95" />
          </Carousel>
        )}

        <div className="mt-10 flex justify-center">
          <Link to={content.ctaLink || "/products"}>
            <Button variant="outline">
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
