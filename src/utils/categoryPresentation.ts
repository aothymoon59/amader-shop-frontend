import {
  Apple,
  Bath,
  Beef,
  Coffee,
  Croissant,
  Droplets,
  Home,
  Package,
  ShoppingBasket,
  Store,
} from "lucide-react";

export const getCategoryVisual = (name: string) => {
  const categoryName = name.toLowerCase();

  if (categoryName.includes("personal")) {
    return {
      icon: Bath,
      badge: "Care",
      color: "from-pink-100 to-rose-50 text-pink-600",
      border: "border-pink-100",
    };
  }

  if (categoryName.includes("household")) {
    return {
      icon: Home,
      badge: "Home",
      color: "from-sky-100 to-blue-50 text-sky-600",
      border: "border-sky-100",
    };
  }

  if (categoryName.includes("bakery") || categoryName.includes("breakfast")) {
    return {
      icon: Croissant,
      badge: "Fresh",
      color: "from-amber-100 to-orange-50 text-amber-600",
      border: "border-amber-100",
    };
  }

  if (categoryName.includes("frozen")) {
    return {
      icon: Package,
      badge: "Frozen",
      color: "from-cyan-100 to-sky-50 text-cyan-600",
      border: "border-cyan-100",
    };
  }

  if (categoryName.includes("beverage")) {
    return {
      icon: Coffee,
      badge: "Drinks",
      color: "from-blue-100 to-indigo-50 text-blue-600",
      border: "border-blue-100",
    };
  }

  if (categoryName.includes("snack")) {
    return {
      icon: Package,
      badge: "Tasty",
      color: "from-orange-100 to-yellow-50 text-orange-600",
      border: "border-orange-100",
    };
  }

  if (categoryName.includes("oil")) {
    return {
      icon: Droplets,
      badge: "Kitchen",
      color: "from-yellow-100 to-amber-50 text-yellow-700",
      border: "border-yellow-100",
    };
  }

  if (categoryName.includes("rice")) {
    return {
      icon: ShoppingBasket,
      badge: "Staple",
      color: "from-lime-100 to-green-50 text-lime-700",
      border: "border-lime-100",
    };
  }

  if (categoryName.includes("grocery")) {
    return {
      icon: Apple,
      badge: "Daily",
      color: "from-emerald-100 to-green-50 text-emerald-600",
      border: "border-emerald-100",
    };
  }

  return {
    icon: ShoppingBasket,
    badge: "Shop",
    color: "from-muted to-background text-primary",
    border: "border-border",
  };
};
