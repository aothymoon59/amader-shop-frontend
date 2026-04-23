/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  EditOutlined,
  EyeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Card, Select, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import AdminDetailsModal from "@/components/admins/adminManagement/AdminDetailsModal";
import CreateAdminModal from "@/components/admins/adminManagement/CreateAdminModal";
import EditAdminModal from "@/components/admins/adminManagement/EditAdminModal";
import RefreshButton from "@/components/shared/button/RefreshButton";
import CustomTable from "@/components/shared/table/CustomTable";
import TableActionMenu from "@/components/shared/table/TableActionMenu";
import TableSearch from "@/components/shared/table/TableSearch";
import { toast } from "@/hooks/use-toast";
import {
  type AdminRecord,
  useArchiveAdminMutation,
  useGetAdminsQuery,
  useRestoreAdminMutation,
  useUpdateAdminActiveMutation,
} from "@/redux/features/admin/adminManagementApi";

const { Title, Paragraph, Text } = Typography;

type AdminQuery = {
  page: number;
  limit: number;
  search: string;
  archived?: "true" | "false";
  isActive?: "true" | "false";
};

const SuperAdminAdmins = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRecord | null>(null);
  const [query, setQuery] = useState<AdminQuery>({
    page: 1,
    limit: 10,
    search: "",
    archived: "false",
    isActive: undefined,
  });

  const { data, isLoading, isFetching, refetch } = useGetAdminsQuery({
    search: query.search,
    archived: query.archived === "true",
    isActive:
      query.isActive === undefined ? undefined : query.isActive === "true",
    page: query.page,
    limit: query.limit,
  });
  const [updateAdminActive, { isLoading: isTogglingActive }] =
    useUpdateAdminActiveMutation();
  const [archiveAdmin, { isLoading: isArchiving }] = useArchiveAdminMutation();
  const [restoreAdmin, { isLoading: isRestoring }] = useRestoreAdminMutation();

  const admins = data?.data || [];
  const meta = data?.meta;
  const isMutating = isTogglingActive || isArchiving || isRestoring;
  const hasActiveFilters = Boolean(
    query.search || query.archived !== "false" || query.isActive,
  );

  const handleArchivedChange = (value?: "true" | "false") => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      archived: value || "false",
    }));
  };

  const handleAccessFilterChange = (value?: "true" | "false") => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      isActive: value || undefined,
    }));
  };

  const handleResetFilters = () => {
    setQuery({
      page: 1,
      limit: 10,
      search: "",
      archived: "false",
      isActive: undefined,
    });
  };

  const handleActiveToggle = async (admin: AdminRecord) => {
    try {
      await updateAdminActive({
        id: admin.id,
        isActive: !admin.isActive,
      }).unwrap();

      toast({
        title: admin.isActive ? "Admin deactivated" : "Admin activated",
        description: `${admin.name} has been ${admin.isActive ? "deactivated" : "activated"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Status update failed",
        description: error?.data?.message || "Could not update admin status.",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (admin: AdminRecord) => {
    try {
      await archiveAdmin(admin.id).unwrap();
      toast({
        title: "Admin archived",
        description: `${admin.name} has been moved to archive.`,
      });
      if (selectedAdmin?.id === admin.id) {
        setSelectedAdmin(null);
      }
    } catch (error: any) {
      toast({
        title: "Archive failed",
        description: error?.data?.message || "Could not archive this admin.",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async (admin: AdminRecord) => {
    try {
      await restoreAdmin(admin.id).unwrap();
      toast({
        title: "Admin restored",
        description: `${admin.name} has been restored and activated.`,
      });
    } catch (error: any) {
      toast({
        title: "Restore failed",
        description: error?.data?.message || "Could not restore this admin.",
        variant: "destructive",
      });
    }
  };

  const getAccessTag = (admin: AdminRecord) => {
    if (admin.archivedAt) return <Tag color="warning">ARCHIVED</Tag>;
    return admin.isActive ? (
      <Tag color="green">ACTIVE</Tag>
    ) : (
      <Tag color="red">INACTIVE</Tag>
    );
  };

  const columns: ColumnsType<AdminRecord> = [
    {
      title: "Admin",
      key: "admin",
      width: 250,
      render: (_, record) => (
        <div>
          <div className="font-semibold">{record.name}</div>
          <Text type="secondary">{record.email}</Text>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "personalContact",
      key: "personalContact",
      width: 150,
      render: (value: string | null) => value || "N/A",
    },
    {
      title: "Address",
      dataIndex: "personalAddress",
      key: "personalAddress",
      width: 220,
      ellipsis: true,
      render: (value: string | null) => value || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "Access",
      key: "access",
      width: 130,
      render: (_, record) => getAccessTag(record),
    },
    {
      title: "Created By",
      key: "createdBy",
      width: 170,
      render: (_, record) => record.createdBy?.name || "System",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end">
          <TableActionMenu
            items={[
              {
                key: "view",
                label: "View Details",
                icon: <EyeOutlined />,
                onClick: () => {
                  setSelectedAdmin(record);
                  setIsViewDetailsModalOpen(true);
                },
              },
              {
                key: "edit",
                label: "Edit Admin",
                icon: <EditOutlined />,
                hidden: Boolean(record.archivedAt),
                onClick: () => {
                  setSelectedAdmin(record);
                  setIsEditModalOpen(true);
                },
              },
              {
                key: "deactivate",
                label: "Deactivate",
                icon: <PauseCircleOutlined />,
                hidden: Boolean(record.archivedAt) || !record.isActive,
                disabled: isMutating,
                onClick: () => handleActiveToggle(record),
                confirm: {
                  title: "Deactivate Admin",
                  description:
                    "This admin will lose access until the account is activated again.",
                },
              },
              {
                key: "activate",
                label: "Activate",
                icon: <PlayCircleOutlined />,
                hidden: Boolean(record.archivedAt) || record.isActive,
                disabled: isMutating,
                onClick: () => handleActiveToggle(record),
                confirm: {
                  title: "Activate Admin",
                  description:
                    "This admin will regain access immediately.",
                },
              },
              {
                key: "archive",
                label: "Archive",
                icon: <StopOutlined />,
                danger: true,
                hidden: Boolean(record.archivedAt),
                disabled: isMutating,
                onClick: () => handleArchive(record),
                confirm: {
                  title: "Archive Admin",
                  description:
                    "This admin will be archived and removed from active access.",
                },
              },
              {
                key: "restore",
                label: "Restore",
                icon: <RollbackOutlined />,
                hidden: !record.archivedAt,
                disabled: isMutating,
                onClick: () => handleRestore(record),
                confirm: {
                  title: "Restore Admin",
                  description:
                    "This archived admin will be restored and activated.",
                },
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="w-full space-y-5 lg:space-y-6">
        <Card bordered={false} className="shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <Title level={3} className="!mb-1">
                Admin Management
              </Title>
              <Paragraph className="!mb-0 text-muted-foreground">
                Super admin can create admins, manage their access, archive
                accounts, and restore them from one table.
              </Paragraph>
            </div>

            <div className="w-full lg:w-auto">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full lg:w-auto"
              >
                Add Admin
              </Button>
            </div>
          </div>
        </Card>

        <Card bordered={false} className="shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row xl:items-center">
            <div className="w-full">
              <TableSearch setQuery={setQuery} placeholder="Search admins..." />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:items-center">
              <Select
                className="w-full"
                value={query.archived}
                onChange={handleArchivedChange}
                options={[
                  { label: "Active List", value: "false" },
                  { label: "Archived List", value: "true" },
                ]}
              />

              <Select
                allowClear
                className="w-full"
                placeholder="Filter by access"
                value={query.isActive}
                onChange={handleAccessFilterChange}
                options={[
                  { label: "ACTIVE", value: "true" },
                  { label: "INACTIVE", value: "false" },
                ]}
              />

              {hasActiveFilters && (
                <Button onClick={handleResetFilters} className="w-full xl:w-auto">
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
            <CustomTable<AdminRecord>
              loading={isLoading || isFetching}
              columns={columns}
              dataSource={admins}
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
                    No admins found for the current filter.
                  </div>
                ),
              }}
            />
          </div>
        </Card>
      </div>

      <CreateAdminModal
        isModalOpen={isCreateModalOpen}
        closeModal={() => setIsCreateModalOpen(false)}
      />

      <AdminDetailsModal
        isModalOpen={isViewDetailsModalOpen}
        closeModal={() => setIsViewDetailsModalOpen(false)}
        data={selectedAdmin}
      />

      <EditAdminModal
        isModalOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        admin={selectedAdmin}
      />
    </>
  );
};

export default SuperAdminAdmins;
