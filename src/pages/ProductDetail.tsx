import { useParams, Link } from "react-router-dom";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ArrowLeft, Truck, Shield } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <PublicLayout>
      <div className="container py-8 lg:py-12">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="rounded-2xl bg-secondary flex items-center justify-center h-80 lg:h-[500px] text-8xl">
            🎧
          </div>
          <div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Electronics</span>
            <h1 className="text-3xl font-bold mt-4 mb-2">Wireless Headphones Pro</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-warning text-warning" />)}
              </div>
              <span className="text-sm text-muted-foreground">(4.8) · 234 reviews</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-6">$89.99</div>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Premium wireless headphones with active noise cancellation, 40-hour battery life, and crystal-clear audio. Perfect for music lovers and professionals alike.
            </p>
            <div className="flex gap-3 mb-8">
              <Button variant="hero" size="lg" className="flex-1">
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button variant="outline" size="lg">Buy Now</Button>
            </div>
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="h-5 w-5 text-accent" /> Free shipping on orders over $50
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-accent" /> 30-day return policy
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-secondary/50 text-sm">
              <span className="text-muted-foreground">Sold by </span>
              <span className="font-semibold text-primary">TechStore</span>
              <span className="text-muted-foreground"> · Verified Vendor</span>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProductDetail;
