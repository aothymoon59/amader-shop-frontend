import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PackageOpen, ShoppingCart, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import type { Product } from "@/redux/features/products/productApi";
import { getDiscountedPrice } from "@/utils/getDiscountedPrice";

type MarketplaceProductCardProps = {
  product: Product;
};

const getProductImage = (product: Product) =>
  product.images?.[0]?.url ||
  "https://placehold.co/800x600/e5e7eb/6b7280?text=No+Image";

const MarketplaceProductCard = ({ product }: MarketplaceProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const productImage = getProductImage(product);
  const discountedPrice = getDiscountedPrice(product);
  const hasDiscount = discountedPrice < product.price;
  const isPurchaseDisabled =
    user?.role === "admin" ||
    user?.role === "super-admin" ||
    user?.role === "provider";

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/products/${product.slug}`} className="block">
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
      </Link>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Store className="h-3.5 w-3.5" />
          <span className="truncate">
            {product.provider?.providerProfile?.shopName ||
              product.provider?.name}
          </span>
        </div>

        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="mb-2 line-clamp-1 text-base font-semibold transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

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

        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={isPurchaseDisabled}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to cart
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleBuyNow}
            disabled={isPurchaseDisabled}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceProductCard;
