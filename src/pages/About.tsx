import { Shield, Store, Users } from "lucide-react";

import PublicLayout from "@/components/layouts/PublicLayout";
import { useCms } from "@/context/CmsContext";

const About = () => {
  const { getPageBySlug } = useCms();
  const page = getPageBySlug("about");

  if (!page) {
    return null;
  }

  return (
    <PublicLayout>
      <div className="container max-w-4xl py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">{page.heroTitle}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {page.heroSubtitle}
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { icon: Store, title: "500+ Vendors", desc: "Trusted sellers from around the world" },
            { icon: Users, title: "50K+ Customers", desc: "Growing community of happy shoppers" },
            { icon: Shield, title: "100% Secure", desc: "Verified vendors and secure payments" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                <item.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mb-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border bg-card p-8">
          <h2 className="mb-6 text-2xl font-semibold">{page.sectionTitle}</h2>
          <div className="space-y-4 text-muted-foreground">
            {page.sectionBody.split("\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default About;
