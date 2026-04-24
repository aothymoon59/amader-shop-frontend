import { useEffect, useState } from "react";

import type { ManagedCmsSection } from "@/types/cmsSections";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type CmsPageFormDialogProps = {
  open: boolean;
  section: ManagedCmsSection | null;
  onOpenChange: (open: boolean) => void;
  onSave: (section: ManagedCmsSection) => void;
};

type ListItem = {
  id: string;
  title: string;
  subtitle: string;
  extra: string;
  extraTwo: string;
};

type FormState = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  enabled: boolean;
  primaryText: string;
  secondaryText: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  highlightsText: string;
  promoCardTitle: string;
  promoCardSubtitle: string;
  promoCardItemsText: string;
  deliveryTitle: string;
  deliverySubtitle: string;
  trustedTitle: string;
  trustedSubtitle: string;
  cardSubtitle: string;
  ctaText: string;
  ctaLink: string;
  emptyStateText: string;
  errorTitle: string;
  errorDescription: string;
  coverageSubtitle: string;
  coverageItemsText: string;
  items: ListItem[];
};

const createListItem = (
  title = "",
  subtitle = "",
  extra = "",
  extraTwo = "",
): ListItem => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title,
  subtitle,
  extra,
  extraTwo,
});

const emptyState: FormState = {
  name: "",
  title: "",
  subtitle: "",
  description: "",
  enabled: true,
  primaryText: "",
  secondaryText: "",
  primaryButtonText: "",
  primaryButtonLink: "",
  secondaryButtonText: "",
  secondaryButtonLink: "",
  highlightsText: "",
  promoCardTitle: "",
  promoCardSubtitle: "",
  promoCardItemsText: "",
  deliveryTitle: "",
  deliverySubtitle: "",
  trustedTitle: "",
  trustedSubtitle: "",
  cardSubtitle: "",
  ctaText: "",
  ctaLink: "",
  emptyStateText: "",
  errorTitle: "",
  errorDescription: "",
  coverageSubtitle: "",
  coverageItemsText: "",
  items: [],
};

const toLines = (value: unknown) =>
  Array.isArray(value) ? value.map((item) => String(item ?? "")).join("\n") : "";

const mapContentItemsToForm = (section: ManagedCmsSection): ListItem[] => {
  const content = section.content as {
    items?: Array<Record<string, unknown>>;
  };

  switch (section.key) {
    case "stats":
      return (content.items || []).map((item) =>
        createListItem(String(item.label || ""), String(item.value || "")),
      );
    case "promo":
      return (content.items || []).map((item) =>
        createListItem(
          String(item.title || ""),
          String(item.subtitle || ""),
          String(item.emoji || ""),
          String(item.theme || "primary"),
        ),
      );
    case "whyChooseUs":
      return (content.items || []).map((item) =>
        createListItem(
          String(item.title || ""),
          String(item.desc || ""),
          String(item.icon || "Truck"),
        ),
      );
    case "howItWorks":
      return (content.items || []).map((item) =>
        createListItem(String(item.title || ""), String(item.desc || "")),
      );
    case "faq":
      return (content.items || []).map((item) =>
        createListItem(String(item.question || ""), String(item.answer || "")),
      );
    default:
      return [];
  }
};

