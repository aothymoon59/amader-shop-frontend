import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Store } from "lucide-react";

const ProviderApply = () => (
  <PublicLayout>
    <div className="container py-16 max-w-2xl">
      <div className="text-center mb-10">
        <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
          <Store className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
        <p className="text-muted-foreground">Apply to sell your products on SmallShop</p>
      </div>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label>Full Name</Label><Input placeholder="John Doe" className="mt-1.5" /></div>
          <div><Label>Email</Label><Input type="email" placeholder="you@example.com" className="mt-1.5" /></div>
        </div>
        <div><Label>Shop Name</Label><Input placeholder="Your store name" className="mt-1.5" /></div>
        <div><Label>Business Type</Label><Input placeholder="e.g. Electronics, Fashion" className="mt-1.5" /></div>
        <div><Label>Description</Label><Textarea placeholder="Tell us about your business..." className="mt-1.5 min-h-[100px]" /></div>
        <div><Label>Phone Number</Label><Input placeholder="+1 234 567 890" className="mt-1.5" /></div>
        <Button variant="hero" size="lg" className="w-full">Submit Application</Button>
      </div>
    </div>
  </PublicLayout>
);

export default ProviderApply;
