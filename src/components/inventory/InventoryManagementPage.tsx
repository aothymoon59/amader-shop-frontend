import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Segmented,
  Select,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import {
  ClipboardList,
  MinusCircle,
  PlusCircle,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import RefreshButton from "@/components/shared/button/RefreshButton";
import CustomTable from "@/components/shared/table/CustomTable";
import TableSearch from "@/components/shared/table/TableSearch";
import { getErrorMessage } from "@/components/products/productForm.helpers";
import { toast } from "@/hooks/use-toast";
import { useGetAllProvidersQuery } from "@/redux/features/admin/providerManagementApi";
import {
  type InventoryMovement,
  type InventoryMovementType,
  useAdjustInventoryStockMutation,
  useCreateInventoryMovementMutation,
  useGetInventoryMovementsQuery,
} from "@/redux/features/inventory/inventoryApi";
import {
  type Product,
  useGetManagedProductsQuery,
} from "@/redux/features/products/productApi";

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

type InventoryRole = "provider" | "admin" | "super-admin";
type StockControlMode = "IN" | "OUT" | "ADJUST";

type InventoryManagementPageProps = {
  role: InventoryRole;
};

type PaginationState = {
  page: number;
  limit: number;
};

type InventoryFilterState = {
  search?: string;
  providerId?: string;
  productId?: string;
  type?: InventoryMovementType;
};

type StockControlFormValues = {
  productId: string;
  quantity?: number;
  stock?: number;
  note?: string;
};

type ProviderOption = {
  id: string;
  userId: string;
  shopName: string;
  user?: {
    name?: string;
    email?: string;
  };
};

const movementTypeMeta: Record<
  InventoryMovementType,
  { label: string; color: string }
> = {
  IN: { label: "Stock In", color: "green" },
  OUT: { label: "Stock Out", color: "red" },
  ADJUSTMENT: { label: "Adjustment", color: "gold" },
};

const getProviderName = (product?: InventoryMovement["product"] | Product) =>
  product?.provider?.providerProfile?.shopName ||
  product?.provider?.name ||
  "Provider";

const getSignedQuantity = (movement: InventoryMovement) => {
  if (
    typeof movement.previousStock === "number" &&
    typeof movement.currentStock === "number"
  ) {
    return movement.currentStock - movement.previousStock;
  }

  if (movement.type === "OUT") return -movement.quantity;
  return movement.quantity;
};

const formatSignedQuantity = (movement: InventoryMovement) => {
  const value = getSignedQuantity(movement);
  if (value > 0) return `+${value}`;
  return String(value);
};

const InventoryManagementPage = ({ role }: InventoryManagementPageProps) => {
  const isProvider = role === "provider";
  const [form] = Form.useForm<StockControlFormValues>();
  const selectedProductId = Form.useWatch("productId", form);
  const [filters, setFilters] = useState<InventoryFilterState>({
    search: "",
  });
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
  });
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockMode, setStockMode] = useState<StockControlMode>("IN");

  const {
    data: providerResponse,
    isLoading: isProvidersLoading,
  } = useGetAllProvidersQuery(
    !isProvider ? { status: "APPROVED" } : undefined,
    { skip: isProvider },
  );

  const {
    data: productResponse,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
  } = useGetManagedProductsQuery({
    providerId: !isProvider ? filters.providerId || undefined : undefined,
    page: 1,
    limit: 100,
    dateSort: "new-to-old",
  });

  const {
    data: movementResponse,
    isLoading: isMovementsLoading,
    isFetching: isMovementsFetching,
    refetch,
  } = useGetInventoryMovementsQuery({
    search: filters.search || undefined,
    providerId: !isProvider ? filters.providerId || undefined : undefined,
    productId: filters.productId || undefined,
    type: filters.type || undefined,
    dateFrom: dateRange?.[0]?.format("YYYY-MM-DD"),
    dateTo: dateRange?.[1]?.format("YYYY-MM-DD"),
    page: pagination.page,
    limit: pagination.limit,
  });

  const [createMovement, { isLoading: isCreatingMovement }] =
    useCreateInventoryMovementMutation();
  const [adjustStock, { isLoading: isAdjustingStock }] =
    useAdjustInventoryStockMutation();

  const providers = useMemo<ProviderOption[]>(
    () => (providerResponse?.data ?? []) as ProviderOption[],
    [providerResponse],
  );

  const products = useMemo<Product[]>(
    () => productResponse?.data ?? [],
    [productResponse],
  );

  const movements = movementResponse?.data ?? [];
  const meta = movementResponse?.meta;
  const isSubmitting = isCreatingMovement || isAdjustingStock;
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  const pageStats = useMemo(() => {
    const stockIn = movements
      .filter((movement) => movement.type === "IN")
      .reduce((sum, movement) => sum + movement.quantity, 0);
    const stockOut = movements
      .filter((movement) => movement.type === "OUT")
      .reduce((sum, movement) => sum + movement.quantity, 0);
    const adjustments = movements.filter(
      (movement) => movement.type === "ADJUSTMENT",
    ).length;
    const lowStockProducts = products.filter(
      (product) => product.stock <= product.lowStockThreshold,
    ).length;

    return {
      stockIn,
      stockOut,
      adjustments,
      lowStockProducts,
    };
  }, [movements, products]);

  const setFilterValue = <K extends keyof InventoryFilterState>(
    key: K,
    value: InventoryFilterState[K],
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
    setFilters({ search: "" });
    setDateRange(null);
    setPagination({ page: 1, limit: 10 });
  };

  const openStockModal = (mode: StockControlMode) => {
    setStockMode(mode);
    form.resetFields();
    setIsStockModalOpen(true);
  };

  const closeStockModal = () => {
    setIsStockModalOpen(false);
    form.resetFields();
    setStockMode("IN");
  };

  const handleModeChange = (value: string | number) => {
    const nextMode = value as StockControlMode;
    const currentValues = form.getFieldsValue();

    setStockMode(nextMode);
    form.setFieldsValue({
      productId: currentValues.productId,
      note: currentValues.note,
      quantity: undefined,
      stock: undefined,
    });
  };

  const handleSubmit = async (values: StockControlFormValues) => {
    const note = values.note?.trim() || undefined;

    try {
      if (stockMode === "ADJUST") {
        await adjustStock({
          productId: values.productId,
          stock: Number(values.stock),
          note,
        }).unwrap();
      } else {
        await createMovement({
          productId: values.productId,
          type: stockMode,
          quantity: Number(values.quantity),
          note,
        }).unwrap();
      }

      toast({
        title:
          stockMode === "ADJUST"
            ? "Stock adjusted"
            : "Inventory movement saved",
        description: "Inventory has been updated successfully.",
      });
      closeStockModal();
    } catch (error: unknown) {
      toast({
        title: "Inventory update failed",
        description:
          getErrorMessage(error) ||
          "Something went wrong while updating inventory.",
        variant: "destructive",
      });
    }
  };

  const columns = useMemo<ColumnsType<InventoryMovement>>(
    () => [
      {
        title: "Product",
        key: "product",
        width: 260,
        render: (_, movement) => (
          <div className="min-w-[220px]">
            <div className="font-medium">{movement.product?.name}</div>
            <div className="text-xs text-muted-foreground">
              {movement.product?.sku || movement.product?.slug}
            </div>
          </div>
        ),
      },
      ...(!isProvider
        ? [
            {
              title: "Provider",
              key: "provider",
              width: 220,
              render: (_: unknown, movement: InventoryMovement) => (
                <div>
                  <div className="font-medium">
                    {getProviderName(movement.product)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {movement.product?.provider?.email}
                  </div>
                </div>
              ),
            } satisfies ColumnsType<InventoryMovement>[number],
          ]
        : []),
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        width: 130,
        render: (type: InventoryMovementType) => (
          <Tag color={movementTypeMeta[type].color}>
            {movementTypeMeta[type].label}
          </Tag>
        ),
      },
      {
        title: "Quantity",
        key: "quantity",
        width: 120,
        render: (_, movement) => {
          const signedQuantity = getSignedQuantity(movement);

          return (
            <Text
              strong
              type={
                signedQuantity < 0
                  ? "danger"
                  : signedQuantity > 0
                    ? "success"
                    : "secondary"
              }
            >
              {formatSignedQuantity(movement)}
            </Text>
          );
        },
      },
      {
        title: "Stock",
        key: "stock",
        width: 160,
        render: (_, movement) =>
          typeof movement.previousStock === "number" &&
          typeof movement.currentStock === "number" ? (
            <div>
              <div className="font-medium">
                {movement.previousStock} -&gt; {movement.currentStock}
              </div>
              <div className="text-xs text-muted-foreground">
                Current product stock {movement.product?.stock}
              </div>
            </div>
          ) : (
            <Text type="secondary">Not recorded</Text>
          ),
      },
      {
        title: "Actor",
        key: "actor",
        width: 180,
        render: (_, movement) => (
          <div>
            <div className="font-medium">
              {movement.createdBy?.name || "System"}
            </div>
            <div className="text-xs text-muted-foreground">
              {movement.createdBy?.role || "Automated"}
            </div>
          </div>
        ),
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
        width: 260,
        render: (note?: string | null) =>
          note ? (
            <Text ellipsis className="block max-w-[240px]">
              {note}
            </Text>
          ) : (
            <Text type="secondary">No note</Text>
          ),
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (value: string) => new Date(value).toLocaleString(),
      },
    ],
    [isProvider],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Title level={2} className="!mb-2">
            Inventory
          </Title>
          <Paragraph className="!mb-0 text-muted-foreground">
            {isProvider
              ? "Control stock movements for your product catalog."
              : "Control marketplace stock movements across providers."}
          </Paragraph>
        </div>

        <Space wrap>
          <Button
            size="large"
            icon={<MinusCircle size={16} />}
            onClick={() => openStockModal("OUT")}
          >
            Stock Out
          </Button>
          <Button
            size="large"
            icon={<SlidersHorizontal size={16} />}
            onClick={() => openStockModal("ADJUST")}
          >
            Adjust
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<PlusCircle size={16} />}
            onClick={() => openStockModal("IN")}
          >
            Stock In
          </Button>
        </Space>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Stock In" value={pageStats.stockIn} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Stock Out" value={pageStats.stockOut} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Adjustments" value={pageStats.adjustments} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Low Stock Products" value={pageStats.lowStockProducts} />
        </Card>
      </div>

      <Card bordered={false} className="shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <TableSearch
                setQuery={setFilters}
                placeholder="Search product, SKU, or note"
              />
            </div>

            {!isProvider ? (
              <Select
                allowClear
                loading={isProvidersLoading}
                placeholder="Provider"
                value={filters.providerId}
                onChange={(value) => setFilterValue("providerId", value)}
                options={providers.map((provider) => ({
                  value: provider.userId,
                  label: `${provider.shopName} (${provider.user?.name || "Provider"})`,
                }))}
              />
            ) : null}

            <Select
              allowClear
              showSearch
              loading={isProductsLoading || isProductsFetching}
              optionFilterProp="label"
              placeholder="Product"
              value={filters.productId}
              onChange={(value) => setFilterValue("productId", value)}
              options={products.map((product) => ({
                value: product.id,
                label: `${product.name}${product.sku ? ` (${product.sku})` : ""}`,
              }))}
            />

            <Select
              allowClear
              placeholder="Movement type"
              value={filters.type}
              onChange={(value) => setFilterValue("type", value)}
              options={[
                { value: "IN", label: "Stock In" },
                { value: "OUT", label: "Stock Out" },
                { value: "ADJUSTMENT", label: "Adjustment" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <RangePicker
              value={dateRange}
              onChange={(value) => {
                setDateRange(value as [Dayjs | null, Dayjs | null] | null);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full xl:w-auto"
            />

            <Space wrap>
              <Button onClick={resetFilters} icon={<RotateCcw size={16} />}>
                Clear
              </Button>
              <RefreshButton
                refetch={refetch}
                isLoading={isMovementsLoading || isMovementsFetching}
              />
            </Space>
          </div>
        </div>
      </Card>

      <Card bordered={false} className="shadow-sm">
        {isMovementsLoading || isMovementsFetching ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spin />
          </div>
        ) : movements.length ? (
          <CustomTable<InventoryMovement>
            columns={columns}
            dataSource={movements}
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
        ) : (
          <Empty
            description="No inventory movements found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      <Modal
        open={isStockModalOpen}
        title="Stock Control"
        onCancel={closeStockModal}
        footer={null}
        destroyOnClose
        width={620}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="pt-2"
        >
          <Segmented
            block
            value={stockMode}
            onChange={handleModeChange}
            options={[
              { label: "Stock In", value: "IN" },
              { label: "Stock Out", value: "OUT" },
              { label: "Adjust", value: "ADJUST" },
            ]}
            className="mb-5"
          />

          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true, message: "Select a product" }]}
          >
            <Select
              showSearch
              loading={isProductsLoading || isProductsFetching}
              optionFilterProp="label"
              placeholder="Select product"
              options={products.map((product) => ({
                value: product.id,
                label: `${product.name}${product.sku ? ` (${product.sku})` : ""} - Stock ${product.stock}`,
              }))}
            />
          </Form.Item>

          {selectedProduct ? (
            <Alert
              type={
                selectedProduct.stock <= selectedProduct.lowStockThreshold
                  ? "warning"
                  : "info"
              }
              showIcon
              className="mb-4"
              message={`${selectedProduct.name} has ${selectedProduct.stock} items in stock`}
              description={`Low stock threshold is ${selectedProduct.lowStockThreshold}. Provider: ${getProviderName(selectedProduct)}.`}
            />
          ) : null}

          {stockMode === "ADJUST" ? (
            <Form.Item
              name="stock"
              label="Actual Stock"
              rules={[
                { required: true, message: "Enter actual stock" },
                { type: "number", min: 0, message: "Stock cannot be negative" },
              ]}
            >
              <InputNumber
                min={0}
                precision={0}
                className="w-full"
                placeholder="Final counted stock"
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                { required: true, message: "Enter quantity" },
                { type: "number", min: 1, message: "Quantity must be at least 1" },
              ]}
            >
              <InputNumber
                min={1}
                precision={0}
                className="w-full"
                placeholder="Movement quantity"
              />
            </Form.Item>
          )}

          <Form.Item name="note" label="Note">
            <Input.TextArea rows={3} placeholder="Reason or reference" />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={closeStockModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              icon={<ClipboardList size={16} />}
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryManagementPage;
