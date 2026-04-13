import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Empty, Skeleton } from "antd";
import { ArrowLeft, Shield, ShoppingCart, Star, Truck } from "lucide-react";

import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { useGetSingleProductQuery } from "@/redux/features/products/productApi";
import { getDiscountedPrice } from "@/utils/getDiscountedPrice";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState("");

  const {
    data: productResponse,
    isLoading,
    isError,
  } = useGetSingleProductQuery(slug || "", {
    skip: !slug,
  });

  const product = productResponse?.data;

  useEffect(() => {
    if (product?.images?.[0]?.url) {
      setSelectedImage(product.images[0].url);
    } else {
      setSelectedImage("");
    }
  }, [product]);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-8 lg:py-12">
          <div className="mb-6">
            <Skeleton.Button active className="!h-6 !w-40" />
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <Skeleton.Image active className="!h-[500px] !w-full" />
            <Skeleton active paragraph={{ rows: 10 }} />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (isError || !product) {
    return (
      <PublicLayout>
        <div className="container py-8 lg:py-12">
          <Link
            to="/products"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
          <div className="rounded-2xl border bg-card p-10 text-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="The product you are looking for is not available right now."
            />
            <Link to="/products">
              <Button variant="hero" className="mt-6">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  const discountedPrice = getDiscountedPrice(product);
  const hasDiscount = discountedPrice < product.price;
  const productImages = product.images || [];
  const displayImage =
    selectedImage ||
    productImages[0]?.url ||
    "https://placehold.co/800x600/e5e7eb/6b7280?text=No+Image";
  const providerName =
    product.provider?.providerProfile?.shopName || product.provider?.name;

  return (
    <PublicLayout>
      <div className="container py-8 lg:py-12">
        <Link
          to="/products"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border bg-secondary">
              <img
                src={displayImage}
                alt={product.name}
                className="h-80 w-full object-cover lg:h-[500px]"
              />
            </div>

            {productImages.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(image.url)}
                    className={`overflow-hidden rounded-xl border transition ${
                      displayImage === image.url
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={product.name}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {product.category?.name}
              </span>
              {product.isFeatured ? (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Featured
                </span>
              ) : null}
            </div>

            <h1 className="mb-2 mt-4 text-3xl font-bold">{product.name}</h1>

            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span>Featured marketplace item</span>
              <span>·</span>
              <span>{product.stock} in stock</span>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="text-3xl font-bold text-primary">
                ${discountedPrice.toFixed(2)}
              </div>
              {hasDiscount ? (
                <>
                  <div className="text-lg text-muted-foreground line-through">
                    ${Number(product.price).toFixed(2)}
                  </div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    {product.discountType === "PERCENTAGE"
                      ? `${product.discountValue}% off`
                      : `$${Number(product.discountValue || 0).toFixed(2)} off`}
                  </span>
                </>
              ) : null}
            </div>

            {product.shortDescription ? (
              <p className="mb-4 text-base font-medium text-foreground">
                {product.shortDescription}
              </p>
            ) : null}

            <p className="mb-8 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mb-8 flex gap-3">
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button variant="outline" size="lg" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-card p-4 text-sm">
                <div className="text-muted-foreground">Sold by</div>
                <div className="mt-1 font-semibold text-primary">
                  {providerName}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4 text-sm">
                <div className="text-muted-foreground">SKU</div>
                <div className="mt-1 font-semibold">
                  {product.sku || "Not provided"}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4 text-sm">
                <div className="text-muted-foreground">Barcode</div>
                <div className="mt-1 font-semibold">
                  {product.barcode || "Not provided"}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4 text-sm">
                <div className="text-muted-foreground">Category</div>
                <div className="mt-1 font-semibold">{product.category?.name}</div>
              </div>
            </div>

            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="h-5 w-5 text-accent" /> Free shipping on
                orders over $50
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-accent" /> 30-day return policy
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-secondary/50 p-4 text-sm">
              <span className="text-muted-foreground">Sold by </span>
              <span className="font-semibold text-primary">{providerName}</span>
              <span className="text-muted-foreground"> · Verified Vendor</span>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProductDetailPage;
