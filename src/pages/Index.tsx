import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layouts/PublicLayout";
import {
  ShoppingBag, Truck, Shield, Star, ArrowRight,
  Store, Zap, Users
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Zap, count: 240 },
  { name: "Fashion", icon: ShoppingBag, count: 180 },
  { name: "Home & Living", icon: Store, count: 320 },
  { name: "Sports", icon: Users, count: 150 },
];

const featuredProducts = [
  { id: 1, name: "Wireless Headphones Pro", price: 89.99, rating: 4.8, vendor: "TechStore", image: "🎧" },
  { id: 2, name: "Organic Cotton Tee", price: 34.99, rating: 4.6, vendor: "EcoWear", image: "👕" },
  { id: 3, name: "Smart Home Speaker", price: 129.99, rating: 4.9, vendor: "SmartLife", image: "🔊" },
  { id: 4, name: "Running Shoes X1", price: 119.99, rating: 4.7, vendor: "FitGear", image: "👟" },
  { id: 5, name: "Ceramic Vase Set", price: 49.99, rating: 4.5, vendor: "HomeArt", image: "🏺" },
  { id: 6, name: "Leather Backpack", price: 79.99, rating: 4.8, vendor: "UrbanBags", image: "🎒" },
];

const stats = [
  { label: "Active Vendors", value: "500+" },
  { label: "Products", value: "10K+" },
  { label: "Happy Customers", value: "50K+" },
  { label: "Orders Delivered", value: "100K+" },
];

const Index = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent blur-[120px]" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <span className="inline-block gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              Multi-Vendor Marketplace
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ color: 'hsl(0, 0%, 100%)' }}>
              Discover Products from{" "}
              <span className="text-gradient">Trusted Vendors</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'hsl(220, 14%, 70%)' }}>
              Shop from hundreds of verified sellers. Quality products, fast delivery, and seamless shopping experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="hero" size="lg" className="text-base px-8 py-6">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/provider/apply">
                <Button variant="outline" size="lg" className="text-base px-8 py-6 border-muted-foreground/30 hover:bg-muted/10" style={{ color: 'hsl(220, 14%, 80%)' }}>
                  Become a Vendor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Browse our curated collections from top vendors worldwide
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <Link
                to="/products"
                key={cat.name}
                className="group rounded-xl border bg-card p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary transition-transform group-hover:scale-110">
                  <cat.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-16 lg:py-24 bg-secondary/50">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Top picks from our best vendors</p>
            </div>
            <Link to="/products">
              <Button variant="outline">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-48 bg-secondary flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                  {product.image}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground ml-auto">by {product.vendor}</span>
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="text-xl font-bold text-primary">${product.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SmallShop?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Vendors", desc: "Every seller goes through a rigorous verification process to ensure quality and trust." },
              { icon: Truck, title: "Fast Delivery", desc: "Get your orders delivered quickly with our reliable logistics network." },
              { icon: Star, title: "Quality Guaranteed", desc: "We stand behind every product sold on our platform with quality assurance." },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-xl border bg-card transition-all duration-300 hover:shadow-lg animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-accent">
                  <feature.icon className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'hsl(0, 0%, 100%)' }}>
            Ready to Start Selling?
          </h2>
          <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: 'hsl(220, 14%, 70%)' }}>
            Join hundreds of vendors and grow your business with SmallShop.
          </p>
          <Link to="/provider/apply">
            <Button variant="hero" size="lg" className="text-base px-10 py-6">
              Apply as Vendor <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
