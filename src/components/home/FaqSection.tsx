import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BaseCmsSection } from "@/types/cmsSections";

type FaqSectionProps = {
  section: BaseCmsSection;
};

const FaqSection = ({ section }: FaqSectionProps) => {
  const content = section.content as {
    items?: Array<{
      question?: string;
      answer?: string;
    }>;
  };

  const items = content.items || [];

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{section.title}</h2>
          <p className="mt-3 text-muted-foreground">{section.subtitle}</p>
        </div>

        <div className="mx-auto max-w-3xl rounded-3xl border bg-card p-4 shadow-sm md:p-6">
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem
                key={`${item.question || "faq"}-${index}`}
                value={`faq-${index}`}
              >
                <AccordionTrigger className="text-left text-base font-semibold">
                  {item.question || "Untitled question"}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-muted-foreground">
                  {item.answer || ""}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
