import PublicLayout from "@/components/layouts/PublicLayout";
import { Store, Users, Shield } from "lucide-react";

const About = () => (
  <PublicLayout>
    <div className="container py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About SmallShop</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're building the future of multi-vendor commerce — empowering small businesses to reach customers worldwide.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: Store, title: "500+ Vendors", desc: "Trusted sellers from around the world" },
          { icon: Users, title: "50K+ Customers", desc: "Growing community of happy shoppers" },
          { icon: Shield, title: "100% Secure", desc: "Verified vendors and secure payments" },
        ].map((item) => (
          <div key={item.title} className="text-center p-6 rounded-xl border bg-card">
            <div className="mx-auto mb-4 h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <item.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-lg max-w-none text-muted-foreground">
        <p>SmallShop was founded with a simple mission: make it easy for small businesses to sell online. Our platform provides vendors with powerful tools to manage their products, process orders, handle POS sales, and grow their business.</p>
        <p className="mt-4">We believe in transparency, quality, and community. Every vendor on our platform goes through a verification process to ensure the best experience for our customers.</p>
      </div>
    </div>
  </PublicLayout>
);

export default About;
