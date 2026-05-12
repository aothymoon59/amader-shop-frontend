import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Empty, Skeleton } from "antd";
import { ArrowLeft, Shield, ShoppingCart, Star, Truck } from "lucide-react";

import ProductReviewsSection from "@/components/reviews/ProductReviewsSection";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { useGetSingleProductQuery } from "@/redux/features/products/productApi";
import { formatCurrencyAmount } from "@/utils/currency";
import { getDiscountedPrice } from "@/utils/getDiscountedPrice";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const [selectedImage, setSelectedImage] = useState("");
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [isMobileZoomOpen, setIsMobileZoomOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({
    xPercent: 50,
    yPercent: 50,
    lensLeft: 0,
    lensTop: 0,
  });

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

  useEffect(() => {
    setIsZoomActive(false);
    setIsMobileZoomOpen(false);
    setZoomPosition({
      xPercent: 50,
      yPercent: 50,
      lensLeft: 0,
      lensTop: 0,
    });
  }, [selectedImage]);

  if (isLoading) {
    return (
      <div className="container py-8 lg:py-12">
        <div className="mb-6">
          <Skeleton.Button active className="!h-6 !w-40" />
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Skeleton.Image active className="!h-[500px] !w-full" />
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
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
  const reviewSummary = product.reviewSummary;
  const isPurchaseDisabled =
    user?.role === "admin" ||
    user?.role === "super-admin" ||
    user?.role === "provider";
  const lensSize = 150;

  const handleImageZoom = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - left;
    const relativeY = event.clientY - top;
    const clampedX = Math.min(Math.max(relativeX, 0), width);
    const clampedY = Math.min(Math.max(relativeY, 0), height);

    setZoomPosition({
      xPercent: (clampedX / width) * 100,
      yPercent: (clampedY / height) * 100,
      lensLeft: Math.min(
        Math.max(clampedX - lensSize / 2, 0),
        Math.max(width - lensSize, 0),
      ),
      lensTop: Math.min(
        Math.max(clampedY - lensSize / 2, 0),
        Math.max(height - lensSize, 0),
      ),
    });
  };

  const handleTouchZoom = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const relativeX = touch.clientX - left;
    const relativeY = touch.clientY - top;
    const clampedX = Math.min(Math.max(relativeX, 0), width);
    const clampedY = Math.min(Math.max(relativeY, 0), height);

    setZoomPosition({
      xPercent: (clampedX / width) * 100,
      yPercent: (clampedY / height) * 100,
      lensLeft: Math.min(
        Math.max(clampedX - lensSize / 2, 0),
        Math.max(width - lensSize, 0),
      ),
      lensTop: Math.min(
        Math.max(clampedY - lensSize / 2, 0),
        Math.max(height - lensSize, 0),
      ),
    });
  };

  return (
    <div className="container py-8 lg:py-12">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative space-y-4">
          <div>
            <div
              className="relative overflow-hidden rounded-xl bg-background"
              onMouseEnter={() => setIsZoomActive(true)}
              onMouseLeave={() => setIsZoomActive(false)}
              onMouseMove={handleImageZoom}
              onClick={() => setIsMobileZoomOpen(true)}
            >
              <img
                src={displayImage}
                alt={product.name}
                className="h-80 w-full object-cover lg:h-[500px]"
              />

              {isZoomActive ? (
                <>
                  <div
                    className="pointer-events-none absolute border border-white/80 bg-primary/15 shadow-[0_0_0_1px_rgba(255,255,255,0.35)] backdrop-blur-[1px]"
                    style={{
                      width: `${lensSize}px`,
                      height: `${lensSize}px`,
                      left: `${zoomPosition.lensLeft}px`,
                      top: `${zoomPosition.lensTop}px`,
                    }}
                  />
                </>
              ) : null}

              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-center xl:hidden">
                <span className="rounded-full bg-background/90 px-3 py-1 text-center text-xs font-medium text-foreground shadow-sm backdrop-blur">
                  Tap to zoom
                </span>
              </div>
            </div>
          </div>

          <div
            className={`pointer-events-none absolute left-full top-3 z-20 ml-6 hidden h-[500px] w-[360px] overflow-hidden rounded-2xl border bg-background shadow-2xl xl:block ${
              isZoomActive ? "opacity-100" : "opacity-0"
            } transition-opacity duration-150`}
          >
            <div
              className="h-full w-full bg-no-repeat"
              style={{
                backgroundImage: `url(${displayImage})`,
                backgroundPosition: `${zoomPosition.xPercent}% ${zoomPosition.yPercent}%`,
                backgroundSize: "220%",
              }}
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

          {isMobileZoomOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 xl:hidden">
              <button
                type="button"
                aria-label="Close zoom view"
                className="absolute right-4 top-4 rounded-full bg-background/90 px-3 py-2 text-sm font-medium text-foreground shadow-lg"
                onClick={() => setIsMobileZoomOpen(false)}
              >
                Close
              </button>

              <div className="w-full max-w-md space-y-4">
                <div
                  className="relative overflow-hidden rounded-2xl bg-background"
                  onTouchStart={handleTouchZoom}
                  onTouchMove={handleTouchZoom}
                >
                  <div
                    className="h-[70vh] w-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${displayImage})`,
                      backgroundPosition: `${zoomPosition.xPercent}% ${zoomPosition.yPercent}%`,
                      backgroundSize: "240%",
                    }}
                  />
                </div>

                <div className="rounded-full bg-background/90 px-4 py-2 text-center text-xs font-medium text-foreground shadow-sm">
                  Drag on the image to inspect details
                </div>
              </div>
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
            <span>{product.stock} in stock</span>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="text-3xl font-bold text-primary">
              {formatCurrencyAmount(discountedPrice, currency)}
            </div>
            {hasDiscount ? (
              <>
                <div className="text-lg text-muted-foreground line-through">
                  {formatCurrencyAmount(Number(product.price), currency)}
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {product.discountType === "PERCENTAGE"
                    ? `${product.discountValue}% off`
                    : `${formatCurrencyAmount(Number(product.discountValue || 0), currency)} off`}
                </span>
              </>
            ) : null}
          </div>

          <div className="mb-6 rounded-xl border bg-card p-4 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-medium">
                {reviewSummary?.totalReviews
                  ? `${reviewSummary.averageRating.toFixed(1)} average rating from ${reviewSummary.totalReviews} review(s)`
                  : "No customer reviews yet"}
              </span>
            </div>
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
              disabled={isPurchaseDisabled}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleBuyNow}
              disabled={isPurchaseDisabled}
            >
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
              <Truck className="h-5 w-5 text-accent" /> Free shipping on orders
              over $50
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

      <ProductReviewsSection productId={product.id} />
    </div>
  );
};

export default ProductDetailPage;
