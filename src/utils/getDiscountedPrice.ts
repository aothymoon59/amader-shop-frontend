import { Product } from "@/redux/features/products/productApi";

export const getDiscountedPrice = (product: Product) => {
  const price = Number(product.price || 0);
  const discountValue = Number(product.discountValue || 0);

  if (!product.discountType || discountValue <= 0) {
    return price;
  }

  if (product.discountType === "PERCENTAGE") {
    return Math.max(price - (price * discountValue) / 100, 0);
  }

  return Math.max(price - discountValue, 0);
};
