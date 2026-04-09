import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Typography,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { useGetAllProvidersQuery } from "@/redux/features/admin/providerManagementApi";
import { useGetCategoriesQuery } from "@/redux/features/generalApi/categoriesApi";
import {
  type Product,
  type ProductImage,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetManagedProductsQuery,
  useUpdateProductMutation,
} from "@/redux/features/products/productApi";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

type ProductManagementPageProps = {
  role: "provider" | "admin";
};

type CategoryOption = {
  id: string;
  name: string;
};

type ProviderOption = {
  id: string;
  userId: string;
  shopName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isActive: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type ProductFormValues = {
  providerId?: string;
  categoryId: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  costPrice?: number;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  stock: number;
  lowStockThreshold?: number;
  sku?: string;
  barcode?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  images?: UploadFile[];
};

const normalizeUploadValue = (
  event: { fileList?: UploadFile[] } | UploadFile[],
) => {
  if (Array.isArray(event)) {
    return event;
  }

  return event?.fileList || [];
};

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null
  ) {
    const data = error.data as {
      errorMessage?: string;
      message?: string;
    };

    return data.errorMessage || data.message;
  }

  return undefined;
};

const ProductManagementPage = ({ role }: ProductManagementPageProps) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedProvider, setSelectedProvider] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [retainedImages, setRetainedImages] = useState<ProductImage[]>([]);
  const [form] = Form.useForm<ProductFormValues>();

  const { data: categoryResponse, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery(undefined);
  const { data: providerResponse, isLoading: isProvidersLoading } =
    useGetAllProvidersQuery(
      role === "admin" ? { paginate: false, status: "APPROVED" } : undefined,
      { skip: role !== "admin" },
    );
  const {
    data: productResponse,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
  } = useGetManagedProductsQuery({
    search: search || undefined,
    categoryId: selectedCategory || undefined,
    providerId: role === "admin" ? selectedProvider || undefined : undefined,
    paginate: false,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const categoryOptions = useMemo<CategoryOption[]>(
    () => (categoryResponse?.data ?? []) as CategoryOption[],
    [categoryResponse],
  );

  const providerOptions = useMemo<ProviderOption[]>(
    () => (providerResponse?.data ?? []) as ProviderOption[],
    [providerResponse],
  );

  const products = useMemo<Product[]>(
    () => productResponse?.data ?? [],
    [productResponse],
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setRetainedImages([]);
    form.resetFields();
    form.setFieldsValue({
      isPublished: false,
      isFeatured: false,
      discountValue: 0,
      lowStockThreshold: 5,
      stock: 0,
      images: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setRetainedImages(product.images ?? []);
    form.setFieldsValue({
      providerId: product.providerId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      price: product.price,
      costPrice: product.costPrice || undefined,
      discountType: product.discountType || undefined,
      discountValue: product.discountValue || 0,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      sku: product.sku || "",
      barcode: product.barcode || "",
      isPublished: product.isPublished,
      isFeatured: product.isFeatured,
      images: [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setRetainedImages([]);
    form.resetFields();
  };

  const handleRemoveRetainedImage = (imageId: string) => {
    setRetainedImages((current) => current.filter((image) => image.id !== imageId));
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const payload = new FormData();

      if (role === "admin" && values.providerId) {
        payload.append("providerId", values.providerId);
      }

      payload.append("categoryId", values.categoryId);
      payload.append("name", values.name.trim());
      payload.append("price", String(values.price));
      payload.append("stock", String(values.stock));

      if (values.description?.trim()) {
        payload.append("description", values.description.trim());
      }
      if (values.shortDescription?.trim()) {
        payload.append("shortDescription", values.shortDescription.trim());
      }
      if (values.costPrice !== undefined && values.costPrice !== null) {
        payload.append("costPrice", String(values.costPrice));
      }
      if (values.discountType) {
        payload.append("discountType", values.discountType);
      }
      if (values.discountValue !== undefined && values.discountValue !== null) {
        payload.append("discountValue", String(values.discountValue));
      }
      if (
        values.lowStockThreshold !== undefined &&
        values.lowStockThreshold !== null
      ) {
        payload.append("lowStockThreshold", String(values.lowStockThreshold));
      }
      if (values.sku?.trim()) {
        payload.append("sku", values.sku.trim());
      }
      if (values.barcode?.trim()) {
        payload.append("barcode", values.barcode.trim());
      }
      payload.append("isPublished", String(Boolean(values.isPublished)));
      payload.append("isFeatured", String(Boolean(values.isFeatured)));

      if (editingProduct) {
        if (!retainedImages.length) {
          payload.append("clearImages", "true");
        } else {
          retainedImages.forEach((image) => {
            payload.append("retainImageIds", image.id);
          });
        }
      }

      values.images?.forEach((file) => {
        if (file.originFileObj) {
          payload.append("images", file.originFileObj);
        }
      });

      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          payload,
        }).unwrap();
        toast({
          title: "Product updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        await createProduct(payload).unwrap();
        toast({
          title: "Product created",
          description: `${values.name} has been created successfully.`,
        });
      }

      closeModal();
    } catch (error: unknown) {
      toast({
        title: editingProduct ? "Product update failed" : "Product creation failed",
        description:
          getErrorMessage(error) ||
          "Something went wrong while saving the product.",
        variant: "destructive",
      });
    }
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

  const columns = useMemo<ColumnsType<Product>>(
    () => [
      {
        title: "Product",
        key: "product",
        render: (_, product) => (
          <div className="min-w-[220px]">
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-muted-foreground">
              {product.sku || product.slug}
            </div>
          </div>
        ),
      },
      {
        title: "Category",
        dataIndex: ["category", "name"],
        key: "category",
      },
      ...(role === "admin"
        ? [
            {
              title: "Provider",
              key: "provider",
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
        render: (_, product) => (
          <div>
            <div className="font-medium">${product.price.toFixed(2)}</div>
            {product.costPrice ? (
              <div className="text-xs text-muted-foreground">
                Cost ${product.costPrice.toFixed(2)}
              </div>
            ) : null}
          </div>
        ),
      },
      {
        title: "Stock",
        key: "stock",
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
        render: (_, product) => (
          <Space wrap>
            <Tag color={product.isPublished ? "green" : "gold"}>
              {product.isPublished ? "Published" : "Draft"}
            </Tag>
            {product.isFeatured ? <Tag color="blue">Featured</Tag> : null}
          </Space>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, product) => (
          <Space>
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => setDetailsProduct(product)}
            />
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
          </Space>
        ),
      },
    ],
    [isDeleting, role],
  );

  const isSaving = isCreating || isUpdating;

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

        <Button type="primary" size="large" icon={<Plus size={16} />} onClick={openCreateModal}>
          Add Product
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12} xl={role === "admin" ? 8 : 12}>
            <Input
              size="large"
              prefix={<Search size={16} className="text-muted-foreground" />}
              placeholder="Search by name, SKU, barcode, category, or provider"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Col>

          <Col xs={24} md={12} xl={role === "admin" ? 8 : 12}>
            <Select
              size="large"
              allowClear
              loading={isCategoriesLoading}
              placeholder="Filter by category"
              className="w-full"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              options={categoryOptions.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          </Col>

          {role === "admin" ? (
            <Col xs={24} md={12} xl={8}>
              <Select
                size="large"
                allowClear
                loading={isProvidersLoading}
                placeholder="Filter by provider"
                className="w-full"
                value={selectedProvider}
                onChange={(value) => setSelectedProvider(value)}
                options={providerOptions.map((provider) => ({
                  value: provider.userId,
                  label: `${provider.shopName} (${provider.user.name})`,
                }))}
              />
            </Col>
          ) : null}
        </Row>
      </Card>

      <Card bordered={false} className="shadow-sm">
        {isProductsLoading || isProductsFetching ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spin />
          </div>
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={products}
            scroll={{ x: 1100 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
            locale={{
              emptyText: (
                <Empty
                  description="No products found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        )}
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={editingProduct ? "Update Product" : "Create Product"}
        confirmLoading={isSaving}
        width={960}
        destroyOnClose
        title={editingProduct ? "Edit Product" : "Create Product"}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isPublished: false,
            isFeatured: false,
            discountValue: 0,
            lowStockThreshold: 5,
            stock: 0,
            images: [],
          }}
        >
          <Row gutter={16}>
            {role === "admin" ? (
              <Col xs={24} md={12}>
                <Form.Item
                  label="Provider"
                  name="providerId"
                  rules={[{ required: true, message: "Please select a provider" }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="Select provider"
                    options={providerOptions.map((provider) => ({
                      value: provider.userId,
                      label: `${provider.shopName} (${provider.user.name})`,
                    }))}
                  />
                </Form.Item>
              </Col>
            ) : null}

            <Col xs={24} md={role === "admin" ? 12 : 12}>
              <Form.Item
                label="Category"
                name="categoryId"
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="Select category"
                  options={categoryOptions.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Product Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter product name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
              >
                <Input placeholder="Wireless Headphones Pro" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="SKU" name="sku">
                <Input placeholder="SKU-1001" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Short Description" name="shortDescription">
                <Input placeholder="A short summary for cards and lists" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Description" name="description">
                <TextArea
                  rows={4}
                  placeholder="Detailed product description"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please enter selling price" }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  className="w-full"
                  placeholder="499.00"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Cost Price" name="costPrice">
                <InputNumber
                  min={0}
                  step={0.01}
                  className="w-full"
                  placeholder="350.00"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Barcode" name="barcode">
                <Input placeholder="1234567890123" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Discount Type" name="discountType">
                <Select
                  allowClear
                  placeholder="No discount"
                  options={[
                    { value: "PERCENTAGE", label: "Percentage" },
                    { value: "FIXED", label: "Fixed Amount" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Discount Value" name="discountValue">
                <InputNumber
                  min={0}
                  step={0.01}
                  className="w-full"
                  placeholder="0"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Initial / Current Stock"
                name="stock"
                rules={[{ required: true, message: "Please enter stock amount" }]}
              >
                <InputNumber min={0} step={1} className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Low Stock Threshold" name="lowStockThreshold">
                <InputNumber min={0} step={1} className="w-full" />
              </Form.Item>
            </Col>

            <Col xs={12} md={6}>
              <Form.Item
                label="Published"
                name="isPublished"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col xs={12} md={6}>
              <Form.Item
                label="Featured"
                name="isFeatured"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>

            {editingProduct && retainedImages.length ? (
              <Col xs={24}>
                <Form.Item label="Current Images">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {retainedImages.map((image) => (
                      <div
                        key={image.id}
                        className="rounded-xl border border-border/80 p-2"
                      >
                        <Image
                          src={image.url}
                          alt="Product"
                          className="rounded-lg object-cover"
                          height={120}
                          width="100%"
                        />
                        <Button
                          danger
                          type="text"
                          className="mt-2 w-full"
                          onClick={() => handleRemoveRetainedImage(image.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Col>
            ) : null}

            <Col xs={24}>
              <Form.Item
                label="Upload Images"
                name="images"
                valuePropName="fileList"
                getValueFromEvent={normalizeUploadValue}
                extra="You can upload up to 6 product images."
              >
                <Upload
                  beforeUpload={() => false}
                  listType="picture-card"
                  maxCount={6}
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                >
                  <div>
                    <Plus size={18} />
                    <div className="mt-2">Add Image</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Drawer
        open={Boolean(detailsProduct)}
        onClose={() => setDetailsProduct(null)}
        title={detailsProduct?.name || "Product Details"}
        width={720}
      >
        {detailsProduct ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Card size="small">
                <Text type="secondary">Category</Text>
                <p className="mt-1 font-medium">{detailsProduct.category.name}</p>
              </Card>
              <Card size="small">
                <Text type="secondary">Provider</Text>
                <p className="mt-1 font-medium">
                  {detailsProduct.provider.providerProfile?.shopName ||
                    detailsProduct.provider.name}
                </p>
              </Card>
              <Card size="small">
                <Text type="secondary">Price</Text>
                <p className="mt-1 font-medium">${detailsProduct.price.toFixed(2)}</p>
              </Card>
              <Card size="small">
                <Text type="secondary">Cost Price</Text>
                <p className="mt-1 font-medium">
                  {detailsProduct.costPrice
                    ? `$${detailsProduct.costPrice.toFixed(2)}`
                    : "Not set"}
                </p>
              </Card>
              <Card size="small">
                <Text type="secondary">Stock</Text>
                <p className="mt-1 font-medium">
                  {detailsProduct.stock} units
                </p>
              </Card>
              <Card size="small">
                <Text type="secondary">Low Stock Threshold</Text>
                <p className="mt-1 font-medium">
                  {detailsProduct.lowStockThreshold}
                </p>
              </Card>
            </div>

            <Card size="small" title="Status">
              <Space wrap>
                <Tag color={detailsProduct.isPublished ? "green" : "gold"}>
                  {detailsProduct.isPublished ? "Published" : "Draft"}
                </Tag>
                {detailsProduct.isFeatured ? <Tag color="blue">Featured</Tag> : null}
                {detailsProduct.discountType ? (
                  <Tag color="purple">
                    {detailsProduct.discountType === "PERCENTAGE"
                      ? `${detailsProduct.discountValue || 0}% off`
                      : `$${detailsProduct.discountValue || 0} off`}
                  </Tag>
                ) : null}
              </Space>
            </Card>

            <Card size="small" title="Descriptions">
              <div className="space-y-3">
                <div>
                  <Text type="secondary">Short Description</Text>
                  <p className="mt-1">
                    {detailsProduct.shortDescription || "Not provided"}
                  </p>
                </div>
                <div>
                  <Text type="secondary">Description</Text>
                  <p className="mt-1">{detailsProduct.description || "Not provided"}</p>
                </div>
              </div>
            </Card>

            <Card size="small" title="Identifiers">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Text type="secondary">SKU</Text>
                  <p className="mt-1">{detailsProduct.sku || "Not provided"}</p>
                </div>
                <div>
                  <Text type="secondary">Barcode</Text>
                  <p className="mt-1">{detailsProduct.barcode || "Not provided"}</p>
                </div>
                <div>
                  <Text type="secondary">Slug</Text>
                  <p className="mt-1 break-all">{detailsProduct.slug}</p>
                </div>
              </div>
            </Card>

            <Card size="small" title="Images">
              {detailsProduct.images?.length ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {detailsProduct.images.map((image) => (
                    <Image
                      key={image.id}
                      src={image.url}
                      alt={detailsProduct.name}
                      className="rounded-lg object-cover"
                      height={140}
                      width="100%"
                    />
                  ))}
                </div>
              ) : (
                <Empty
                  description="No images uploaded"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
};

export default ProductManagementPage;
