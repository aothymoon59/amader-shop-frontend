/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Button, Col, Form, Input, Row } from "antd";

import AntdModal from "@/components/shared/modal/AntdModal";
import { toast } from "@/hooks/use-toast";
import {
  type AdminRecord,
  useUpdateAdminMutation,
} from "@/redux/features/admin/adminManagementApi";

type EditAdminFormValues = {
  name?: string;
  email?: string;
  password?: string;
  personalContact?: string;
  personalAddress?: string;
};

type EditAdminModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  admin: AdminRecord | null;
};

const EditAdminModal = ({
  isModalOpen,
  closeModal,
  admin,
}: EditAdminModalProps) => {
  const [form] = Form.useForm<EditAdminFormValues>();
  const [updateAdmin, { isLoading }] = useUpdateAdminMutation();

  useEffect(() => {
    if (!admin || !isModalOpen) return;

    form.setFieldsValue({
      name: admin.name,
      email: admin.email,
      password: "",
      personalContact: admin.personalContact || "",
      personalAddress: admin.personalAddress || "",
    });
  }, [admin, form, isModalOpen]);

  const handleClose = () => {
    form.resetFields();
    closeModal();
  };

  const onFinish = async (values: EditAdminFormValues) => {
    if (!admin) return;

    const payload: EditAdminFormValues = {};

    if (values.name?.trim() && values.name !== admin.name) {
      payload.name = values.name.trim();
    }

    if (values.email?.trim() && values.email !== admin.email) {
      payload.email = values.email.trim();
    }

    if (values.password?.trim()) {
      payload.password = values.password;
    }

    const nextContact = values.personalContact?.trim() || "";
    const currentContact = admin.personalContact || "";
    if (nextContact !== currentContact) {
      payload.personalContact = nextContact;
    }

    const nextAddress = values.personalAddress?.trim() || "";
    const currentAddress = admin.personalAddress || "";
    if (nextAddress !== currentAddress) {
      payload.personalAddress = nextAddress;
    }

    if (!Object.keys(payload).length) {
      toast({
        title: "No changes detected",
        description: "Update at least one field before saving.",
      });
      return;
    }

    try {
      const res = await updateAdmin({
        id: admin.id,
        payload,
      }).unwrap();

      toast({
        title: "Admin updated",
        description: res?.message || "Admin updated successfully.",
      });

      handleClose();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error?.data?.message || "Something went wrong while updating admin.",
        variant: "destructive",
      });
    }
  };

  return (
    <AntdModal
      title="Update Admin"
      isModalOpen={isModalOpen}
      closeModal={handleClose}
      width={820}
      isCentered
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Admin Name"
              name="name"
              rules={[{ min: 2, message: "Name must be at least 2 characters" }]}
            >
              <Input placeholder="Sarah Johnson" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: "email", message: "Enter a valid email address" }]}
            >
              <Input placeholder="sarah@example.com" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Reset Password"
              name="password"
              rules={[
                {
                  min: 6,
                  message: "Password must be at least 6 characters",
                },
              ]}
              extra="Leave blank to keep current password."
            >
              <Input.Password placeholder="New password" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Phone Number"
              name="personalContact"
              rules={[
                {
                  pattern: /^$|^01[0-9]{9}$/,
                  message: "Enter valid Bangladeshi phone number",
                },
              ]}
            >
              <Input placeholder="01700111222" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Address" name="personalAddress">
              <Input placeholder="Banani, Dhaka" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Save Changes
          </Button>
        </div>
      </Form>
    </AntdModal>
  );
};

export default EditAdminModal;
