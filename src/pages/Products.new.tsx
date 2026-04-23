import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Empty, Pagination, Skeleton } from "antd";


import MarketplaceProductCard from "@/components/products/MarketplaceProductCard";
import MarketplaceProductFilters from "@/components/products/MarketplaceProductFilters";
import { useGetCategoriesQuery } from "@/redux/features/generalApi/categoriesApi";
import { useGetAllProductsQuery } from "@/redux/features/products/productApi";

type CategoryOption = {
  id: string;
  name: string;
};

const PAGE_SIZE_OPTIONS = ["8", "10", "12", "16", "24"];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId") || undefined;
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(
    categoryIdFromUrl,
  );
  const [isFeatured, setIsFeatured] = useState<boolean | undefined>(undefined);
  const [isDiscount, setIsDiscount] = useState<boolean | undefined>(undefined);
  const [priceSort, setPriceSort] = useState<
    "low-to-high" | "high-to-low" | undefined
  >(undefined);
  const [dateSort, setDateSort] = useState<"new-to-old" | "old-to-new">(
    "new-to-old",
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { data: categoriesResponse } = useGetCategoriesQuery(undefined);
  const categories = useMemo<CategoryOption[]>(
    () => (categoriesResponse?.data ?? []) as CategoryOption[],
    [categoriesResponse],
  );

  useEffect(() => {
    setSelectedCategoryId(categoryIdFromUrl);
    setPage(1);
  }, [categoryIdFromUrl]);

  const {
    data: productsResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetAllProductsQuery({
    search: search || undefined,
    categoryId: selectedCategoryId || undefined,
    isFeatured,
    isDiscount,
    priceSort,
    dateSort,
    page,
    limit,
  });

  const products = productsResponse?.data ?? [];
  const meta = productsResponse?.meta;

  const hasActiveFilters = Boolean(
    search ||
    selectedCategoryId ||
    isFeatured !== undefined ||
    isDiscount !== undefined ||
    priceSort,
  );

  const resetFilters = () => {
    setSearch("");
    setSelectedCategoryId(undefined);
    setIsFeatured(undefined);
    setIsDiscount(undefined);
    setPriceSort(undefined);
    setDateSort("new-to-old");
    setPage(1);
    setLimit(8);
    setSearchParams({});
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value?: string) => {
    setSelectedCategoryId(value);
    setPage(1);

    if (value) {
      setSearchParams({ categoryId: value });
      return;
    }

    setSearchParams({});
  };

  const handlePageSizeChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  return (
    
      <div className="container py-8 lg:py-12">
        <MarketplaceProductFilters
          categories={categories}
          search={search}
          selectedCategoryId={selectedCategoryId}
          isFeatured={isFeatured}
          isDiscount={isDiscount}
          priceSort={priceSort}
          dateSort={dateSort}
          limit={limit}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          isOpen={isFilterDrawerOpen}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onFeaturedChange={(value) => {
            setIsFeatured(value);
            setPage(1);
          }}
          onDiscountChange={(value) => {
            setIsDiscount(value);
            setPage(1);
          }}
          onPriceSortChange={(value) => {
            setPriceSort(value);
            setPage(1);
          }}
          onDateSortChange={(value) => {
            setDateSort(value);
            setPage(1);
          }}
          onPageSizeChange={handlePageSizeChange}
          onReset={resetFilters}
          onOpen={() => setIsFilterDrawerOpen(true)}
          onClose={() => setIsFilterDrawerOpen(false)}
        />

        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>
            Showing {products.length} of {meta?.total ?? 0} products
          </span>
          {isFetching && !isLoading ? <span>Updating results...</span> : null}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: limit }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border bg-card p-4"
              >
                <Skeleton.Image active className="!h-44 !w-full" />
                <Skeleton active paragraph={{ rows: 3 }} className="mt-4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
            <p className="font-semibold text-destructive">
              Failed to load products.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please check the API connection and try again.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border bg-card px-6 py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No products matched your current filters."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <MarketplaceProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {(meta?.totalPages || 0) > 1 ? (
          <div className="mt-12 flex justify-center border-t pt-8">
            <Pagination
              current={meta?.page || page}
              pageSize={meta?.limit || limit}
              total={meta?.total || 0}
              showSizeChanger={false}
              onChange={(nextPage) => setPage(nextPage)}
            />
          </div>
        ) : null}
      </div>
    
  );
};

export default Products;
