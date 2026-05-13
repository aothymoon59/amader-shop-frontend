import { Empty, Skeleton } from "antd";
import { CalendarDays, FileText } from "lucide-react";

import { useGetPublicLegalPagesQuery } from "@/redux/features/generalApi/cmsSectionsApi";
import type { LegalPageSlug } from "@/types/cmsSections";

type CmsContentPageProps = {
  slug: LegalPageSlug;
};

const CmsContentPage = ({ slug }: CmsContentPageProps) => {
  const { data, isLoading } = useGetPublicLegalPagesQuery();
  const page = data?.data.pages.find((item) => item.slug === slug);
  const formattedUpdatedAt = page?.updatedAt
    ? new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(page.updatedAt))
    : null;

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-10 sm:py-16">
        <div className="rounded-2xl border bg-card p-5 sm:p-8">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container max-w-5xl py-10 sm:py-16">
        <div className="rounded-2xl border bg-card p-8 text-center sm:p-10">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="This page is not available right now."
          />
        </div>
      </div>
    );
  }

  return (
    <main className="overflow-x-hidden bg-background">
      <section className="border-b bg-secondary/40">
        <div className="container max-w-5xl py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-normal text-foreground sm:text-4xl lg:text-5xl">
              {page.heroTitle}
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {page.heroSubtitle}
            </p>
            {formattedUpdatedAt ? (
              <div className="mt-6 inline-flex max-w-full items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span className="min-w-0 break-words">
                  Last updated {formattedUpdatedAt}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container max-w-5xl">
          <article className="min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-secondary/20 px-5 py-5 sm:px-8">
              <h2 className="max-w-full break-words text-2xl font-semibold text-foreground">
                {page.contentTitle}
              </h2>
            </div>
            <div
              className="cms-rich-content min-w-0 max-w-none overflow-x-auto px-5 py-6 text-sm leading-7 text-muted-foreground sm:px-8 sm:py-8"
              dangerouslySetInnerHTML={{ __html: page.contentHtml }}
            />
          </article>
        </div>
      </section>
    </main>
  );
};

export default CmsContentPage;
