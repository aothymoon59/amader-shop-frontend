import { Button as AntButton, Drawer, Select } from "antd";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CategoryOption = {
  id: string;
  name: string;
};

type MarketplaceProductFiltersProps = {
  categories: CategoryOption[];
  search: string;
  selectedCategoryId?: string;
  isFeatured?: boolean;
  isDiscount?: boolean;
  priceSort?: "low-to-high" | "high-to-low";
  dateSort: "new-to-old" | "old-to-new";
  limit: number;
  pageSizeOptions: string[];
  isOpen: boolean;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value?: string) => void;
  onFeaturedChange: (value?: boolean) => void;
  onDiscountChange: (value?: boolean) => void;
  onPriceSortChange: (value?: "low-to-high" | "high-to-low") => void;
  onDateSortChange: (value: "new-to-old" | "old-to-new") => void;
  onPageSizeChange: (value: string) => void;
  onReset: () => void;
  onOpen: () => void;
  onClose: () => void;
};

const MarketplaceProductFilters = ({
  categories,
  search,
  selectedCategoryId,
  isFeatured,
  isDiscount,
  priceSort,
  dateSort,
  limit,
  pageSizeOptions,
  isOpen,
  hasActiveFilters,
  onSearchChange,
  onCategoryChange,
  onFeaturedChange,
  onDiscountChange,
  onPriceSortChange,
  onDateSortChange,
  onPageSizeChange,
  onReset,
  onOpen,
  onClose,
}: MarketplaceProductFiltersProps) => {
  return (
    <>
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-end">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={String(limit)}
            onChange={onPageSizeChange}
            options={pageSizeOptions.map((value) => ({
              label: `${value} / page`,
              value,
            }))}
            className="min-w-[120px]"
          />
          <AntButton
            icon={<SlidersHorizontal className="h-4 w-4" />}
            onClick={onOpen}
          >
            Filters
          </AntButton>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-4"
          />
        </div>
        <Select
          allowClear
          placeholder="All categories"
          value={selectedCategoryId}
          onChange={onCategoryChange}
          className="w-full lg:w-[240px]"
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
        />
        {hasActiveFilters ? (
          <Button variant="outline" onClick={onReset}>
            Reset Filters
          </Button>
        ) : null}
      </div>

      <Drawer
        title="Filter Products"
        width={360}
        open={isOpen}
        onClose={onClose}
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Featured</p>
            <Select
              allowClear
              className="w-full"
              placeholder="All products"
              value={isFeatured}
              onChange={onFeaturedChange}
              options={[
                { label: "Featured only", value: true },
                { label: "Non-featured only", value: false },
              ]}
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Discount</p>
            <Select
              allowClear
              className="w-full"
              placeholder="All products"
              value={isDiscount}
              onChange={onDiscountChange}
              options={[
                { label: "Discounted only", value: true },
                { label: "Without discount", value: false },
              ]}
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Price Sort</p>
            <Select
              allowClear
              className="w-full"
              placeholder="Default"
              value={priceSort}
              onChange={onPriceSortChange}
              options={[
                { label: "Low to High", value: "low-to-high" },
                { label: "High to Low", value: "high-to-low" },
              ]}
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Date Sort</p>
            <Select
              className="w-full"
              value={dateSort}
              onChange={onDateSortChange}
              options={[
                { label: "Newest First", value: "new-to-old" },
                { label: "Oldest First", value: "old-to-new" },
              ]}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <AntButton block onClick={onReset}>
              Reset
            </AntButton>
            <AntButton type="primary" block onClick={onClose}>
              Show Products
            </AntButton>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MarketplaceProductFilters;
