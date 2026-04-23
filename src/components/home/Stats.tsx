import type { HomePageSection } from "@/types/homePageCms";

type StatsProps = {
  section: HomePageSection;
};

const Stats = ({ section }: StatsProps) => {
  const content = section.content as {
    items?: Array<{ label?: string; value?: string }>;
  };
  const stats = (content.items || []).filter((item) => item.label && item.value);

  return (
    <section className="border-y bg-card">
      <div className="container py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
