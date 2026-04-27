import { useMemo } from "react";
import { Button, Form, Input } from "antd";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import { useCreateContactMessageMutation } from "@/redux/features/contact/contactMessagesApi";
import { useGetPublicContactPageSectionsQuery } from "@/redux/features/generalApi/cmsSectionsApi";
import {
  defaultContactPageSections,
  type ContactPageSection,
} from "@/types/cmsSections";

const getContentValue = (section: ContactPageSection | undefined, key: string) =>
  typeof section?.content?.[key] === "string"
    ? String(section.content[key]).trim()
    : "";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
};

type ContactFormValues = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

const Contact = () => {
  const { data } = useGetPublicContactPageSectionsQuery();
  const [form] = Form.useForm<ContactFormValues>();
  const [createContactMessage, { isLoading: isSubmitting }] =
    useCreateContactMessageMutation();

  const sections = useMemo(
    () =>
      [...(data?.data.sections ?? defaultContactPageSections)]
        .filter((section) => section.enabled)
        .sort((a, b) => a.order - b.order),
    [data],
  );

  const heroSection = sections.find((section) => section.key === "hero");
  const detailsSection = sections.find(
    (section) => section.key === "contactDetails",
  );
  const formSection = sections.find((section) => section.key === "contactForm");

  const contactBlocks = [
    {
      icon: Mail,
      label: "Email",
      value: getContentValue(detailsSection, "contactEmail"),
    },
    {
      icon: Phone,
      label: "Phone",
      value: getContentValue(detailsSection, "contactPhone"),
    },
    {
      icon: MapPin,
      label: "Address",
      value: getContentValue(detailsSection, "contactAddress"),
    },
    {
      icon: Clock3,
      label: "Hours",
      value: getContentValue(detailsSection, "supportHours"),
    },
  ].filter((item) => item.value);

  const mapEmbedUrl = getContentValue(detailsSection, "mapEmbedUrl");
  const successMessage =
    getContentValue(formSection, "successMessage") ||
    "Thanks for reaching out. Our team will review your message and reply soon.";

  const handleSubmit = async (values: ContactFormValues) => {
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() || "",
      subject: values.subject.trim(),
      message: values.message.trim(),
    };

    try {
      await createContactMessage(payload).unwrap();
      toast({
        title: "Message sent",
        description: successMessage,
      });
      form.resetFields();
    } catch (error) {
      toast({
        title: "Message failed",
        description: getErrorMessage(
          error,
          "Your message could not be sent right now.",
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-6xl py-16">
      {heroSection ? (
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-primary">
            {heroSection.description || "Contact"}
          </p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {heroSection.title}
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {heroSection.subtitle}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.4fr]">
        {detailsSection ? (
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-3 text-xl font-semibold">
                {detailsSection.title}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {detailsSection.subtitle || detailsSection.description}
              </p>
              {getContentValue(detailsSection, "responseTimeText") ? (
                <p className="mt-4 rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">
                  {getContentValue(detailsSection, "responseTimeText")}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4">
              {contactBlocks.map((info) => (
                <div key={info.label} className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg gradient-primary">
                    <info.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{info.label}</div>
                    <div className="text-sm leading-6 text-muted-foreground">
                      {info.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mapEmbedUrl ? (
              <div className="overflow-hidden rounded-xl border bg-card">
                <iframe
                  title="Contact location"
                  src={mapEmbedUrl}
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {formSection ? (
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">{formSection.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {formSection.subtitle || formSection.description}
              </p>
            </div>

            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={handleSubmit}
              validateTrigger={["onBlur", "onSubmit"]}
            >
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Name is required." },
                    { whitespace: true, message: "Name is required." },
                    { min: 2, message: "Name must be at least 2 characters." },
                    { max: 120, message: "Name cannot exceed 120 characters." },
                  ]}
                >
                  <Input size="large" placeholder="Your name" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Email is required." },
                    { type: "email", message: "Enter a valid email address." },
                    { max: 255, message: "Email cannot exceed 255 characters." },
                  ]}
                >
                  <Input size="large" placeholder="your@email.com" />
                </Form.Item>
              </div>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { max: 40, message: "Phone cannot exceed 40 characters." },
                ]}
              >
                <Input size="large" placeholder="+880 1700-000000" />
              </Form.Item>

              <Form.Item
                label="Subject"
                name="subject"
                rules={[
                  { required: true, message: "Subject is required." },
                  { whitespace: true, message: "Subject is required." },
                  {
                    min: 3,
                    message: "Subject must be at least 3 characters.",
                  },
                  {
                    max: 180,
                    message: "Subject cannot exceed 180 characters.",
                  },
                ]}
              >
                <Input size="large" placeholder="How can we help?" />
              </Form.Item>

              <Form.Item
                label="Message"
                name="message"
                rules={[
                  { required: true, message: "Message is required." },
                  { whitespace: true, message: "Message is required." },
                  {
                    min: 10,
                    message: "Message must be at least 10 characters.",
                  },
                  {
                    max: 5000,
                    message: "Message cannot exceed 5000 characters.",
                  },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder="Tell us more..."
                  showCount
                  maxLength={5000}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isSubmitting}
              >
                Send Message
              </Button>
            </Form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Contact;
