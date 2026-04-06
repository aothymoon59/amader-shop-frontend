import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Shield, ShoppingCart, Star, Truck } from "lucide-react";

import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/data/products";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = getProductById(Number(id));

  if (!product) {
    return (
      <PublicLayout>
        <div className="container py-8 lg:py-12">
          <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
          <div className="rounded-2xl border bg-card p-10 text-center">
            <h1 className="text-2xl font-bold mb-3">Product not found</h1>
            <p className="text-muted-foreground mb-6">
              The product you are looking for is not available right now.
            </p>
            <Link to="/products">
              <Button variant="hero">Browse Products</Button>
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

  return (
    <PublicLayout>
      <div className="container py-8 lg:py-12">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="rounded-2xl bg-secondary flex items-center justify-center h-80 lg:h-[500px] text-8xl">
            {product.image}
          </div>
          <div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{product.category}</span>
            <h1 className="text-3xl font-bold mt-4 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating}) · {product.reviews} reviews</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-6">${product.price.toFixed(2)}</div>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {product.description} Perfect for everyday use from trusted seller {product.vendor}.
            </p>
            <div className="flex gap-3 mb-8">
              <Button variant="hero" size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button variant="outline" size="lg" onClick={handleBuyNow}>Buy Now</Button>
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
              <span className="font-semibold text-primary">{product.vendor}</span>
              <span className="text-muted-foreground"> · Verified Vendor</span>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProductDetailPage;
