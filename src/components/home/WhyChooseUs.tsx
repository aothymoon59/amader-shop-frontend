import { BadgePercent, Clock3, ShieldCheck, Truck } from "lucide-react";

import type { BaseCmsSection } from "@/types/cmsSections";

type WhyChooseUsProps = {
  section: BaseCmsSection;
};

const iconMap = {
  Truck,
  ShieldCheck,
  BadgePercent,
  Clock3,
};

const WhyChooseUs = ({ section }: WhyChooseUsProps) => {
  const content = section.content as {
    items?: Array<{
      icon?: keyof typeof iconMap;
      title?: string;
      desc?: string;
    }>;
  };

  const features = (content.items || []).map((item) => ({
    icon: iconMap[item.icon || "Truck"] || Truck,
    title: item.title || "",
    desc: item.desc || "",
  }));

  return (
    <section className="bg-secondary/40 py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{section.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{section.subtitle}</p>
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
  );
};

export default WhyChooseUs;
