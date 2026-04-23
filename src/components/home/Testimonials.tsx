import { Star } from "lucide-react";

import { useGetFeaturedReviewsQuery } from "@/redux/features/reviews/reviewApi";
import type { HomePageSection } from "@/types/homePageCms";

type TestimonialsProps = {
  section: HomePageSection;
};

const Testimonials = ({ section }: TestimonialsProps) => {
  const { data: featuredReviewsResponse } = useGetFeaturedReviewsQuery({
    limit: 6,
  });
  const content = section.content as {
    emptyStateText?: string;
  };
  const testimonials = (featuredReviewsResponse?.data || []).map((review) => ({
    ...review,
    text: review.comment,
  }));

  return (
    <section className="bg-secondary/40 py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{section.title}</h2>
          {section.subtitle ? (
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{section.subtitle}</p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.length ? (
            testimonials.map((item) => (
              <div key={item.id} className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mb-5 text-muted-foreground">"{item.text}"</p>
                <h4 className="font-semibold">{item.customer.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.product?.shopName || "Purchased shop"}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border bg-card p-6 text-center text-muted-foreground md:col-span-3">
              {content.emptyStateText ||
                "Featured customer reviews will appear here after an admin marks them as featured."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
