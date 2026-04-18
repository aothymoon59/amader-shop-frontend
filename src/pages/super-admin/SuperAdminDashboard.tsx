import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  type SuperAdminActivity,
  type SuperAdminDashboardOverview,
  useGetDashboardOverviewQuery,
} from "@/redux/features/reports/dashboardApi";
import { Shield, Users, Store, BarChart3, ShoppingCart } from "lucide-react";
import { Spin } from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SuperAdminDashboard = () => {
  const { data, isLoading, isFetching } = useGetDashboardOverviewQuery();
  const overview = data?.data as SuperAdminDashboardOverview | undefined;

  const stats = [
    { title: "Total Admins", value: overview?.stats?.totalAdmins || 0, icon: Shield },
    { title: "Total Providers", value: overview?.stats?.totalProviders || 0, icon: Store },
    { title: "Total Users", value: overview?.stats?.totalUsers || 0, icon: Users },
    { title: "Total Orders", value: overview?.stats?.totalOrders || 0, icon: ShoppingCart },
  ];

  return (
    <DashboardLayout role="super-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Overview</h1>
          <p className="text-muted-foreground text-sm">
            Super admin dashboard with live marketplace metrics
          </p>
        </div>

        {isLoading || isFetching ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <div key={s.title} className="rounded-xl border bg-card p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.title}</span>
                    <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
                      <s.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-xl border bg-card p-6 xl:col-span-2">
                <h2 className="mb-4 font-semibold">Platform Activity Trend</h2>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overview?.charts?.systemOrders || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="orders" stroke="#2563eb" fill="#bfdbfe" />
                      <Area type="monotone" dataKey="revenue" stroke="#16a34a" fill="#bbf7d0" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border bg-card p-5">
                  <h2 className="font-semibold">Quick Summary</h2>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">Pending Provider Applications</p>
                      <p className="mt-1 text-2xl font-bold">
                        {overview?.stats?.pendingProviderApplications || 0}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">Active Providers</p>
                      <p className="mt-1 text-2xl font-bold">
                        {overview?.stats?.activeProviders || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 font-semibold">System Activity</h2>
              <div className="space-y-3">
                {(overview?.recentActivity || []).map((activity: SuperAdminActivity, index: number) => (
                  <div
                    key={`${activity.action}-${index}`}
                    className="flex justify-between border-b py-2 last:border-0 text-sm"
                  >
                    <span>{activity.action}</span>
                    <span className="text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
