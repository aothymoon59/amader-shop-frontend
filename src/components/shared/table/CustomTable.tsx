import { Pagination, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { PaginationProps } from "antd";
import type { ReactNode } from "react";

type PaginationState = {
  page: number;
  per_page: number;
};

type SetPagination =
  | React.Dispatch<React.SetStateAction<PaginationState>>
  | ((value: React.SetStateAction<PaginationState>) => void);

type CustomTableProps<T extends object> = {
  loading?: boolean;
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: string | ((record: T) => string);
  isPagination?: boolean;
  setPagination?: SetPagination;
  totaldata?: number;
  currentPage?: number;
  pageSize?: number;
} & Omit<
  TableProps<T>,
  "columns" | "dataSource" | "rowKey" | "pagination" | "loading"
>;

const CustomTable = <T extends object>({
  loading = false,
  columns,
  dataSource,
  rowKey,
  isPagination = true,
  setPagination,
  totaldata = 0,
  currentPage = 1,
  pageSize = 10,
  ...props
}: CustomTableProps<T>) => {
  const getSerialNumber = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  const onPageChange: PaginationProps["onChange"] = (page, limit) => {
    if (setPagination) {
      setPagination((prev) => ({
        ...prev,
        page,
        per_page: limit,
      }));
    }
  };

  const updatedColumns: ColumnsType<T> = [
    {
      title: "SL",
      key: "id",
      render: (_: unknown, __: T, index: number): ReactNode =>
        getSerialNumber(index),
      width: 60,
    },
    ...columns,
  ];

  return (
    <div>
      <div className="custom-tableslider">
        <Table<T>
          columns={updatedColumns}
          dataSource={dataSource}
          rowKey={rowKey}
          pagination={false}
          loading={loading}
          expandable={{ rowExpandable: () => false }}
          {...props}
          scroll={{ x: "max-content" }}
        />
      </div>

      <div className="flex justify-end items-center py-2">
        {isPagination && (
          <Pagination
            current={currentPage}
            total={totaldata}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
            responsive
          />
        )}
      </div>
    </div>
  );
};

export default CustomTable;
