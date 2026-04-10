import {
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Tag, Typography } from "antd";
import dayjs from "dayjs";

import AntdModal from "@/components/shared/modal/AntdModal";
import { type AdminRecord } from "@/redux/features/admin/adminManagementApi";

const { Text } = Typography;

type AdminDetailsModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  data: AdminRecord | null;
};

const getAccessTag = (admin?: AdminRecord | null) => {
  if (!admin) return null;
  if (admin.archivedAt) return <Tag color="warning">ARCHIVED</Tag>;
  return admin.isActive ? (
    <Tag color="success">ACTIVE</Tag>
  ) : (
    <Tag color="default">INACTIVE</Tag>
  );
};

const AdminDetailsModal = ({
  isModalOpen,
  closeModal,
  data: admin,
}: AdminDetailsModalProps) => {
  return (
    <AntdModal
      title="Admin Details"
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      width={760}
      height="70vh"
      isCentered
    >
      {!admin ? (
        <div className="py-10 text-center text-muted-foreground">
          No admin selected.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar
                size={64}
                className="!bg-primary !text-primary-foreground !font-semibold"
              >
                {admin.name?.[0] || "A"}
              </Avatar>

              <div>
                <h2 className="mb-1 text-xl font-semibold">{admin.name}</h2>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Tag color="blue">{admin.role}</Tag>
                  {getAccessTag(admin)}
                </div>
              </div>
            </div>
          </div>

          <Divider className="!my-0" />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border p-4">
              <h3 className="text-base font-semibold">Account Information</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MailOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Email Address</Text>
                    <div className="break-all font-medium">{admin.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Phone Number</Text>
                    <div className="font-medium">
                      {admin.personalContact || "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Address</Text>
                    <div className="font-medium">
                      {admin.personalAddress || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border p-4">
              <h3 className="text-base font-semibold">Access Information</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <UserOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Created By</Text>
                    <div className="font-medium">
                      {admin.createdBy?.name || "System"}
                    </div>
                    {admin.createdBy?.email && (
                      <div className="text-sm text-muted-foreground">
                        {admin.createdBy.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ClockCircleOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Created At</Text>
                    <div className="font-medium">
                      {dayjs(admin.createdAt).format("MMMM D, YYYY h:mm A")}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ClockCircleOutlined className="mt-1 text-primary" />
                  <div>
                    <Text type="secondary">Last Updated</Text>
                    <div className="font-medium">
                      {dayjs(admin.updatedAt).format("MMMM D, YYYY h:mm A")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AntdModal>
  );
};

export default AdminDetailsModal;
