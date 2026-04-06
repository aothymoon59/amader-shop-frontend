export type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  vendor: string;
  image: string;
  category: string;
  description: string;
  reviews: number;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    price: 89.99,
    rating: 4.8,
    vendor: "TechStore",
    image: "🎧",
    category: "Electronics",
    description:
      "Premium wireless headphones with active noise cancellation, 40-hour battery life, and crystal-clear audio.",
    reviews: 234,
  },
  {
    id: 2,
    name: "Organic Cotton Tee",
    price: 34.99,
    rating: 4.6,
    vendor: "EcoWear",
    image: "👕",
    category: "Fashion",
    description:
      "Soft organic cotton t-shirt built for all-day comfort with a clean, versatile fit.",
    reviews: 148,
  },
  {
    id: 3,
    name: "Smart Home Speaker",
    price: 129.99,
    rating: 4.9,
    vendor: "SmartLife",
    image: "🔊",
    category: "Electronics",
    description:
      "Voice-controlled smart speaker with rich sound, smart assistant support, and seamless home automation.",
    reviews: 312,
  },
  {
    id: 4,
    name: "Running Shoes X1",
    price: 119.99,
    rating: 4.7,
    vendor: "FitGear",
    image: "👟",
    category: "Sports",
    description:
      "Lightweight performance shoes designed for stability, daily training, and long-distance comfort.",
    reviews: 201,
  },
  {
    id: 5,
    name: "Ceramic Vase Set",
    price: 49.99,
    rating: 4.5,
    vendor: "HomeArt",
    image: "🏺",
    category: "Home",
    description:
      "Decorative ceramic vase set that adds a clean modern touch to living rooms, dining spaces, and offices.",
    reviews: 96,
  },
  {
    id: 6,
    name: "Leather Backpack",
    price: 79.99,
    rating: 4.8,
    vendor: "UrbanBags",
    image: "🎒",
    category: "Fashion",
    description:
      "Durable leather backpack with a spacious interior, laptop sleeve, and smart everyday organization.",
    reviews: 175,
  },
  {
    id: 7,
    name: "Watch Pro",
    price: 199.99,
    rating: 4.9,
    vendor: "LuxTime",
    image: "⌚",
    category: "Electronics",
    description:
      "Feature-packed smartwatch with health tracking, notifications, and premium design for daily wear.",
    reviews: 267,
  },
  {
    id: 8,
    name: "Sunglasses",
    price: 59.99,
    rating: 4.3,
    vendor: "SunStyle",
    image: "🕶️",
    category: "Fashion",
    description:
      "UV-protected sunglasses with a timeless silhouette that works for both casual and travel use.",
    reviews: 88,
  },
  {
    id: 9,
    name: "Coffee Maker",
    price: 89.99,
    rating: 4.7,
    vendor: "BrewMaster",
    image: "☕",
    category: "Home",
    description:
      "Compact coffee maker that brews rich, balanced coffee quickly and fits perfectly in small kitchens.",
    reviews: 142,
  },
  {
    id: 10,
    name: "Yoga Mat",
    price: 39.99,
    rating: 4.6,
    vendor: "ZenFit",
    image: "🧘",
    category: "Sports",
    description:
      "Non-slip yoga mat with supportive cushioning for stretching, yoga flows, and home workouts.",
    reviews: 119,
  },
  {
    id: 11,
    name: "Desk Lamp",
    price: 69.99,
    rating: 4.4,
    vendor: "BrightHome",
    image: "💡",
    category: "Home",
    description:
      "Adjustable LED desk lamp with warm and cool light modes to support work, reading, and study sessions.",
    reviews: 104,
  },
  {
    id: 12,
    name: "Water Bottle",
    price: 24.99,
    rating: 4.5,
    vendor: "HydrateGo",
    image: "🥤",
    category: "Sports",
    description:
      "Reusable insulated bottle that keeps drinks cold for hours and is easy to carry on the go.",
    reviews: 173,
  },
];

export const getProductById = (id: number) =>
  products.find((product) => product.id === id);
