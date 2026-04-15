import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Empty,
  Image,
  Input,
  Popconfirm,
  Segmented,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  Eye,
  Filter,
  Grid2X2,
  LayoutList,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

import CustomTable from "@/components/shared/table/CustomTable";
import RefreshButton from "@/components/shared/button/RefreshButton";
import ProductCreateModal from "@/components/products/ProductCreateModal";
import ProductDetailsDrawer from "@/components/products/ProductDetailsDrawer";
import ProductEditModal from "@/components/products/ProductEditModal";
import ProductFiltersDrawer from "@/components/products/ProductFiltersDrawer";
import { getErrorMessage } from "@/components/products/productForm.helpers";
import ProductGridView from "@/components/products/ProductGridView";
import type {
  CategoryOption,
  DeliveryZoneOption,
  FilterState,
  PaginationState,
  ProviderOption,
  ViewMode,
} from "@/components/products/productManagement.types";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { toast } from "@/hooks/use-toast";
import { useGetAllProvidersQuery } from "@/redux/features/admin/providerManagementApi";
import { useGetCategoriesQuery } from "@/redux/features/generalApi/categoriesApi";
import { useGetDeliveryZonesQuery } from "@/redux/features/generalApi/deliveryZonesApi";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import {
  type Product,
  useDeleteProductMutation,
  useGetManagedProductsQuery,
  useRestoreProductMutation,
} from "@/redux/features/products/productApi";
import { formatCurrencyAmount } from "@/utils/currency";
import TableSearch from "../shared/table/TableSearch";

const { Title, Paragraph } = Typography;

type ProductManagementPageProps = {
  role: "provider" | "admin";
};

const getProductImage = (product: Product) =>
  product.images?.[0]?.url ||
  "https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image";