const buildFormState = (section: ManagedCmsSection): FormState => {
  const content = section.content as Record<string, unknown>;

  return {
    name: section.name,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    enabled: section.enabled,
    primaryText: String(content.primaryText || ""),
    secondaryText: String(content.secondaryText || ""),
    primaryButtonText: String(content.primaryButtonText || ""),
    primaryButtonLink: String(content.primaryButtonLink || ""),
    secondaryButtonText: String(content.secondaryButtonText || ""),
    secondaryButtonLink: String(content.secondaryButtonLink || ""),
    highlightsText: toLines(content.highlights),
    promoCardTitle: String(content.promoCardTitle || ""),
    promoCardSubtitle: String(content.promoCardSubtitle || ""),
    promoCardItemsText: toLines(content.promoCardItems),
    deliveryTitle: String(content.deliveryTitle || ""),
    deliverySubtitle: String(content.deliverySubtitle || ""),
    trustedTitle: String(content.trustedTitle || ""),
    trustedSubtitle: String(content.trustedSubtitle || ""),
    cardSubtitle: String(content.cardSubtitle || ""),
    ctaText: String(content.ctaText || ""),
    ctaLink: String(content.ctaLink || ""),
    emptyStateText: String(content.emptyStateText || ""),
    errorTitle: String(content.errorTitle || ""),
    errorDescription: String(content.errorDescription || ""),
    coverageSubtitle: String(content.coverageSubtitle || ""),
    coverageItemsText: toLines(content.coverageItems),
    items: mapContentItemsToForm(section),
  };
};

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const CmsPageFormDialog = ({
  open,
  section,
  onOpenChange,
  onSave,
}: CmsPageFormDialogProps) => {
  const [form, setForm] = useState<FormState>(emptyState);

  useEffect(() => {
    if (!section) {
      setForm(emptyState);
      return;
    }

    setForm(buildFormState(section));
  }, [section]);

  const handleChange = (field: keyof FormState, value: string | boolean | ListItem[]) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const updateListItem = (
    itemId: string,
    field: keyof Omit<ListItem, "id">,
    value: string,
  ) => {
    handleChange(
      "items",
      form.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    );
  };

  const addListItem = (type: ManagedCmsSection["key"]) => {
    const nextItem =
      type === "whyChooseUs"
        ? createListItem("", "", "Truck")
        : type === "promo"
          ? createListItem("", "", "", "primary")
          : createListItem();

    handleChange("items", [...form.items, nextItem]);
  };

  const removeListItem = (itemId: string) => {
    handleChange(
      "items",
      form.items.filter((item) => item.id !== itemId),
    );
  };

  const buildContent = (currentSection: ManagedCmsSection) => {
    switch (currentSection.key) {
      case "topPromoBar":
        return {
          primaryText: form.primaryText.trim(),
          secondaryText: form.secondaryText.trim(),
        };
      case "hero":
        return {
          primaryButtonText: form.primaryButtonText.trim(),
          primaryButtonLink: form.primaryButtonLink.trim(),
          secondaryButtonText: form.secondaryButtonText.trim(),
          secondaryButtonLink: form.secondaryButtonLink.trim(),
          highlights: splitLines(form.highlightsText),
          promoCardTitle: form.promoCardTitle.trim(),
          promoCardSubtitle: form.promoCardSubtitle.trim(),
          promoCardItems: splitLines(form.promoCardItemsText),
          deliveryTitle: form.deliveryTitle.trim(),
          deliverySubtitle: form.deliverySubtitle.trim(),
          trustedTitle: form.trustedTitle.trim(),
          trustedSubtitle: form.trustedSubtitle.trim(),
        };
      case "stats":
        return {
          items: form.items.map((item) => ({
            label: item.title.trim(),
            value: item.subtitle.trim(),
          })),
        };
      case "popularProducts":
      case "featuredProducts":
        return {
          ctaText: form.ctaText.trim(),
          ctaLink: form.ctaLink.trim(),
          emptyStateText: form.emptyStateText.trim(),
          errorTitle: form.errorTitle.trim(),
          errorDescription: form.errorDescription.trim(),
        };
      case "categories":
        return {
          cardSubtitle: form.cardSubtitle.trim(),
          ctaText: form.ctaText.trim(),
          ctaLink: form.ctaLink.trim(),
          emptyStateText: form.emptyStateText.trim(),
          errorTitle: form.errorTitle.trim(),
          errorDescription: form.errorDescription.trim(),
        };
      case "promo":
        return {
          items: form.items.map((item) => ({
            title: item.title.trim(),
            subtitle: item.subtitle.trim(),
            emoji: item.extra.trim(),
            theme: item.extraTwo.trim() || "primary",
          })),
        };
      case "whyChooseUs":
        return {
          items: form.items.map((item) => ({
            icon: item.extra.trim() || "Truck",
            title: item.title.trim(),
            desc: item.subtitle.trim(),
          })),
        };
      case "howItWorks":
        return {
          items: form.items.map((item) => ({
            title: item.title.trim(),
            desc: item.subtitle.trim(),
          })),
        };
      case "faq":
        return {
          items: form.items.map((item) => ({
            question: item.title.trim(),
            answer: item.subtitle.trim(),
          })),
        };
      case "appAndCoverage":
        return {
          primaryButtonText: form.primaryButtonText.trim(),
          primaryButtonLink: form.primaryButtonLink.trim(),
          secondaryButtonText: form.secondaryButtonText.trim(),
          secondaryButtonLink: form.secondaryButtonLink.trim(),
          coverageSubtitle: form.coverageSubtitle.trim(),
          coverageItems: splitLines(form.coverageItemsText),
        };
      case "testimonials":
        return {
          emptyStateText: form.emptyStateText.trim(),
        };
      case "vendorCta":
        return {
          primaryButtonText: form.primaryButtonText.trim(),
          primaryButtonLink: form.primaryButtonLink.trim(),
          secondaryButtonText: form.secondaryButtonText.trim(),
          secondaryButtonLink: form.secondaryButtonLink.trim(),
        };
      default:
        return currentSection.content;
    }
  };

  const handleSubmit = () => {
    if (!section) {
      return;
    }

    onSave({
      ...section,
      name: form.name.trim() || section.name,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      enabled: form.enabled,
      content: buildContent(section),
    });
  };

  const renderCommonFields = () => (
    <>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <Label htmlFor="sectionEnabled">Section enabled</Label>
          <p className="text-sm text-muted-foreground">
            Disable a section to hide it from the page without deleting its content.
          </p>
        </div>
        <Switch
          id="sectionEnabled"
          checked={form.enabled}
          onCheckedChange={(checked) => handleChange("enabled", checked)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sectionName">Section Name</Label>
        <Input
          id="sectionName"
          value={form.name}
          onChange={(event) => handleChange("name", event.target.value)}
          placeholder="Admin label for this section"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sectionTitle">Title</Label>
        <Input
          id="sectionTitle"
          value={form.title}
          onChange={(event) => handleChange("title", event.target.value)}
          placeholder="Visible section title"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sectionSubtitle">Subtitle</Label>
        <Textarea
          id="sectionSubtitle"
          value={form.subtitle}
          onChange={(event) => handleChange("subtitle", event.target.value)}
          placeholder="Visible section subtitle"
          className="min-h-[90px]"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sectionDescription">Description</Label>
        <Textarea
          id="sectionDescription"
          value={form.description}
          onChange={(event) => handleChange("description", event.target.value)}
          placeholder="Optional supporting description"
          className="min-h-[90px]"
        />
      </div>
    </>
  );

  const renderButtonFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="grid gap-2">
        <Label>Primary Button Text</Label>
        <Input
          value={form.primaryButtonText}
          onChange={(event) => handleChange("primaryButtonText", event.target.value)}
          placeholder="Primary button label"
        />
      </div>
      <div className="grid gap-2">
        <Label>Primary Button Link</Label>
        <Input
          value={form.primaryButtonLink}
          onChange={(event) => handleChange("primaryButtonLink", event.target.value)}
          placeholder="/products"
        />
      </div>
      <div className="grid gap-2">
        <Label>Secondary Button Text</Label>
        <Input
          value={form.secondaryButtonText}
          onChange={(event) => handleChange("secondaryButtonText", event.target.value)}
          placeholder="Secondary button label"
        />
      </div>
      <div className="grid gap-2">
        <Label>Secondary Button Link</Label>
        <Input
          value={form.secondaryButtonLink}
          onChange={(event) => handleChange("secondaryButtonLink", event.target.value)}
          placeholder="/provider/apply"
        />
      </div>
    </div>
  );

  const renderRepeaterHeader = (
    label: string,
    description: string,
    onAdd: () => void,
    addLabel: string,
  ) => (
    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button type="button" variant="outline" onClick={onAdd}>
        {addLabel}
      </Button>
    </div>
  );

  const renderSectionSpecificFields = () => {
    if (!section) {
      return null;
    }

    switch (section.key) {
      case "topPromoBar":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Left Promo Text</Label>
              <Input
                value={form.primaryText}
                onChange={(event) => handleChange("primaryText", event.target.value)}
                placeholder="Free delivery on orders above $30"
              />
            </div>
            <div className="grid gap-2">
              <Label>Right Promo Text</Label>
              <Input
                value={form.secondaryText}
                onChange={(event) => handleChange("secondaryText", event.target.value)}
                placeholder="Delivery in 30-60 minutes in selected areas"
              />
            </div>
          </div>
        );

      case "hero":
        return (
          <>
            {renderButtonFields()}
            <div className="grid gap-2">
              <Label>Quick Benefit Points</Label>
              <Textarea
                value={form.highlightsText}
                onChange={(event) => handleChange("highlightsText", event.target.value)}
                placeholder="One quick benefit point per line"
                className="min-h-[110px]"
              />
              <p className="text-sm text-muted-foreground">
                These appear as short trust or value points under the hero actions.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Promo Card Subtitle</Label>
                <Input
                  value={form.promoCardSubtitle}
                  onChange={(event) => handleChange("promoCardSubtitle", event.target.value)}
                  placeholder="Today's essentials"
                />
              </div>
              <div className="grid gap-2">
                <Label>Promo Card Title</Label>
                <Input
                  value={form.promoCardTitle}
                  onChange={(event) => handleChange("promoCardTitle", event.target.value)}
                  placeholder="Up to 25% off"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Promo Card Quick Items</Label>
              <Textarea
                value={form.promoCardItemsText}
                onChange={(event) => handleChange("promoCardItemsText", event.target.value)}
                placeholder="One promo card item per line"
                className="min-h-[110px]"
              />
              <p className="text-sm text-muted-foreground">
                Use short phrases for the small points shown inside the hero promo card.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Delivery Label</Label>
                <Input
                  value={form.deliverySubtitle}
                  onChange={(event) => handleChange("deliverySubtitle", event.target.value)}
                  placeholder="Delivery"
                />
              </div>
              <div className="grid gap-2">
                <Label>Delivery Value</Label>
                <Input
                  value={form.deliveryTitle}
                  onChange={(event) => handleChange("deliveryTitle", event.target.value)}
                  placeholder="30-60 min"
                />
              </div>
              <div className="grid gap-2">
                <Label>Trusted Label</Label>
                <Input
                  value={form.trustedSubtitle}
                  onChange={(event) => handleChange("trustedSubtitle", event.target.value)}
                  placeholder="Trusted by"
                />
              </div>
              <div className="grid gap-2">
                <Label>Trusted Value</Label>
                <Input
                  value={form.trustedTitle}
                  onChange={(event) => handleChange("trustedTitle", event.target.value)}
                  placeholder="10K+ families"
                />
              </div>
            </div>
          </>
        );

      case "stats":
        return (
          <div className="space-y-4">
            {renderRepeaterHeader(
              "Stat Items",
              "Each row becomes one number block on the home page.",
              () => addListItem(section.key),
              "Add Stat",
            )}
            {form.items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-[1fr_1fr_auto]">
                <div className="grid gap-2">
                  <Label>Label</Label>
                  <Input
                    value={item.title}
                    onChange={(event) => updateListItem(item.id, "title", event.target.value)}
                    placeholder="Local Shops"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Value</Label>
                  <Input
                    value={item.subtitle}
                    onChange={(event) => updateListItem(item.id, "subtitle", event.target.value)}
                    placeholder="300+"
                  />
                </div>
                <div className="flex items-end">
                  <Button type="button" variant="outline" onClick={() => removeListItem(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case "popularProducts":
      case "featuredProducts":
        return (
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Button Text</Label>
                <Input
                  value={form.ctaText}
                  onChange={(event) => handleChange("ctaText", event.target.value)}
                  placeholder="View all products"
                />
              </div>
              <div className="grid gap-2">
                <Label>Button Link</Label>
                <Input
                  value={form.ctaLink}
                  onChange={(event) => handleChange("ctaLink", event.target.value)}
                  placeholder="/products"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Empty State Text</Label>
              <Textarea
                value={form.emptyStateText}
                onChange={(event) => handleChange("emptyStateText", event.target.value)}
                className="min-h-[90px]"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Error Title</Label>
                <Input
                  value={form.errorTitle}
                  onChange={(event) => handleChange("errorTitle", event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Error Description</Label>
                <Input
                  value={form.errorDescription}
                  onChange={(event) => handleChange("errorDescription", event.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case "categories":
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Card Subtitle</Label>
              <Input
                value={form.cardSubtitle}
                onChange={(event) => handleChange("cardSubtitle", event.target.value)}
                placeholder="Browse products"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Button Text</Label>
                <Input
                  value={form.ctaText}
                  onChange={(event) => handleChange("ctaText", event.target.value)}
                  placeholder="Explore All Categories"
                />
              </div>
              <div className="grid gap-2">
                <Label>Button Link</Label>
                <Input
                  value={form.ctaLink}
                  onChange={(event) => handleChange("ctaLink", event.target.value)}
                  placeholder="/products"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Empty State Text</Label>
              <Textarea
                value={form.emptyStateText}
                onChange={(event) => handleChange("emptyStateText", event.target.value)}
                className="min-h-[90px]"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Error Title</Label>
                <Input
                  value={form.errorTitle}
                  onChange={(event) => handleChange("errorTitle", event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Error Description</Label>
                <Input
                  value={form.errorDescription}
                  onChange={(event) => handleChange("errorDescription", event.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case "promo":
        return (
          <div className="space-y-4">
            {renderRepeaterHeader(
              "Promo Cards",
              "Manage the promotional highlight cards shown on the page.",
              () => addListItem(section.key),
              "Add Promo Card",
            )}
            {form.items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Card Title</Label>
                  <Input
                    value={item.title}
                    onChange={(event) => updateListItem(item.id, "title", event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Card Subtitle</Label>
                  <Input
                    value={item.subtitle}
                    onChange={(event) => updateListItem(item.id, "subtitle", event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={item.extra}
                    onChange={(event) => updateListItem(item.id, "extra", event.target.value)}
                    placeholder="Fresh"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Theme</Label>
                  <Select
                    value={item.extraTwo || "primary"}
                    onValueChange={(value) => updateListItem(item.id, "extraTwo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="accent">Accent</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button type="button" variant="outline" onClick={() => removeListItem(item.id)}>
                    Remove Card
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case "whyChooseUs":
        return (
          <div className="space-y-4">
            {renderRepeaterHeader(
              "Feature Cards",
              "Control the icon, title, and description for each feature card.",
              () => addListItem(section.key),
              "Add Feature",
            )}
            {form.items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Feature Title</Label>
                  <Input
                    value={item.title}
                    onChange={(event) => updateListItem(item.id, "title", event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Icon</Label>
                  <Select
                    value={item.extra || "Truck"}
                    onValueChange={(value) => updateListItem(item.id, "extra", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="ShieldCheck">ShieldCheck</SelectItem>
                      <SelectItem value="BadgePercent">BadgePercent</SelectItem>
                      <SelectItem value="Clock3">Clock3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={item.subtitle}
                    onChange={(event) => updateListItem(item.id, "subtitle", event.target.value)}
                    className="min-h-[90px]"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="button" variant="outline" onClick={() => removeListItem(item.id)}>
                    Remove Feature
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case "howItWorks":
        return (
          <div className="space-y-4">
            {renderRepeaterHeader(
              "Steps",
              "Each row becomes one step in the How It Works section.",
              () => addListItem(section.key),
              "Add Step",
            )}
            {form.items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-lg border p-4">
                <div className="grid gap-2">
                  <Label>Step Title</Label>
                  <Input
                    value={item.title}
                    onChange={(event) => updateListItem(item.id, "title", event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Step Description</Label>
                  <Textarea
                    value={item.subtitle}
                    onChange={(event) => updateListItem(item.id, "subtitle", event.target.value)}
                    className="min-h-[90px]"
                  />
                </div>
                <div>
                  <Button type="button" variant="outline" onClick={() => removeListItem(item.id)}>
                    Remove Step
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case "faq":
        return (
          <div className="space-y-4">
            {renderRepeaterHeader(
              "FAQ Items",
              "Manage the common questions and answers shown on public pages.",
              () => addListItem(section.key),
              "Add FAQ",
            )}
            {form.items.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-lg border p-4">
                <div className="grid gap-2">
                  <Label>Question</Label>
                  <Input
                    value={item.title}
                    onChange={(event) => updateListItem(item.id, "title", event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Answer</Label>
                  <Textarea
                    value={item.subtitle}
                    onChange={(event) => updateListItem(item.id, "subtitle", event.target.value)}
                    className="min-h-[110px]"
                  />
                </div>
                <div>
                  <Button type="button" variant="outline" onClick={() => removeListItem(item.id)}>
                    Remove FAQ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );

      case "appAndCoverage":
        return (
          <>
            {renderButtonFields()}
            <div className="grid gap-2">
              <Label>Coverage Description</Label>
              <Textarea
                value={form.coverageSubtitle}
                onChange={(event) => handleChange("coverageSubtitle", event.target.value)}
                className="min-h-[110px]"
              />
            </div>
            <div className="grid gap-2">
              <Label>Coverage Bullet Points</Label>
              <Textarea
                value={form.coverageItemsText}
                onChange={(event) => handleChange("coverageItemsText", event.target.value)}
                placeholder="One point per line"
                className="min-h-[110px]"
              />
            </div>
          </>
        );

      case "testimonials":
        return (
          <div className="grid gap-2">
            <Label>Empty State Text</Label>
            <Textarea
              value={form.emptyStateText}
              onChange={(event) => handleChange("emptyStateText", event.target.value)}
              className="min-h-[110px]"
            />
          </div>
        );

      case "vendorCta":
        return renderButtonFields();

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{section ? `Edit ${section.name}` : "Edit section"}</DialogTitle>
          <DialogDescription>
            Update this page section using regular form fields so content managers can edit it
            without touching technical data.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {renderCommonFields()}
          {renderSectionSpecificFields()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CmsPageFormDialog;
