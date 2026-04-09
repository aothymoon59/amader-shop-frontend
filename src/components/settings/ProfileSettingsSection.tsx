import { useEffect } from "react";
import dayjs from "dayjs";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Typography,
  Upload,
} from "antd";
import { CameraOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateMeMutation } from "@/redux/features/auth/usersApi";
import type { UploadFile } from "antd/es/upload/interface";

const { Title, Paragraph, Text } = Typography;

type PersonalProfileFormValues = {
  name?: string;
  personalContact?: string;
  personalAddress?: string;
  dateOfBirth?: dayjs.Dayjs | null;
  profileImage?: UploadFile[];
};

const normalizeUploadValue = (
  event: { fileList?: UploadFile[] } | UploadFile[],
) => {
  if (Array.isArray(event)) {
    return event;
  }

  return event?.fileList || [];
};

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null
  ) {
    const data = error.data as {
      errorMessage?: string;
      message?: string;
    };

    return data.errorMessage || data.message;
  }

  return undefined;
};

const ProfileSettingsSection = ({ title }: { title?: string }) => {
  const [form] = Form.useForm<PersonalProfileFormValues>();
  const { userData } = useAuth();
  const [updateMe, { isLoading }] = useUpdateMeMutation();

  useEffect(() => {
    form.setFieldsValue({
      name: userData?.name || "",
      personalContact: String(userData?.personalContact || ""),
      personalAddress: String(userData?.personalAddress || ""),
      dateOfBirth: userData?.dateOfBirth ? dayjs(userData.dateOfBirth) : null,
      profileImage: [],
    });
  }, [form, userData]);

  const handleSubmit = async (values: PersonalProfileFormValues) => {
    try {
      const payload = new FormData();
      const profileImageFile = values.profileImage?.[0]?.originFileObj;

      const nextName = values.name?.trim() || "";
      const currentName = userData?.name?.trim() || "";
      if (nextName && nextName !== currentName) {
        payload.append("name", nextName);
      }

      const nextContact = values.personalContact?.trim() || "";
      const currentContact = String(userData?.personalContact || "").trim();
      if (nextContact && nextContact !== currentContact) {
        payload.append("personalContact", nextContact);
      }

      const nextAddress = values.personalAddress?.trim() || "";
      const currentAddress = String(userData?.personalAddress || "").trim();
      if (nextAddress && nextAddress !== currentAddress) {
        payload.append("personalAddress", nextAddress);
      }

      const nextDob = values.dateOfBirth?.format("YYYY-MM-DD") || "";
      const currentDob = userData?.dateOfBirth
        ? dayjs(userData.dateOfBirth).format("YYYY-MM-DD")
        : "";
      if (nextDob && nextDob !== currentDob) {
        payload.append("dateOfBirth", nextDob);
      }

      if (profileImageFile) {
        payload.append("profileImage", profileImageFile);
      }

      if (!Array.from(payload.keys()).length) {
        toast({
          title: "No changes detected",
          description: "Update at least one field before saving.",
        });
        return;
      }

      const response = await updateMe(payload).unwrap();
      toast({
        title: "Profile updated",
        description:
          response.message || "Your personal profile has been updated.",
      });
      form.setFieldValue("profileImage", []);
    } catch (error: unknown) {
      toast({
        title: "Profile update failed",
        description:
          getErrorMessage(error) ||
          "Something went wrong while updating your profile.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card bordered={false} className="shadow-sm">
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Title level={4} className="!mb-1">
            {title || "Personal Profile"}
          </Title>
          <Paragraph className="!mb-0 text-muted-foreground">
            Update your name, personal contact details, address, date of birth,
            and profile image.
          </Paragraph>
        </div>

        <div className="flex w-full items-center gap-3 rounded-2xl border border-border/80 bg-secondary/20 px-4 py-3 sm:w-auto">
          <Avatar
            size={40}
            src={userData?.profileImage || undefined}
            icon={!userData?.profileImage ? <UserOutlined /> : undefined}
          >
            {userData?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <Text className="block font-medium">
              {userData?.name || "User"}
            </Text>
            <Text type="secondary">
              {userData?.role?.split("_").join(" ") || "account"}
            </Text>
          </div>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter your name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-muted-foreground" />}
                placeholder="Your full name"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Email">
              <Input
                size="large"
                value={String(userData?.email || "")}
                prefix={<MailOutlined className="text-muted-foreground" />}
                readOnly
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Personal Contact"
              name="personalContact"
              rules={[
                {
                  min: 7,
                  message: "Contact number must be at least 7 characters",
                },
              ]}
            >
              <Input size="large" placeholder="01700111222" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Date Of Birth" name="dateOfBirth">
              <DatePicker
                size="large"
                className="w-full"
                format="YYYY-MM-DD"
                disabledDate={(current) =>
                  Boolean(current && current.isAfter(dayjs().endOf("day")))
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Personal Address"
              name="personalAddress"
              rules={[
                {
                  min: 5,
                  message: "Address must be at least 5 characters",
                },
              ]}
            >
              <Input size="large" placeholder="Dhaka, Bangladesh" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Profile Image"
              name="profileImage"
              valuePropName="fileList"
              getValueFromEvent={normalizeUploadValue}
              extra="Upload a new image only if you want to replace the current profile photo."
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept=".jpg,.jpeg,.png,.webp,.gif"
                listType="picture"
              >
                <Button icon={<CameraOutlined />} className="w-full sm:w-auto">
                  Choose Profile Image
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-secondary/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Text className="block font-medium">Save profile changes</Text>
            <Text type="secondary">
              Your account details will update immediately after saving.
            </Text>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            className="w-full sm:w-auto"
          >
            Save Profile
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ProfileSettingsSection;
