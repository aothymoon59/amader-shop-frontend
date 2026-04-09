import { Button, Drawer, Select, Typography } from "antd";

import type {
  FilterState,
} from "@/components/products/productManagement.types";

const { Text } = Typography;

type ProductFiltersDrawerProps = {
  open: boolean;
  filters: FilterState;
  onClose: () => void;
  onReset: () => void;
  onChange: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void;
};

const ProductFiltersDrawer = ({
  open,
  filters,
  onClose,
  onReset,
  onChange,
}: ProductFiltersDrawerProps) => {
  return (
    <Drawer title="Filter Products" width={360} open={open} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <Text className="mb-2 block text-sm text-muted-foreground">
            Publish Status
          </Text>
          <Select
            allowClear
            className="w-full"
            placeholder="All statuses"
            value={filters.status}
            onChange={(value) => onChange("status", value)}
            options={[
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
            ]}
          />
        </div>

        <div>
          <Text className="mb-2 block text-sm text-muted-foreground">
            Featured
          </Text>
          <Select
            allowClear
            className="w-full"
            placeholder="All products"
            value={filters.isFeatured}
            onChange={(value) => onChange("isFeatured", value)}
            options={[
              { label: "Featured only", value: true },
              { label: "Non-featured only", value: false },
            ]}
          />
        </div>

        <div>
          <Text className="mb-2 block text-sm text-muted-foreground">
            Discount
          </Text>
          <Select
            allowClear
            className="w-full"
            placeholder="All products"
            value={filters.isDiscount}
            onChange={(value) => onChange("isDiscount", value)}
            options={[
              { label: "Discounted only", value: true },
              { label: "Without discount", value: false },
            ]}
          />
        </div>

        <div>
          <Text className="mb-2 block text-sm text-muted-foreground">
            Price Sort
          </Text>
          <Select
            allowClear
            className="w-full"
            placeholder="Default"
            value={filters.priceSort}
            onChange={(value) => onChange("priceSort", value)}
            options={[
              { label: "Low to High", value: "low-to-high" },
              { label: "High to Low", value: "high-to-low" },
            ]}
          />
        </div>

        <div>
          <Text className="mb-2 block text-sm text-muted-foreground">
            Date Sort
          </Text>
          <Select
            className="w-full"
            value={filters.dateSort}
            onChange={(value) => onChange("dateSort", value)}
            options={[
              { label: "Newest First", value: "new-to-old" },
              { label: "Oldest First", value: "old-to-new" },
            ]}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button block onClick={onReset}>
            Reset
          </Button>
          <Button type="primary" block onClick={onClose}>
            Show Products
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default ProductFiltersDrawer;
