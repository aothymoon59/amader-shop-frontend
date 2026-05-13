import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Empty,
  Input,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  ArrowUpRight,
  Box,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  Store,
  UserRound,
} from "lucide-react";

import { useGetAllProvidersQuery } from "@/redux/features/admin/providerManagementApi";
import {
  type Product,
  useGetManagedProductsQuery,
} from "@/redux/features/products/productApi";
import { formatDateTime } from "@/utils/dateFormatter";

type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

type StoreRecord = {
  id: string;
  userId: string;
  shopName: string;
  businessType: string;
  phone: string;
  address: string;
  tradeLicense?: string | null;
  description?: string | null;
  status: ProviderStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

const statusColor: Record<ProviderStatus, string> = {
  APPROVED: "green",
  PENDING: "gold",
  REJECTED: "red",
};

const AdminStores = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { providerId } = useParams();
  const [query, setQuery] = useState("");
  const { data, isLoading } = useGetAllProvidersQuery({
    page: 1,
    limit: 100,
    search: query,
  });
  const stores = (data?.data || []) as StoreRecord[];
  const selectedStore =
    stores.find((store) => store.userId === providerId || store.id === providerId) ||
    stores[0] ||
    null;

  const { data: productsResponse, isFetching: productsLoading } =
    useGetManagedProductsQuery(
      {
        providerId: selectedStore?.userId,
        page: 1,
        limit: 12,
      },
      { skip: !selectedStore?.userId },
    );
  const products = productsResponse?.data || [];
  const productStats = useMemo(
    () => ({
      total: productsResponse?.meta?.total || products.length,
      published: products.filter((product) => product.isPublished).length,
      lowStock: products.filter(
        (product) => product.stock <= product.lowStockThreshold,
      ).length,
    }),
    [products, productsResponse?.meta?.total],
  );
  const roleBase = location.pathname.startsWith("/super-admin")
    ? "/super-admin"
    : "/admin";

  const openStore = (store: StoreRecord) => {
    navigate(`${roleBase}/stores/${store.userId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Typography.Title level={2} className="!mb-1">
            Stores
          </Typography.Title>
          <p className="text-sm text-muted-foreground">
            Browse every provider store, inspect owner details, and review store
            products from one workspace.
          </p>
        </div>
        <Input
          className="max-w-md"
          prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          placeholder="Search store, owner, email, or phone"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="grid min-h-[620px] grid-cols-1 overflow-hidden rounded-xl border bg-card lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="border-b lg:border-b-0 lg:border-r">
          <div className="border-b p-4">
            <div className="font-semibold">All stores</div>
            <div className="text-xs text-muted-foreground">
              {data?.meta?.total || stores.length} registered store(s)
            </div>
          </div>
          <div className="max-h-[580px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex min-h-48 items-center justify-center">
                <Spin />
              </div>
            ) : stores.length ? (
              stores.map((store) => {
                const active = selectedStore?.id === store.id;

                return (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => openStore(store)}
                    className={`mb-1 flex w-full gap-3 rounded-lg border p-3 text-left transition ${
                      active
                        ? "border-primary/30 bg-primary/5"
                        : "border-transparent hover:border-border hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">
                      {store.shopName?.charAt(0) || "S"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-base font-semibold">
                        {store.shopName}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {store.user?.name || "Provider"} - {store.businessType}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Tag color={statusColor[store.status]}>{store.status}</Tag>
                        <Badge
                          status={store.isActive ? "success" : "default"}
                          text={store.isActive ? "Active" : "Inactive"}
                        />
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <Empty description="No stores found" />
            )}
          </div>
        </aside>

        <section className="min-w-0 p-5">
          {!selectedStore ? (
            <div className="flex h-full items-center justify-center">
              <Empty description="Select a store" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Tag color={statusColor[selectedStore.status]}>
                      {selectedStore.status}
                    </Tag>
                    <Tag>{selectedStore.businessType}</Tag>
                    <Tag color={selectedStore.isActive ? "blue" : "default"}>
                      {selectedStore.isActive ? "Active" : "Inactive"}
                    </Tag>
                  </div>
                  <h1 className="truncate text-3xl font-bold">
                    {selectedStore.shopName}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                    {selectedStore.description || "No store description added."}
                  </p>
                </div>
                <Button
                  icon={<ArrowUpRight className="h-4 w-4" />}
                  onClick={() =>
                    navigate(
                      `${roleBase}/manage-products?providerId=${selectedStore.userId}`,
                    )
                  }
                >
                  Manage Products
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Products</span>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">
                    {productStats.total}
                  </div>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Published</span>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">
                    {productStats.published}
                  </div>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Low Stock</span>
                    <Box className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">
                    {productStats.lowStock}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <div className="mb-4 font-semibold">Store info</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{selectedStore.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{selectedStore.address}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Store className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>Created {formatDateTime(selectedStore.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="mb-4 font-semibold">Owner</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{selectedStore.user?.name || "Provider"}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{selectedStore.user?.email || "No email"}</span>
                    </div>
                    {selectedStore.tradeLicense ? (
                      <a
                        href={selectedStore.tradeLicense}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        View trade license <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">Products</div>
                    <div className="text-xs text-muted-foreground">
                      Latest products connected to this store.
                    </div>
                  </div>
                  {productsLoading ? <Spin size="small" /> : null}
                </div>

                {products.length ? (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {products.map((product: Product) => (
                      <div
                        key={product.id}
                        className="overflow-hidden rounded-lg border bg-background"
                      >
                        <div className="aspect-[4/3] bg-secondary">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="p-3">
                          <div className="line-clamp-1 font-semibold">
                            {product.name}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Stock {product.stock} - {product.category?.name}
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <Tag color={product.isPublished ? "green" : "default"}>
                              {product.isPublished ? "Published" : "Draft"}
                            </Tag>
                            <span className="font-medium">{product.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description="No products for this store" />
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminStores;
