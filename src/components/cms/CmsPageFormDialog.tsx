import { useEffect, useState } from "react";

import type { CmsPage } from "@/context/CmsContext";
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
import { Textarea } from "@/components/ui/textarea";

type CmsPageFormDialogProps = {
  open: boolean;
  page: CmsPage | null;
  onOpenChange: (open: boolean) => void;
  onSave: (values: Partial<CmsPage>) => void;
};

type FormState = {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  sectionBody: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  formTitle: string;
  formDescription: string;
  metaTitle: string;
  metaDescription: string;
  status: CmsPage["status"];
};

const emptyState: FormState = {
  heroTitle: "",
  heroSubtitle: "",
  sectionTitle: "",
  sectionBody: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  formTitle: "",
  formDescription: "",
  metaTitle: "",
  metaDescription: "",
  status: "Draft",
};

const CmsPageFormDialog = ({
  open,
  page,
  onOpenChange,
  onSave,
}: CmsPageFormDialogProps) => {
  const [form, setForm] = useState<FormState>(emptyState);

  useEffect(() => {
    if (!page) {
      setForm(emptyState);
      return;
    }

    setForm({
      heroTitle: page.heroTitle,
      heroSubtitle: page.heroSubtitle,
      sectionTitle: page.sectionTitle,
      sectionBody: page.sectionBody,
      contactEmail: page.contactEmail ?? "",
      contactPhone: page.contactPhone ?? "",
      contactAddress: page.contactAddress ?? "",
      formTitle: page.formTitle ?? "",
      formDescription: page.formDescription ?? "",
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      status: page.status,
    });
  }, [page]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSave({
      heroTitle: form.heroTitle.trim(),
      heroSubtitle: form.heroSubtitle.trim(),
      sectionTitle: form.sectionTitle.trim(),
      sectionBody: form.sectionBody.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      contactAddress: form.contactAddress.trim(),
      formTitle: form.formTitle.trim(),
      formDescription: form.formDescription.trim(),
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      status: form.status,
    });
  };

  const isContactPage = page?.slug === "contact";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{page ? `Edit ${page.name}` : "Edit page"}</DialogTitle>
          <DialogDescription>
            Update the public content and publishing state for this page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Publishing Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                handleChange("status", value as CmsPage["status"])
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              value={form.heroTitle}
              onChange={(event) => handleChange("heroTitle", event.target.value)}
              placeholder="Page headline"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={form.heroSubtitle}
              onChange={(event) => handleChange("heroSubtitle", event.target.value)}
              placeholder="Short introduction for the page"
              className="min-h-[90px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sectionTitle">Content Section Title</Label>
            <Input
              id="sectionTitle"
              value={form.sectionTitle}
              onChange={(event) => handleChange("sectionTitle", event.target.value)}
              placeholder="Main content heading"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sectionBody">Page Content</Label>
            <Textarea
              id="sectionBody"
              value={form.sectionBody}
              onChange={(event) => handleChange("sectionBody", event.target.value)}
              placeholder="Main page content"
              className="min-h-[180px]"
            />
          </div>

          {isContactPage && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Support Email</Label>
                <Input
                  id="contactEmail"
                  value={form.contactEmail}
                  onChange={(event) => handleChange("contactEmail", event.target.value)}
                  placeholder="support@example.com"
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="contactPhone">Support Phone</Label>
                  <Input
                    id="contactPhone"
                    value={form.contactPhone}
                    onChange={(event) => handleChange("contactPhone", event.target.value)}
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactAddress">Office Address</Label>
                  <Input
                    id="contactAddress"
                    value={form.contactAddress}
                    onChange={(event) => handleChange("contactAddress", event.target.value)}
                    placeholder="Business address"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="formTitle">Contact Form Title</Label>
                <Input
                  id="formTitle"
                  value={form.formTitle}
                  onChange={(event) => handleChange("formTitle", event.target.value)}
                  placeholder="Form section title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="formDescription">Contact Form Description</Label>
                <Textarea
                  id="formDescription"
                  value={form.formDescription}
                  onChange={(event) => handleChange("formDescription", event.target.value)}
                  placeholder="Describe what the form is for"
                  className="min-h-[90px]"
                />
              </div>
            </>
          )}

          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="metaTitle">SEO Title</Label>
              <Input
                id="metaTitle"
                value={form.metaTitle}
                onChange={(event) => handleChange("metaTitle", event.target.value)}
                placeholder="SEO title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="metaDescription">SEO Description</Label>
              <Textarea
                id="metaDescription"
                value={form.metaDescription}
                onChange={(event) => handleChange("metaDescription", event.target.value)}
                placeholder="SEO description"
                className="min-h-[90px]"
              />
            </div>
          </div>
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
