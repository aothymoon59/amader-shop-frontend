import type { ProductFormValues } from "@/components/products/productManagement.types";

export const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null
  ) {
    const data = error.data as {
      errorMessage?: string;
      message?: string;
    };

    return data.errorMessage || data.message;
  }

  return undefined;
};

type BuildProductPayloadArgs = {
  role: "provider" | "admin";
  values: ProductFormValues;
  retainedImageIds?: string[];
  clearImages?: boolean;
};

export const buildProductPayload = ({
  role,
  values,
  retainedImageIds = [],
  clearImages = false,
}: BuildProductPayloadArgs) => {
  const payload = new FormData();

  if (role === "admin" && values.providerId) {
    payload.append("providerId", values.providerId);
  }

  payload.append("categoryId", values.categoryId);
  payload.append("name", values.name.trim());
  payload.append("price", String(values.price));
  payload.append("stock", String(values.stock));

  if (values.description?.trim()) {
    payload.append("description", values.description.trim());
  }
  if (values.shortDescription?.trim()) {
    payload.append("shortDescription", values.shortDescription.trim());
  }
  if (values.costPrice !== undefined && values.costPrice !== null) {
    payload.append("costPrice", String(values.costPrice));
  }
  if (values.discountType) {
    payload.append("discountType", values.discountType);
  }
  if (values.discountValue !== undefined && values.discountValue !== null) {
    payload.append("discountValue", String(values.discountValue));
  }
  if (
    values.lowStockThreshold !== undefined &&
    values.lowStockThreshold !== null
  ) {
    payload.append("lowStockThreshold", String(values.lowStockThreshold));
  }
  if (values.sku?.trim()) {
    payload.append("sku", values.sku.trim());
  }
  if (values.barcode?.trim()) {
    payload.append("barcode", values.barcode.trim());
  }

  payload.append("isPublished", String(Boolean(values.isPublished)));

  if (role === "admin") {
    payload.append("isFeatured", String(Boolean(values.isFeatured)));
  }

  if (clearImages) {
    payload.append("clearImages", "true");
  }

  retainedImageIds.forEach((imageId) => {
    payload.append("retainImageIds", imageId);
  });

  values.images?.forEach((file) => {
    if (file.originFileObj) {
      payload.append("images", file.originFileObj);
    }
  });

  return payload;
};
