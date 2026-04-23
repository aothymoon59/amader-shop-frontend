import type { HomePageSection } from "@/types/homePageCms";

type HowItWorksProps = {
  section: HomePageSection;
};

const HowItWorks = ({ section }: HowItWorksProps) => {
  const content = section.content as {
    items?: Array<{ title?: string; desc?: string }>;
  };
  const steps = content.items || [];

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{section.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{section.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-3xl border bg-card p-8 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {index + 1}
              </div>
              <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
