import { Card, Drawer, Empty, Image, Space, Tag, Typography } from "antd";

import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import type { Product } from "@/redux/features/products/productApi";
import { formatCurrencyAmount } from "@/utils/currency";

const { Text } = Typography;

type ProductDetailsDrawerProps = {
  product: Product | null;
  onClose: () => void;
};

const ProductDetailsDrawer = ({
  product,
  onClose,
}: ProductDetailsDrawerProps) => {
  const { currency = defaultSystemCurrency } = useSystemCurrency();

  return (
    <Drawer
      open={Boolean(product)}
      onClose={onClose}
      title={product?.name || "Product Details"}
      width={720}
    >
      {product ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Card size="small">
              <Text type="secondary">Category</Text>
              <p className="mt-1 font-medium">{product.category.name}</p>
            </Card>
            <Card size="small">
              <Text type="secondary">Provider</Text>
              <p className="mt-1 font-medium">
                {product.provider.providerProfile?.shopName ||
                  product.provider.name}
              </p>
            </Card>
            <Card size="small">
              <Text type="secondary">Price</Text>
              <p className="mt-1 font-medium">{formatCurrencyAmount(product.price, currency)}</p>
            </Card>
            <Card size="small">
              <Text type="secondary">Cost Price</Text>
              <p className="mt-1 font-medium">
                {product.costPrice ? formatCurrencyAmount(product.costPrice, currency) : "Not set"}
              </p>
            </Card>
            <Card size="small">
              <Text type="secondary">Stock</Text>
              <p className="mt-1 font-medium">{product.stock} units</p>
            </Card>
            <Card size="small">
              <Text type="secondary">Low Stock Threshold</Text>
              <p className="mt-1 font-medium">{product.lowStockThreshold}</p>
            </Card>
          </div>

          <Card size="small" title="Status">
            <Space wrap>
              <Tag color={product.isPublished ? "green" : "gold"}>
                {product.isPublished ? "Published" : "Draft"}
              </Tag>
              {product.isFeatured ? <Tag color="blue">Featured</Tag> : null}
              {product.discountType ? (
                <Tag color="purple">
                  {product.discountType === "PERCENTAGE"
                    ? `${product.discountValue || 0}% off`
                    : `${formatCurrencyAmount(Number(product.discountValue || 0), currency)} off`}
                </Tag>
              ) : null}
            </Space>
          </Card>

          <Card size="small" title="Descriptions">
            <div className="space-y-3">
              <div>
                <Text type="secondary">Short Description</Text>
                <p className="mt-1">{product.shortDescription || "Not provided"}</p>
              </div>
              <div>
                <Text type="secondary">Description</Text>
                <p className="mt-1">{product.description || "Not provided"}</p>
              </div>
            </div>
          </Card>

          <Card size="small" title="Identifiers">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Text type="secondary">SKU</Text>
                <p className="mt-1">{product.sku || "Not provided"}</p>
              </div>
              <div>
                <Text type="secondary">Barcode</Text>
                <p className="mt-1">{product.barcode || "Not provided"}</p>
              </div>
              <div>
                <Text type="secondary">Slug</Text>
                <p className="mt-1 break-all">{product.slug}</p>
              </div>
            </div>
          </Card>

          <Card size="small" title="Images">
            {product.images?.length ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {product.images.map((image) => (
                  <Image
                    key={image.id}
                    src={image.url}
                    alt={product.name}
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
  );
};

export default ProductDetailsDrawer;
