import CountUp from "react-countup";
import { MapPinCheckIcon, Package, ShoppingBag, Users } from "lucide-react";

import type { HomePageSection } from "@/types/homePageCms";

type StatsProps = {
  section: HomePageSection;
};

const iconMap = [Users, ShoppingBag, Package, MapPinCheckIcon];

const parseStatValue = (value?: string) => {
  if (!value) {
    return { numericValue: null, suffix: "" };
  }

  const match = value.match(/(\d+(\.\d+)?)/);
  if (!match) {
    return { numericValue: null, suffix: "" };
  }

  const numericValue = Number(match[1]);
  const suffix = value.replace(match[1], "");

  return { numericValue, suffix };
};

const Stats = ({ section }: StatsProps) => {
  const content = section.content as {
    items?: Array<{ label?: string; value?: string }>;
  };

  const stats = (content.items || []).filter(
    (item) => item.label && item.value,
  );

  if (!stats.length) return null;

  return (
    <section className="bg-gradient-to-b from-background to-muted/30 py-14">
      <div className="container">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = iconMap[index % iconMap.length];
            const { numericValue, suffix } = parseStatValue(stat.value);

            return (
              <div
                key={`${stat.label}-${index}`}
                className="group relative overflow-hidden rounded-3xl border bg-card/80 p-4 text-center shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

                <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {numericValue !== null ? (
                    <>
                      <CountUp
                        end={numericValue}
                        duration={2.2}
                        separator=","
                      />
                      <span>{suffix}</span>
                    </>
                  ) : (
                    stat.value
                  )}
                </div>

                <div className="mt-2 text-sm font-medium text-muted-foreground md:text-base">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
