import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Alert } from "antd";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  Menu,
  Store,
  FileText,
  CreditCard,
  Shield,
  UserCheck,
  TrendingUp,
  Receipt,
  LogOut,
  X,
  ChevronDown,
} from "lucide-react";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  children?: SidebarItem[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "provider" | "super-admin";
}

const menuItems: Record<string, SidebarItem[]> = {
  admin: [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "Manage Products", icon: Package, path: "/admin/manage-products" },
    { title: "Orders", icon: ShoppingCart, path: "/admin/orders" },
    {
      title: "User Management",
      icon: Users,
      children: [
        { title: "Providers", icon: Store, path: "/admin/providers" },
        { title: "Customers", icon: Users, path: "/admin/customers" },
      ],
    },
    { title: "Reports", icon: BarChart3, path: "/admin/reports" },
    { title: "Audit Log", icon: FileText, path: "/admin/audit-log" },
    { title: "CMS", icon: FileText, path: "/admin/cms" },
    { title: "Profile Settings", icon: Settings, path: "/admin/settings" },
  ],
  provider: [
    { title: "Dashboard", icon: LayoutDashboard, path: "/provider/dashboard" },
    { title: "Products", icon: Package, path: "/provider/products" },
    { title: "Orders", icon: ShoppingCart, path: "/provider/orders" },
    { title: "POS", icon: CreditCard, path: "/provider/pos" },
    { title: "Receipts", icon: Receipt, path: "/provider/receipts" },
    { title: "Reports", icon: TrendingUp, path: "/provider/reports" },
    { title: "Profile Settings", icon: Settings, path: "/provider/settings" },
  ],
  "super-admin": [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/super-admin/dashboard",
    },
    {
      title: "User Management",
      icon: Users,
      children: [
        { title: "Admins", icon: Shield, path: "/super-admin/admins" },
        { title: "Providers", icon: UserCheck, path: "/super-admin/providers" },
      ],
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      path: "/super-admin/orders",
    },
    { title: "Analytics", icon: BarChart3, path: "/super-admin/analytics" },
    { title: "Audit Log", icon: FileText, path: "/super-admin/audit-log" },
    { title: "CMS", icon: FileText, path: "/super-admin/cms" },
    {
      title: "Profile Settings",
      icon: Settings,
      path: "/super-admin/settings",
    },
  ],
};

const roleLabels: Record<string, string> = {
  admin: "Admin Panel",
  provider: "Vendor Panel",
  "super-admin": "Super Admin",
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  // console.log("user", user);
  const role = user?.role;
  const items = useMemo(() => menuItems[role] || [], [role]);
  const activeSubmenuTitles = useMemo(
    () =>
      items
        .filter((item) =>
          item.children?.some((child) => child.path === location.pathname),
        )
        .map((item) => item.title),
    [items, location.pathname],
  );
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeSubmenuTitles.length === 0) return;

    setOpenMenus((prev) => {
      const next = { ...prev };
      let changed = false;

      activeSubmenuTitles.forEach((title) => {
        if (!next[title]) {
          next[title] = true;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [activeSubmenuTitles]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const toggleMenu = (title: string) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenMenus((prev) => ({
        ...prev,
        [title]: true,
      }));
      return;
    }

    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-secondary/30">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 lg:relative",
          collapsed ? "w-[70px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <Store className="h-7 w-7 text-sidebar-primary" />
              <span className="text-lg font-bold text-sidebar-primary-foreground">
                {roleLabels[role]}
              </span>
            </Link>
          )}
          {collapsed && (
            <Store className="mx-auto h-7 w-7 text-sidebar-primary" />
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="text-sidebar-muted hover:text-sidebar-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {items.map((item) => {
            const isSubmenu = Boolean(item.children?.length);
            const isActive =
              location.pathname === item.path ||
              item.children?.some((child) => child.path === location.pathname);
            const isOpen = openMenus[item.title];

            if (isSubmenu) {
              return (
                <div key={item.title} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary/15 text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive && "drop-shadow-sm",
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isOpen && "rotate-180",
                          )}
                        />
                      </>
                    )}
                  </button>

                  {!collapsed && isOpen && (
                    <div className="ml-4 space-y-1 border-l border-sidebar-border pl-3">
                      {item.children?.map((child) => {
                        const isChildActive = location.pathname === child.path;

                        return (
                          <Link
                            key={child.path}
                            to={child.path!}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                              isChildActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            )}
                          >
                            <child.icon
                              className={cn(
                                "h-4 w-4 shrink-0",
                                isChildActive && "drop-shadow-sm",
                              )}
                            />
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path!}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive && "drop-shadow-sm",
                  )}
                />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180",
              )}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors mt-1"
          >
            <Store className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors mt-1"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {role === "provider" &&
            userData?.providerProfile?.isActive === false && (
              <Alert
                className="mb-4"
                type="warning"
                showIcon
                message="Provider account inactive"
                description="Your provider account is currently inactive. You can still view your account, but provider actions are blocked until an administrator reactivates it."
              />
            )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
