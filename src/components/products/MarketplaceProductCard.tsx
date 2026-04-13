import { Link } from "react-router-dom";
import { PackageOpen, Store } from "lucide-react";

import type { Product } from "@/redux/features/products/productApi";

type MarketplaceProductCardProps = {
  product: Product;
};

const getProductImage = (product: Product) =>
  product.images?.[0]?.url ||
  "https://placehold.co/800x600/e5e7eb/6b7280?text=No+Image";

const getDiscountedPrice = (product: Product) => {
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

const MarketplaceProductCard = ({
  product,
}: MarketplaceProductCardProps) => {
  const productImage = getProductImage(product);
  const discountedPrice = getDiscountedPrice(product);
  const hasDiscount = discountedPrice < product.price;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-52 overflow-hidden bg-secondary">
        <img
          src={productImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
            {product.category?.name}
          </span>
          {product.isFeatured ? (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Featured
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Store className="h-3.5 w-3.5" />
          <span className="truncate">
            {product.provider?.providerProfile?.shopName || product.provider?.name}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-1 text-base font-semibold transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        <p className="mb-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {product.shortDescription ||
            product.description ||
            "No description available."}
        </p>

        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount ? (
            <span className="text-sm text-muted-foreground line-through">
              ${Number(product.price).toFixed(2)}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <PackageOpen className="h-3.5 w-3.5" />
            Stock: {product.stock}
          </span>
          {hasDiscount ? (
            <span>
              {product.discountType === "PERCENTAGE"
                ? `${product.discountValue}% off`
                : `$${Number(product.discountValue || 0).toFixed(2)} off`}
            </span>
          ) : (
            <span>No discount</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MarketplaceProductCard;
