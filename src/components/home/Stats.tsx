import React from "react";

const Stats = () => {
  const stats = [
    { label: "Local Shops", value: "300+" },
    { label: "Daily Orders", value: "8K+" },
    { label: "Products", value: "15K+" },
    { label: "Cities Served", value: "25+" },
  ];

  return (
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
  );
};

export default Stats;
