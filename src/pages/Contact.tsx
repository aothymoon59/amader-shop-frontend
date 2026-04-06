import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useCms } from "@/context/CmsContext";

const Contact = () => {
  const { getPageBySlug } = useCms();
  const page = getPageBySlug("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  if (!page) {
    return null;
  }

  const contactBlocks = [
    { icon: Mail, label: "Email", value: page.contactEmail || "support@smallshop.com" },
    { icon: Phone, label: "Phone", value: page.contactPhone || "+1-800-SMALL-SHOP" },
    { icon: MapPin, label: "Address", value: page.contactAddress || "123 Commerce St, NY 10001" },
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all fields before sending your message.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent",
      description: "Your contact request has been captured in this demo flow.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <PublicLayout>
      <div className="container max-w-5xl py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">{page.heroTitle}</h1>
          <p className="text-muted-foreground">{page.heroSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-3 text-lg font-semibold">{page.sectionTitle}</h2>
              <p className="text-sm text-muted-foreground">{page.sectionBody}</p>
            </div>

            {contactBlocks.map((info) => (
              <div key={info.label} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary">
                  <info.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium">{info.label}</div>
                  <div className="text-sm text-muted-foreground">{info.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card p-6 md:col-span-2">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">{page.formTitle || "Send us a message"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {page.formDescription || "Share your question with the support team."}
              </p>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="Your name"
                  className="mt-1.5"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  placeholder="your@email.com"
                  className="mt-1.5"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="mb-4">
              <Label>Subject</Label>
              <Input
                placeholder="How can we help?"
                className="mt-1.5"
                value={formData.subject}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, subject: event.target.value }))
                }
              />
            </div>

            <div className="mb-4">
              <Label>Message</Label>
              <Textarea
                placeholder="Tell us more..."
                className="mt-1.5 min-h-[120px]"
                value={formData.message}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, message: event.target.value }))
                }
              />
            </div>

            <Button variant="hero" onClick={handleSubmit}>
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;
