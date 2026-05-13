import { Link } from "react-router-dom";
import { Empty, Skeleton } from "antd";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import {
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
} from "@/redux/features/wishlist/wishlistApi";
import { formatCurrencyAmount } from "@/utils/currency";
import { getDiscountedPrice } from "@/utils/getDiscountedPrice";

const getProductImage = (item: { product: { images?: { url: string }[] } }) =>
  item.product.images?.[0]?.url ||
  "https://placehold.co/800x600/e5e7eb/6b7280?text=No+Image";

const WishlistPage = () => {
  const { addToCart } = useCart();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const { data, isLoading } = useGetWishlistQuery();
  const [removeWishlistItem, { isLoading: isRemoving }] =
    useRemoveWishlistItemMutation();

  const items = data?.data.items ?? [];

  const handleAddToCart = (product: (typeof items)[number]["product"]) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeWishlistItem(productId).unwrap();
      toast({ title: "Removed from wishlist" });
    } catch (error) {
      toast({
        title: "Could not update wishlist",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 lg:py-12">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="container py-8 lg:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Heart className="h-4 w-4 fill-primary" />
            Saved products
          </div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
        </div>
        <Link to="/products">
          <Button variant="outline">Browse Products</Button>
        </Link>
      </div>

      {items.length ? (
        <div className="grid gap-4">
          {items.map((item) => {
            const product = item.product;
            const discountedPrice = getDiscountedPrice(product);
            const hasDiscount = discountedPrice < product.price;

            return (
              <div
                key={item.id}
                className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-[120px_1fr_auto]"
              >
                <Link
                  to={`/products/${product.slug}`}
                  className="block overflow-hidden rounded-lg bg-secondary"
                >
                  <img
                    src={getProductImage(item)}
                    alt={product.name}
                    className="h-28 w-full object-cover sm:h-full"
                  />
                </Link>

                <div className="min-w-0">
                  <Link to={`/products/${product.slug}`}>
                    <h2 className="line-clamp-1 text-lg font-semibold hover:text-primary">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {product.shortDescription ||
                      product.description ||
                      "No description available."}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-primary">
                      {formatCurrencyAmount(discountedPrice, currency)}
                    </span>
                    {hasDiscount ? (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrencyAmount(Number(product.price), currency)}
                      </span>
                    ) : null}
                    <span className="text-sm text-muted-foreground">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col sm:items-end">
                  <Button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to cart
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleRemove(product.id)}
                    disabled={isRemoving}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-10 text-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Your wishlist is empty"
          />
          <Link to="/products">
            <Button variant="hero" className="mt-6">
              Find Products
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
