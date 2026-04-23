
import { useCms, type CmsPageSlug } from "@/context/CmsContext";

type CmsContentPageProps = {
  slug: CmsPageSlug;
};

const CmsContentPage = ({ slug }: CmsContentPageProps) => {
  const { getPageBySlug } = useCms();
  const page = getPageBySlug(slug);

  if (!page) {
    return null;
  }

  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="container max-w-5xl py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">{page.heroTitle}</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">{page.heroSubtitle}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="rounded-2xl border bg-card p-8">
            <h2 className="mb-6 text-2xl font-semibold">{page.sectionTitle}</h2>
            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              {page.sectionBody.split("\n").filter(Boolean).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CmsContentPage;
