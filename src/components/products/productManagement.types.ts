import type { UploadFile } from "antd/es/upload/interface";

export type CategoryOption = {
  id: string;
  name: string;
};

export type ProviderOption = {
  id: string;
  userId: string;
  shopName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isActive: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type DeliveryZoneOption = {
  id: string;
  name: string;
  normalCharge: number;
  expressCharge: number;
  freeDeliveryThreshold?: number | null;
  isActive: boolean;
};

export type ProductFormValues = {
  providerId?: string;
  categoryId: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  costPrice?: number;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  stock: number;
  lowStockThreshold?: number;
  sku?: string;
  barcode?: string;
  deliveryZoneIds: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  images?: UploadFile[];
};

export type FilterState = {
  search: string;
  categoryId?: string;
  providerId?: string;
  status?: "published" | "draft";
  isFeatured?: boolean;
  isDiscount?: boolean;
  priceSort?: "low-to-high" | "high-to-low";
  dateSort?: "new-to-old" | "old-to-new";
};

export type PaginationState = {
  page: number;
  limit: number;
};

export type ViewMode = "table" | "grid";
