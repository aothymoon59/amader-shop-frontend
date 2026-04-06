import { useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, SlidersHorizontal } from "lucide-react";

const allProducts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: ["Wireless Headphones", "Cotton Tee", "Smart Speaker", "Running Shoes", "Ceramic Vase", "Leather Bag", "Watch Pro", "Sunglasses", "Coffee Maker", "Yoga Mat", "Desk Lamp", "Water Bottle"][i],
  price: [89.99, 34.99, 129.99, 119.99, 49.99, 79.99, 199.99, 59.99, 89.99, 39.99, 69.99, 24.99][i],
  rating: [4.8, 4.6, 4.9, 4.7, 4.5, 4.8, 4.9, 4.3, 4.7, 4.6, 4.4, 4.5][i],
  vendor: ["TechStore", "EcoWear", "SmartLife", "FitGear", "HomeArt", "UrbanBags", "LuxTime", "SunStyle", "BrewMaster", "ZenFit", "BrightHome", "HydrateGo"][i],
  emoji: ["🎧", "👕", "🔊", "👟", "🏺", "🎒", "⌚", "🕶️", "☕", "🧘", "💡", "🥤"][i],
  category: ["Electronics", "Fashion", "Electronics", "Sports", "Home", "Fashion", "Electronics", "Fashion", "Home", "Sports", "Home", "Sports"][i],
}));

const categories = ["All", "Electronics", "Fashion", "Home", "Sports"];

const Products = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = allProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <PublicLayout>
      <div className="container py-8 lg:py-12">
        <h1 className="text-3xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground mb-8">Browse our marketplace</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="h-44 bg-secondary flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                {product.emoji}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1.5">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  <span className="text-xs font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{product.vendor}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="text-lg font-bold text-primary">${product.price}</div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No products found</div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Products;
