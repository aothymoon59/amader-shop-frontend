import { Button, Card, Pagination, Popconfirm, Tag } from "antd";
import { Eye, Pencil, Trash2 } from "lucide-react";

import type { PaginationState } from "@/components/products/productManagement.types";
import type { Product } from "@/redux/features/products/productApi";

type ProductGridViewProps = {
  products: Product[];
  role: "provider" | "admin";
  isDeleting: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (value: PaginationState) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
};

const getProductImage = (product: Product) =>
  product.images?.[0]?.url ||
  "https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image";

const ProductGridView = ({
  products,
  role,
  isDeleting,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: ProductGridViewProps) => {
  if (!products.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.id}
            hoverable
            className="overflow-hidden"
            cover={
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            }
            actions={[
              <Button
                key="view"
                type="text"
                icon={<Eye size={16} />}
                onClick={() => onView(product)}
              >
                View
              </Button>,
              <Button
                key="edit"
                type="text"
                icon={<Pencil size={16} />}
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>,
            ]}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="line-clamp-1 text-base font-semibold">
                  {product.name}
                </div>
                <div className="line-clamp-2 text-sm text-muted-foreground">
                  {product.shortDescription ||
                    product.description ||
                    "No description added yet."}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Tag color={product.isPublished ? "green" : "gold"}>
                  {product.isPublished ? "Published" : "Draft"}
                </Tag>
                {product.isFeatured ? <Tag color="blue">Featured</Tag> : null}
                {product.discountType && (product.discountValue || 0) > 0 ? (
                  <Tag color="purple">Discounted</Tag>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Price</div>
                  <div className="font-semibold">${product.price.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Stock</div>
                  <div className="font-semibold">{product.stock}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Category</div>
                  <div className="line-clamp-1 font-medium">
                    {product.category.name}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {role === "admin" ? (
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <div className="text-muted-foreground">Provider</div>
                  <div className="font-medium">
                    {product.provider.providerProfile?.shopName ||
                      product.provider.name}
                  </div>
                </div>
              ) : null}

              <Popconfirm
                title="Archive this product?"
                description="This product will be hidden from active lists."
                onConfirm={() => onDelete(product.id)}
                okText="Archive"
                okButtonProps={{ danger: true, loading: isDeleting }}
              >
                <Button danger block icon={<Trash2 size={16} />}>
                  Archive Product
                </Button>
              </Popconfirm>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={(page, nextPageSize) =>
            onPageChange({
              page,
              limit: nextPageSize,
            })
          }
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          responsive
        />
      </div>
    </div>
  );
};

export default ProductGridView;
