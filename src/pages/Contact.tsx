import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => (
  <PublicLayout>
    <div className="container py-16 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground">We'd love to hear from you</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: "support@smallshop.com" },
            { icon: Phone, label: "Phone", value: "1-800-SMALL-SHOP" },
            { icon: MapPin, label: "Address", value: "123 Commerce St, NY 10001" },
          ].map((info) => (
            <div key={info.label} className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <info.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium">{info.label}</div>
                <div className="text-sm text-muted-foreground">{info.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-2 rounded-xl border bg-card p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div><Label>Name</Label><Input placeholder="Your name" className="mt-1.5" /></div>
            <div><Label>Email</Label><Input placeholder="your@email.com" className="mt-1.5" /></div>
          </div>
          <div className="mb-4"><Label>Subject</Label><Input placeholder="How can we help?" className="mt-1.5" /></div>
          <div className="mb-4"><Label>Message</Label><Textarea placeholder="Tell us more..." className="mt-1.5 min-h-[120px]" /></div>
          <Button variant="hero">Send Message</Button>
        </div>
      </div>
    </div>
  </PublicLayout>
);

export default Contact;
