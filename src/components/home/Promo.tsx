import React from "react";

const Promo = () => {
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

  return (
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
  );
};

export default Promo;
