import type { ElementType } from "react";
import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  MapPinned,
  Package,
  Receipt,
  Settings,
  Shield,
  ShoppingCart,
  Star,
  Store,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  icon: ElementType;
  path?: string;
  children?: SidebarItem[];
}

export const dashboardMenuItems: Record<string, SidebarItem[]> = {
  admin: [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "Manage Products", icon: Package, path: "/admin/manage-products" },
    { title: "Delivery Zones", icon: MapPinned, path: "/admin/delivery-zones" },
    {
      title: "Order Management",
      icon: ShoppingCart,
      children: [
        { title: "Orders", icon: ShoppingCart, path: "/admin/orders" },
        { title: "Payments", icon: CreditCard, path: "/admin/payments" },
      ],
    },
    { title: "Wallet & Earnings", icon: Wallet, path: "/admin/wallet" },
    { title: "Reviews", icon: Star, path: "/admin/reviews" },
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
    {
      title: "CMS",
      icon: FileText,
      children: [
        { title: "CMS Management", icon: FileText, path: "/admin/cms/management" },
        { title: "Site Config", icon: Settings, path: "/admin/cms/site-config" },
      ],
    },
    { title: "Profile Settings", icon: Settings, path: "/admin/settings" },
  ],
  provider: [
    { title: "Dashboard", icon: LayoutDashboard, path: "/provider/dashboard" },
    { title: "Products", icon: Package, path: "/provider/products" },
    {
      title: "Order Management",
      icon: ShoppingCart,
      children: [
        { title: "Orders", icon: ShoppingCart, path: "/provider/orders" },
        { title: "Payments", icon: CreditCard, path: "/provider/payments" },
      ],
    },
    { title: "Wallet & Earnings", icon: Wallet, path: "/provider/wallet" },
    { title: "Reviews", icon: Star, path: "/provider/reviews" },
    {
      title: "Expense Tracker",
      icon: FileText,
      path: "/provider/expense-tracker",
    },
    { title: "POS", icon: CreditCard, path: "/provider/pos" },
    { title: "Receipts", icon: Receipt, path: "/provider/receipts" },
    { title: "Reports", icon: TrendingUp, path: "/provider/reports" },
    { title: "Settings", icon: Settings, path: "/provider/settings" },
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
      title: "Order Management",
      icon: ShoppingCart,
      children: [
        { title: "Orders", icon: ShoppingCart, path: "/super-admin/orders" },
        { title: "Payments", icon: CreditCard, path: "/super-admin/payments" },
      ],
    },
    {
      title: "Delivery Zones",
      icon: MapPinned,
      path: "/super-admin/delivery-zones",
    },
    { title: "Analytics", icon: BarChart3, path: "/super-admin/analytics" },
    { title: "Audit Log", icon: FileText, path: "/super-admin/audit-log" },
    {
      title: "CMS",
      icon: FileText,
      children: [
        {
          title: "CMS Management",
          icon: FileText,
          path: "/super-admin/cms/management",
        },
        {
          title: "Site Config",
          icon: Settings,
          path: "/super-admin/cms/site-config",
        },
      ],
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/super-admin/settings",
    },
  ],
};

export const dashboardRoleLabels: Record<string, string> = {
  admin: "Admin Panel",
  provider: "Vendor Panel",
  "super-admin": "Super Admin",
};

export const getOpenMenusForPath = (
  items: SidebarItem[],
  pathname: string,
): Record<string, boolean> =>
  items.reduce<Record<string, boolean>>((acc, item) => {
    if (item.children?.some((child) => child.path === pathname)) {
      acc[item.title] = true;
    }

    return acc;
  }, {});
