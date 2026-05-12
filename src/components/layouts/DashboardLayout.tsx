import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Alert, Avatar, Divider, Dropdown, Typography } from "antd";
import {
  ChevronLeft,
  Menu,
  Store,
  LogOut,
  X,
  ChevronDown,
} from "lucide-react";
import { useGetMyWalletQuery } from "@/redux/features/wallet/walletApi";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { formatCurrencyAmount } from "@/utils/currency";
import {
  dashboardMenuItems,
  dashboardRoleLabels,
  getOpenMenusForPath,
} from "./dashboardMenuConfig";
import NotificationBell from "@/components/notifications/NotificationBell";
import ChatNavButton from "@/components/chat/ChatNavButton";

interface DashboardLayoutProps {
  role: "admin" | "provider" | "super-admin";
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role: dashboardRole,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  const role = user?.role ?? dashboardRole;
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const { data: walletData } = useGetMyWalletQuery(undefined, {
    skip: role !== "provider",
  });
  const items = useMemo(() => dashboardMenuItems[role] || [], [role]);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() =>
    getOpenMenusForPath(items, location.pathname),
  );

  useEffect(() => {
    const activeMenus = getOpenMenusForPath(items, location.pathname);
    const currentMenuTitles = new Set(items.map((item) => item.title));

    setOpenMenus((prev) => {
      const persistedMenus = Object.fromEntries(
        Object.entries(prev).filter(([title]) => currentMenuTitles.has(title)),
      );
      const next = { ...activeMenus, ...persistedMenus };
      const hasChanges =
        Object.keys(next).length !== Object.keys(prev).length ||
        Object.entries(next).some(([key, value]) => prev[key] !== value);

      return hasChanges ? next : prev;
    });
  }, [items, location.pathname]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  const profileMenuItems = useMemo(() => {
    const items = [
      {
        key: "dashboard",
        label: "Dashboard",
        onClick: () => navigate(`/${role}/dashboard`),
      },
    ];

    if (role === "provider") {
      items.push({
        key: "wallet",
        label: "Wallet & Earnings",
        onClick: () => navigate("/provider/wallet"),
      });
    }

    items.push({
      key: "settings",
      label: "Profile Settings",
      onClick: () => navigate(`/${role}/settings`),
    });
    items.push({
      key: "logout",
      label: "Logout",
      onClick: handleLogout,
    });

    return items;
  }, [handleLogout, navigate, role]);

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
                {dashboardRoleLabels[role]}
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
            <ChatNavButton />
            <NotificationBell />
            <Dropdown
              trigger={["click"]}
              menu={{ items: profileMenuItems }}
              dropdownRender={(menu) => (
                <div className="min-w-[260px] rounded-xl border bg-card p-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Avatar src={userData?.profileImage || undefined} size={40}>
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
                  {role === "provider" ? (
                    <>
                      <Divider className="my-3" />
                      <div className="rounded-lg bg-secondary/40 px-3 py-2">
                        <Typography.Text
                          type="secondary"
                          className="block text-xs"
                        >
                          Available Balance
                        </Typography.Text>
                        <Typography.Text strong>
                          {formatCurrencyAmount(
                            Number(
                              walletData?.data?.wallet?.availableBalance || 0,
                            ),
                            currency,
                          )}
                        </Typography.Text>
                      </div>
                    </>
                  ) : null}
                  <Divider className="my-3" />
                  {menu}
                </div>
              )}
            >
              <button className="flex items-center gap-3 rounded-full border border-border/70 bg-background px-2 py-1 pr-3 transition hover:bg-muted">
                <Avatar src={userData?.profileImage || undefined} size={32}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
                <div className="hidden text-left md:block">
                  <div className="text-sm font-medium leading-none">
                    {userData?.name || user?.name || "User"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {dashboardRoleLabels[role]}
                  </div>
                </div>
              </button>
            </Dropdown>
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
