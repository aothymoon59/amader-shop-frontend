/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Popover, Select, Space, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { toast } from "@/components/ui/use-toast";
import {
  useApproveProviderMutation,
  useGetAllProvidersQuery,
  useRejectProviderMutation,
} from "@/redux/features/admin/providerManagementApi";
import CustomTable from "@/components/shared/table/CustomTable";
import TableSearch from "@/components/shared/table/TableSearch";
import ProviderDetailsModal from "@/components/admins/providerManagement/ProviderDetailsModal";
import CreateProviderByAdminModal from "@/components/admins/providerManagement/CreateProviderByAdminModal";
import { MdAdminPanelSettings } from "react-icons/md";

const { Title, Paragraph, Text } = Typography;

type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

type ProviderRecord = {
  id: string;
  userId: string;
  createdById?: string | null;
  shopName: string;
  businessType: string;
  phone: string;
  address: string;
  tradeLicense: string;
  description: string | null;
  status: ProviderStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
};

type ProviderQuery = {
  page: number;
  limit: number;
  search: string;
  status?: ProviderStatus;
};

const AdminProviders = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderRecord | null>(null);
  const [approveProvider] = useApproveProviderMutation();
  const [rejectProvider] = useRejectProviderMutation();

  const [query, setQuery] = useState<ProviderQuery>({
    page: 1,
    limit: 10,
    search: "",
    status: undefined,
  });

  const hasActiveFilters = Boolean(query.search || query.status);

  const { data, isLoading, isFetching } = useGetAllProvidersQuery(query);

  const providers: ProviderRecord[] = data?.data || [];
  const meta = data?.meta;
  const handleStatusChange = (value?: ProviderStatus) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      status: value || undefined,
    }));
  };

  const handleResetFilters = () => {
    setQuery({
      page: 1,
      limit: 10,
      search: "",
      status: undefined,
    });
  };

  const updateStatus = async (providerId: string, status: ProviderStatus) => {
    try {
      if (status === "APPROVED") {
        await approveProvider(providerId).unwrap();
      } else if (status === "REJECTED") {
        await rejectProvider(providerId).unwrap();
      }

      toast({
        title: "Provider updated",
        description: `Provider status changed to ${status}.`,
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error?.data?.errorMessage ||
          error?.data?.message ||
          "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const getStatusTag = (status: ProviderStatus) => {
    if (status === "APPROVED") return <Tag color="success">APPROVED</Tag>;
    if (status === "REJECTED") return <Tag color="error">REJECTED</Tag>;
    return <Tag color="warning">PENDING</Tag>;
  };

  const columns: ColumnsType<ProviderRecord> = [
    {
      title: "Shop",
      key: "shop",
      width: 250,
      render: (_, record) => (
        <Space align="start">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-base shrink-0">
            {record.shopName?.[0] || "S"}{" "}
          </div>
          <div>
            <div className="font-semibold">{record.shopName}</div>
            <Text type="secondary">{record.businessType}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Owner",
      key: "owner",
      width: 220,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.user?.name}</div>
          <Text type="secondary">{record.user?.email}</Text>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: ProviderStatus) => getStatusTag(status),
    },
    {
      title: "Applied At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      align: "right",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-2">
          <Popover content="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedProvider(record);
                setIsViewDetailsModalOpen(true);
              }}
            />
          </Popover>

          {record.status === "PENDING" && (
            <>
              <Popover content="Approve">
                <Button
                  color="green"
                  variant="solid"
                  icon={<CheckCircleOutlined />}
                  onClick={() => updateStatus(record.id, "APPROVED")}
                />
              </Popover>
              <Popover content="Reject">
                <Button
                  danger
                  variant="filled"
                  icon={<CloseCircleOutlined />}
                  onClick={() => updateStatus(record.id, "REJECTED")}
                />
              </Popover>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="w-full space-y-5 lg:space-y-6">
        <Card bordered={false} className="shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <Title level={3} className="!mb-1">
                Provider Management
              </Title>
              <Paragraph className="!mb-0 text-muted-foreground">
                Admin can review provider applications, filter by status, search
                providers, and inspect details from one place.
              </Paragraph>
            </div>

            <div className="w-full lg:w-auto">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setDialogOpen(true)}
                className="w-full lg:w-auto"
              >
                Add Provider
              </Button>
            </div>
          </div>
        </Card>

        <Card bordered={false} className="shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row xl:items-center">
            <div className="w-full">
              <TableSearch
                setQuery={setQuery}
                placeholder="Search providers..."
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:items-center">
              <Select
                allowClear
                className="w-full"
                placeholder="Filter by status"
                value={query.status}
                onChange={handleStatusChange}
                options={[
                  { label: "PENDING", value: "PENDING" },
                  { label: "APPROVED", value: "APPROVED" },
                  { label: "REJECTED", value: "REJECTED" },
                ]}
              />

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
          <div className="overflow-hidden">
            <CustomTable<ProviderRecord>
              loading={isLoading || isFetching}
              columns={columns}
              dataSource={providers}
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
            />
          </div>
        </Card>
      </div>

      <CreateProviderByAdminModal
        isModalOpen={dialogOpen}
        closeModal={() => setDialogOpen(false)}
      />

      <ProviderDetailsModal
        isModalOpen={isViewDetailsModalOpen}
        closeModal={() => setIsViewDetailsModalOpen(false)}
        data={selectedProvider}
      />
    </DashboardLayout>
  );
};

export default AdminProviders;
