import { useMemo, useState } from "react";
import { Button, Card, Space, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import RefreshButton from "@/components/shared/button/RefreshButton";
import CustomTable from "@/components/shared/table/CustomTable";
import TableSearch from "@/components/shared/table/TableSearch";
import {
  type UserRecord,
  useGetUsersQuery,
} from "@/redux/features/auth/usersApi";

const { Title, Paragraph, Text } = Typography;

type CustomerQuery = {
  page: number;
  limit: number;
  search: string;
};

const AdminCustomers = () => {
  const [query, setQuery] = useState<CustomerQuery>({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading, isFetching, refetch } = useGetUsersQuery({
    role: "CUSTOMER",
    search: query.search || undefined,
    page: query.page,
    limit: query.limit,
    paginate: true,
  });

  const customers = useMemo<UserRecord[]>(() => data?.data ?? [], [data]);
  const meta = data?.meta;
  const hasActiveFilters = Boolean(query.search);

  const handleResetFilters = () => {
    setQuery({
      page: 1,
      limit: 10,
      search: "",
    });
  };

  const columns: ColumnsType<UserRecord> = [
    {
      title: "Customer",
      key: "customer",
      width: 280,
      render: (_, record) => (
        <Space align="start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary font-semibold text-base text-primary-foreground">
            {record.name?.charAt(0)?.toUpperCase() || "C"}
          </div>
          <div className="min-w-0">
            <div className="font-semibold">{record.name || "Unnamed customer"}</div>
            <Text type="secondary" className="break-all">
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Contact",
      dataIndex: "personalContact",
      key: "personalContact",
      width: 170,
      render: (value: string | null) => value || "Not provided",
    },
    {
      title: "Address",
      dataIndex: "personalAddress",
      key: "personalAddress",
      width: 240,
      ellipsis: true,
      render: (value: string | null) => value || "Not provided",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">ACTIVE</Tag>
        ) : (
          <Tag color="red">INACTIVE</Tag>
        ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (value: string) => dayjs(value).format("MMM D, YYYY"),
    },
  ];

  return (
    
      <div className="w-full space-y-5 lg:space-y-6">
        <Card bordered={false} className="shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <Title level={3} className="!mb-1">
                Customer Management
              </Title>
              <Paragraph className="!mb-0 text-muted-foreground">
                Browse customer accounts from the `/users` API. Provider profile
                details are intentionally excluded here.
              </Paragraph>
            </div>
          </div>
        </Card>

        <Card bordered={false} className="shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row xl:items-center">
            <div className="w-full">
              <TableSearch
                setQuery={setQuery}
                placeholder="Search customers..."
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:items-center">
              <div className="rounded-xl border bg-muted/20 px-4 py-2.5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total
                </div>
                <div className="font-semibold">{meta?.total ?? 0}</div>
              </div>

              {hasActiveFilters && (
                <Button
                  onClick={handleResetFilters}
                  className="w-full xl:w-auto"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card bordered={false} className="shadow-sm">
          <div className="mb-3 flex items-center justify-end gap-2">
            <RefreshButton
              refetch={refetch}
              isLoading={isLoading || isFetching}
            />
          </div>

          <div className="overflow-hidden">
            <CustomTable<UserRecord>
              loading={isLoading || isFetching}
              columns={columns}
              dataSource={customers}
              rowKey="id"
              currentPage={meta?.page || query.page}
              pageSize={meta?.limit || query.limit}
              totaldata={meta?.total || 0}
              setPagination={(updater) => {
                setQuery((prev) => {
                  const next =
                    typeof updater === "function"
                      ? updater({
                          page: prev.page,
                          per_page: prev.limit,
                        })
                      : updater;

                  return {
                    ...prev,
                    page: next.page,
                    limit: next.per_page,
                  };
                });
              }}
              isPagination
              locale={{
                emptyText: (
                  <div className="py-6 text-sm text-muted-foreground">
                    No customers found for the current filter.
                  </div>
                ),
              }}
            />
          </div>
        </Card>
      </div>
    
  );
};

export default AdminCustomers;
