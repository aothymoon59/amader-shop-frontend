import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Store, ShoppingCart, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Products", path: "/products" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileNav, setMobileNav] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const dashboardPath =
    user?.role === "provider"
      ? "/provider/dashboard"
      : user?.role === "admin"
        ? "/admin/dashboard"
        : user?.role === "super-admin"
          ? "/super-admin/dashboard"
          : "/account/settings";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Store className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">SmallShop</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path ? "text-primary" : "text-muted-foreground",
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath}>
                  <Button variant="outline" size="sm">{user?.role === "customer" ? "My Account" : "Dashboard"}</Button>
                </Link>
                <Button variant="hero" size="sm" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="hero" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileNav && (
          <div className="md:hidden border-t bg-card animate-fade-in">
            <div className="container py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileNav(false)}
                  className={cn(
                    "block text-sm font-medium py-2",
                    location.pathname === link.path ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {link.title}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileNav(false)}
                className={cn(
                  "block text-sm font-medium py-2",
                  location.pathname === "/cart" ? "text-primary" : "text-muted-foreground",
                )}
              >
                Cart ({itemCount})
              </Link>
              {isAuthenticated ? (
                <div className="flex gap-2 pt-2">
                  <Link to={dashboardPath} className="flex-1" onClick={() => setMobileNav(false)}>
                    <Button variant="outline" className="w-full" size="sm">{user?.role === "customer" ? "My Account" : "Dashboard"}</Button>
                  </Link>
                  <Button variant="hero" className="flex-1" size="sm" onClick={() => { logout(); setMobileNav(false); }}>Logout</Button>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">Login</Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button variant="hero" className="w-full" size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card py-12">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">SmallShop</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your multi-vendor marketplace for quality products from trusted sellers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/products" className="block hover:text-primary">Products</Link>
              <Link to="/about" className="block hover:text-primary">About Us</Link>
              <Link to="/contact" className="block hover:text-primary">Contact</Link>
              <Link to="/terms" className="block hover:text-primary">Terms</Link>
              <Link to="/privacy" className="block hover:text-primary">Privacy</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">For Vendors</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/provider/apply" className="block hover:text-primary">Become a Seller</Link>
              <Link to="/login" className="block hover:text-primary">Vendor Login</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>support@smallshop.com</p>
              <p>1-800-SMALL-SHOP</p>
            </div>
          </div>
        </div>
        <div className="container mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          Copyright 2026 SmallShop. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