const ProductManagementPage = ({ role }: ProductManagementPageProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categoryId: undefined,
    providerId: undefined,
    status: undefined,
    isFeatured: undefined,
    isDiscount: undefined,
    priceSort: undefined,
    dateSort: "new-to-old",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
  });
  const [listMode, setListMode] = useState<"active" | "archived">("active");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { currency = defaultSystemCurrency } = useSystemCurrency();

  const { data: categoryResponse, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery(undefined);
  const { data: providerResponse, isLoading: isProvidersLoading } =
    useGetAllProvidersQuery(
      role === "admin" ? { status: "APPROVED" } : undefined,
      { skip: role !== "admin" },
    );
  const { data: deliveryZoneResponse } = useGetDeliveryZonesQuery();
  const {
    data: productResponse,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
    refetch,
  } = useGetManagedProductsQuery({
    search: filters.search || undefined,
    categoryId: filters.categoryId || undefined,
    providerId: role === "admin" ? filters.providerId || undefined : undefined,
    archivedOnly: role === "admin" ? listMode === "archived" : undefined,
    status: filters.status,
    isFeatured: filters.isFeatured,
    isDiscount: filters.isDiscount,
    priceSort: filters.priceSort,
    dateSort: filters.dateSort,
    page: pagination.page,
    limit: pagination.limit,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [restoreProduct, { isLoading: isRestoring }] =
    useRestoreProductMutation();

  const categoryOptions = useMemo<CategoryOption[]>(
    () => (categoryResponse?.data ?? []) as CategoryOption[],
    [categoryResponse],
  );

  const providerOptions = useMemo<ProviderOption[]>(
    () => (providerResponse?.data ?? []) as ProviderOption[],
    [providerResponse],
  );
  const deliveryZoneOptions = useMemo<DeliveryZoneOption[]>(
    () => (deliveryZoneResponse?.data ?? []) as DeliveryZoneOption[],
    [deliveryZoneResponse],
  );

  const products = useMemo<Product[]>(
    () => productResponse?.data ?? [],
    [productResponse],
  );
  const meta = productResponse?.meta;

  const setFilterValue = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      categoryId: undefined,
      providerId: undefined,
      status: undefined,
      isFeatured: undefined,
      isDiscount: undefined,
      priceSort: undefined,
      dateSort: "new-to-old",
    });
    setPagination({
      page: 1,
      limit: 10,
    });
  };

  const hasExtraFilters = Boolean(
    filters.status ||
    filters.isFeatured !== undefined ||
    filters.isDiscount !== undefined ||
    filters.priceSort ||
    (filters.dateSort && filters.dateSort !== "new-to-old"),
  );

  const hasAnyFilters = Boolean(
    filters.search ||
    filters.categoryId ||
    filters.providerId ||
    hasExtraFilters,
  );

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleListModeChange = (value: string | number) => {
    setListMode(value as "active" | "archived");
    setPagination({
      page: 1,
      limit: 10,
    });
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      toast({
        title: "Product archived",
        description: "The product has been archived successfully.",
      });
    } catch (error: unknown) {
      toast({
        title: "Delete failed",
        description:
          getErrorMessage(error) ||
          "Something went wrong while archiving the product.",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async (productId: string) => {
    try {
      await restoreProduct(productId).unwrap();
      toast({
        title: "Product restored",
        description: "The product has been restored successfully.",
      });
    } catch (error: unknown) {
      toast({
        title: "Restore failed",
        description:
          getErrorMessage(error) ||
          "Something went wrong while restoring the product.",
        variant: "destructive",
      });
    }
  };

  const columns = useMemo<ColumnsType<Product>>(
    () => [
      {
        title: "Product",
        key: "product",
        width: 300,
        render: (_, product) => (
          <div className="flex min-w-[240px] items-center gap-3">
            <Image
              src={getProductImage(product)}
              alt={product.name}
              width={56}
              height={56}
              className="rounded-xl object-cover"
              preview={false}
            />
            <div className="min-w-0">
              <div className="truncate font-medium">{product.name}</div>
              <div className="text-xs text-muted-foreground">
                {product.sku || product.slug}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Category",
        dataIndex: ["category", "name"],
        key: "category",
        width: 160,
      },
      ...(role === "admin"
        ? [
            {
              title: "Provider",
              key: "provider",
              width: 220,
              render: (_: unknown, product: Product) => (
                <div>
                  <div className="font-medium">
                    {product.provider.providerProfile?.shopName ||
                      product.provider.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {product.provider.email}
                  </div>
                </div>
              ),
            } satisfies ColumnsType<Product>[number],
          ]
        : []),
      {
        title: "Price",
        key: "price",
        width: 150,
        render: (_, product) => (
          <div>
            <div className="font-medium">{formatCurrencyAmount(product.price, currency)}</div>
            {product.discountType && (product.discountValue || 0) > 0 ? (
              <div className="text-xs text-emerald-600">
                {product.discountType === "PERCENTAGE"
                  ? `${product.discountValue}% off`
                  : `${formatCurrencyAmount(Number(product.discountValue || 0), currency)} off`}
              </div>
            ) : null}
          </div>
        ),
      },
      {
        title: "Stock",
        key: "stock",
        width: 120,
        render: (_, product) => (
          <div>
            <div className="font-medium">{product.stock}</div>
            <div className="text-xs text-muted-foreground">
              Threshold {product.lowStockThreshold}
            </div>
          </div>
        ),
      },
      {
        title: "Status",
        key: "status",
        width: 180,
        render: (_, product) => (
          <Space wrap>
            <Tag color={product.isPublished ? "green" : "gold"}>
              {product.isPublished ? "Published" : "Draft"}
            </Tag>
            {product.isFeatured ? <Tag color="blue">Featured</Tag> : null}
            {product.deletedAt ? <Tag color="red">Archived</Tag> : null}
          </Space>
        ),
      },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 140,
        render: (value: string) => new Date(value).toLocaleDateString(),
      },
      {
        title: "Actions",
        key: "actions",
        width: 140,
        render: (_, product) => (
          <Space>
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => setDetailsProduct(product)}
            />
            {listMode === "archived" ? (
              <Button
                type="text"
                icon={<RotateCcw size={16} />}
                loading={isRestoring}
                onClick={() => handleRestore(product.id)}
              />
            ) : (
              <>
                <Button
                  type="text"
                  icon={<Pencil size={16} />}
                  onClick={() => openEditModal(product)}
                />
                <Popconfirm
                  title="Archive this product?"
                  description="This product will be hidden from active lists."
                  onConfirm={() => handleDelete(product.id)}
                  okText="Archive"
                  okButtonProps={{ danger: true, loading: isDeleting }}
                >
                  <Button type="text" danger icon={<Trash2 size={16} />} />
                </Popconfirm>
              </>
            )}
          </Space>
        ),
      },
    ],
    [currency, isDeleting, isRestoring, listMode, role],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Title level={2} className="!mb-2">
            {role === "provider" ? "My Products" : "Manage Products"}
          </Title>
          <Paragraph className="!mb-0 text-muted-foreground">
            {role === "provider"
              ? "Create and manage your own product catalog."
              : "Create, review, and manage products across all providers."}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {role === "admin" ? (
            <Segmented
              value={listMode}
              onChange={handleListModeChange}
              options={[
                { label: "Active Products", value: "active" },
                { label: "Archived Products", value: "archived" },
              ]}
            />
          ) : null}

          {listMode === "active" ? (
            <Button
              type="primary"
              size="large"
              icon={<Plus size={16} />}
              onClick={openCreateModal}
            >
              Add Product
            </Button>
          ) : null}
        </div>
      </div>

      <Card bordered={false} className="shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="w-full">
                <TableSearch
                  setQuery={setFilters}
                  placeholder="Search here..."
                />
              </div>

              <Select
                allowClear
                loading={isCategoriesLoading}
                placeholder="Category"
                className="w-full"
                value={filters.categoryId}
                onChange={(value) => setFilterValue("categoryId", value)}
                options={categoryOptions.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />

              {role === "admin" ? (
                <Select
                  allowClear
                  loading={isProvidersLoading}
                  placeholder="Provider"
                  className="w-full"
                  value={filters.providerId}
                  onChange={(value) => setFilterValue("providerId", value)}
                  options={providerOptions.map((provider) => ({
                    value: provider.userId,
                    label: `${provider.shopName} (${provider.user.name})`,
                  }))}
                />
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
              <Button
                type={viewMode === "table" ? "primary" : "default"}
                icon={<LayoutList size={16} />}
                onClick={() => setViewMode("table")}
              >
                Table
              </Button>
              <Button
                type={viewMode === "grid" ? "primary" : "default"}
                icon={<Grid2X2 size={16} />}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                icon={<Filter size={16} />}
                onClick={() => setIsFilterDrawerOpen(true)}
              >
                More Filters
                {hasExtraFilters ? " Active" : ""}
              </Button>
              {hasAnyFilters ? (
                <Button onClick={resetFilters}>Clear</Button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {role === "admin" && listMode === "archived" ? (
              <Tag color="red">Archived Products</Tag>
            ) : null}
            {filters.status ? (
              <Tag color="blue">Status: {filters.status}</Tag>
            ) : null}
            {filters.isFeatured !== undefined ? (
              <Tag color="cyan">
                {filters.isFeatured ? "Featured only" : "Non-featured"}
              </Tag>
            ) : null}
            {filters.isDiscount !== undefined ? (
              <Tag color="purple">
                {filters.isDiscount ? "Discounted only" : "No discount"}
              </Tag>
            ) : null}
            {filters.priceSort ? (
              <Tag color="gold">Price: {filters.priceSort}</Tag>
            ) : null}
            {filters.dateSort && filters.dateSort !== "new-to-old" ? (
              <Tag color="geekblue">Date: {filters.dateSort}</Tag>
            ) : null}
          </div>
        </div>
      </Card>

      <Card bordered={false} className="shadow-sm">
        <div className="flex items-center justify-end gap-2 mb-3">
          <RefreshButton
            refetch={refetch}
            isLoading={isProductsLoading || isProductsFetching}
          />
        </div>
        {isProductsLoading || isProductsFetching ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spin />
          </div>
        ) : viewMode === "table" ? (
          <CustomTable<Product>
            columns={columns}
            dataSource={products}
            rowKey="id"
            currentPage={meta?.page || pagination.page}
            pageSize={meta?.limit || pagination.limit}
            totaldata={meta?.total || 0}
            setPagination={(updater) => {
              setPagination((prev) => {
                const next =
                  typeof updater === "function"
                    ? updater({
                        page: prev.page,
                        per_page: prev.limit,
                      })
                    : updater;

                return {
                  page: next.page,
                  limit: next.per_page,
                };
              });
            }}
          />
        ) : products.length ? (
          <ProductGridView
            products={products}
            role={role}
            isDeleting={isDeleting}
            isArchivedView={listMode === "archived"}
            isRestoring={isRestoring}
            currentPage={meta?.page || pagination.page}
            pageSize={meta?.limit || pagination.limit}
            total={meta?.total || 0}
            onPageChange={setPagination}
            onView={setDetailsProduct}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        ) : (
          <Empty
            description="No products found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
      <ProductFiltersDrawer
        open={isFilterDrawerOpen}
        filters={filters}
        onClose={() => setIsFilterDrawerOpen(false)}
        onReset={resetFilters}
        onChange={setFilterValue}
      />

      <ProductCreateModal
        role={role}
        isModalOpen={isCreateModalOpen}
        closeModal={() => setIsCreateModalOpen(false)}
        categoryOptions={categoryOptions}
        providerOptions={providerOptions}
        deliveryZoneOptions={deliveryZoneOptions}
      />

      <ProductEditModal
        role={role}
        product={editingProduct}
        isModalOpen={isEditModalOpen}
        closeModal={closeEditModal}
        categoryOptions={categoryOptions}
        providerOptions={providerOptions}
        deliveryZoneOptions={deliveryZoneOptions}
      />

      <ProductDetailsDrawer
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
      />
    </div>
  );
};

export default ProductManagementPage;
