import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Store, ShoppingCart, Menu, X, Heart } from "lucide-react";
import { Avatar, Divider, Dropdown, Typography } from "antd";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import NotificationBell from "@/components/notifications/NotificationBell";
import ChatNavButton from "@/components/chat/ChatNavButton";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Products", path: "/products" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

const Header = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const { user, userData, isAuthenticated, logout } = useAuth();
  const canUseCart = !isAuthenticated || user?.role === "customer";

  const dashboardPath =
    user?.role === "provider"
      ? "/provider/dashboard"
      : user?.role === "admin"
        ? "/admin/dashboard"
        : user?.role === "super-admin"
          ? "/super-admin/dashboard"
          : "/account/settings";

  const accountMenuItems = (() => {
    const baseItems = [
      {
        key: "account",
        label: user?.role === "customer" ? "My Account" : "Dashboard",
        href: user?.role === "customer" ? "/account/settings" : dashboardPath,
      },
      {
        key: "orders",
        label: user?.role === "customer" ? "Order History" : "Orders",
        href:
          user?.role === "customer"
            ? "/account/orders"
            : `/${user?.role}/orders`,
      },
      {
        key: "payments",
        label: user?.role === "customer" ? "Payment History" : "Payments",
        href:
          user?.role === "customer"
            ? "/account/payments"
            : `/${user?.role}/payments`,
      },
      {
        key: "chat",
        label: "Live Chat",
        href:
          user?.role === "customer" ? "/account/chat" : `/${user?.role}/chat`,
      },
    ];

    if (user?.role === "customer") {
      baseItems.splice(2, 0, {
        key: "wishlist",
        label: "Wishlist",
        href: "/account/wishlist",
      });
    }

    if (user?.role === "provider") {
      baseItems.push(
        { key: "products", label: "Products", href: "/provider/products" },
        { key: "reviews", label: "Reviews", href: "/provider/reviews" },
      );
    }

    if (user?.role === "admin") {
      baseItems.push(
        {
          key: "products",
          label: "Manage Products",
          href: "/admin/manage-products",
        },
        { key: "reviews", label: "Reviews", href: "/admin/reviews" },
      );
    }

    if (user?.role === "super-admin") {
      baseItems.push(
        {
          key: "providers",
          label: "Providers",
          href: "/super-admin/providers",
        },
        {
          key: "analytics",
          label: "Analytics",
          href: "/super-admin/analytics",
        },
      );
    }

    return baseItems;
  })();

  return (
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
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {canUseCart ? (
            <>
              {isAuthenticated ? (
                <Link to="/account/wishlist">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
              ) : null}
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
            </>
          ) : null}
          {isAuthenticated ? (
            <>
              <ChatNavButton />
              <NotificationBell />
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: [
                    ...accountMenuItems.map((item) => ({
                      key: item.key,
                      label: <Link to={item.href}>{item.label}</Link>,
                    })),
                    {
                      key: "logout",
                      label: (
                        <button type="button" onClick={logout}>
                          Logout
                        </button>
                      ),
                    },
                  ],
                }}
                dropdownRender={(menu) => (
                  <div className="min-w-[250px] rounded-xl border bg-card p-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={userData?.profileImage || undefined}
                        size={40}
                      >
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                      <div className="min-w-0">
                        <Typography.Text strong className="block truncate">
                          {userData?.name || user?.name || "User"}
                        </Typography.Text>
                        <Typography.Text type="secondary" className="text-xs">
                          {userData?.email || user?.email || ""}
                        </Typography.Text>
                      </div>
                    </div>
                    <Divider className="my-3" />
                    {menu}
                  </div>
                )}
              >
                <button className="flex items-center gap-3 rounded-full border border-border/70 bg-background px-2 py-1 pr-3 transition hover:bg-muted">
                  <Avatar src={userData?.profileImage || undefined} size={32}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <div className="hidden text-left lg:block">
                    <div className="text-sm font-medium leading-none">
                      {userData?.name || user?.name || "User"}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {user?.role === "customer" ? "My Account" : "Dashboard"}
                    </div>
                  </div>
                </button>
              </Dropdown>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="hero" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated ? (
            <>
              <ChatNavButton />
              <NotificationBell />
            </>
          ) : null}
          <button
            className="text-foreground"
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
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
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {link.title}
              </Link>
            ))}
            {canUseCart ? (
              <>
                {isAuthenticated ? (
                  <Link
                    to="/account/wishlist"
                    onClick={() => setMobileNav(false)}
                    className={cn(
                      "block text-sm font-medium py-2",
                      location.pathname === "/account/wishlist"
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    Wishlist
                  </Link>
                ) : null}
              </>
            ) : null}
            {canUseCart ? (
              <Link
                to="/cart"
                onClick={() => setMobileNav(false)}
                className={cn(
                  "block text-sm font-medium py-2",
                  location.pathname === "/cart"
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                Cart ({itemCount})
              </Link>
            ) : null}
            {isAuthenticated ? (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 rounded-xl border bg-secondary/30 p-3">
                  <Avatar src={userData?.profileImage || undefined} size={36}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {userData?.name || user?.name || "User"}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {userData?.email || user?.email || ""}
                    </div>
                  </div>
                </div>
                {accountMenuItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => setMobileNav(false)}
                    className="block text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  variant="hero"
                  className="w-full"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileNav(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button variant="hero" className="w-full" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
