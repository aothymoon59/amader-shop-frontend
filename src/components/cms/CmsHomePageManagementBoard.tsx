import { useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  EditOutlined,
  SearchOutlined,
  AppstoreOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";

import CmsHomePageFormModal from "@/components/cms/CmsHomePageFormModal";
import {
  useGetAdminHomePageSectionsQuery,
  useUpdateHomePageSectionsMutation,
} from "@/redux/features/generalApi/homePageCmsApi";
import {
  defaultHomePageSections,
  type HomePageSection,
} from "@/types/homePageCms";

type CmsHomePageManagementBoardProps = {
  role: "admin" | "super-admin";
};

const CmsHomePageManagementBoard = ({
  role,
}: CmsHomePageManagementBoardProps) => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } =
    useGetAdminHomePageSectionsQuery();
  const [updateHomePageSections, { isLoading: isSaving }] =
    useUpdateHomePageSectionsMutation();
  const [search, setSearch] = useState("");
  const [editingSection, setEditingSection] = useState<HomePageSection | null>(
    null,
  );

  const basePath =
    role === "admin" ? "/admin/cms/management" : "/super-admin/cms/management";

  const sections = useMemo(
    () =>
      [...(data?.data.sections ?? defaultHomePageSections)].sort(
        (a, b) => a.order - b.order,
      ),
    [data],
  );

  const filteredSections = useMemo(
    () =>
      sections.filter((section) =>
        [section.name, section.title, section.subtitle, section.description]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search, sections],
  );

  const persist = async (
    nextSections: HomePageSection[],
    successText: string,
  ) => {
    try {
      await updateHomePageSections({ sections: nextSections }).unwrap();
      message.success(successText);
    } catch (error) {
      message.error("The home page CMS changes could not be saved.");
    }
  };

  const moveSection = async (
    sectionKey: HomePageSection["key"],
    direction: "up" | "down",
  ) => {
    const currentIndex = sections.findIndex(
      (section) => section.key === sectionKey,
    );
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sections.length) {
      return;
    }

    const nextSections = [...sections];
    const [currentSection] = nextSections.splice(currentIndex, 1);
    nextSections.splice(targetIndex, 0, currentSection);

    await persist(
      nextSections.map((section, index) => ({
        ...section,
        order: index + 1,
      })),
      `${currentSection.name} sequence updated.`,
    );
  };

  const saveSection = async (updatedSection: HomePageSection) => {
    const nextSections = sections.map((section) =>
      section.key === updatedSection.key ? updatedSection : section,
    );

    await persist(nextSections, `${updatedSection.name} updated successfully.`);
    setEditingSection(null);
  };

  const enabledCount = sections.filter((section) => section.enabled).length;
  const hiddenCount = sections.length - enabledCount;

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(basePath)}
            style={{ width: "fit-content", borderRadius: 10 }}
          >
            Back to CMS Pages
          </Button>

          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={6}>
                <Typography.Title level={2} style={{ margin: 0 }}>
                  Home Page Management
                </Typography.Title>
                <Typography.Paragraph
                  type="secondary"
                  style={{ margin: 0, fontSize: 15 }}
                >
                  Manage home page sections, update content, and control display
                  order with a cleaner workflow.
                </Typography.Paragraph>
              </Space>
            </Col>

            <Col xs={24} lg={8}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Tag
                  color="blue"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    fontSize: 13,
                    marginInlineEnd: 0,
                  }}
                >
                  {role === "admin" ? "Admin Panel" : "Super Admin Panel"}
                </Tag>
              </div>
            </Col>
          </Row>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 18,
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Space align="start" size={14}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(24, 144, 255, 0.12)",
                  color: "#1890ff",
                  fontSize: 18,
                }}
              >
                <AppstoreOutlined />
              </div>
              <div>
                <Typography.Text type="secondary">
                  Total Sections
                </Typography.Text>
                <Typography.Title level={3} style={{ margin: "6px 0 0" }}>
                  {sections.length}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 18,
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Space align="start" size={14}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(82, 196, 26, 0.12)",
                  color: "#52c41a",
                  fontSize: 18,
                }}
              >
                <EyeOutlined />
              </div>
              <div>
                <Typography.Text type="secondary">
                  Enabled Sections
                </Typography.Text>
                <Typography.Title level={3} style={{ margin: "6px 0 0" }}>
                  {enabledCount}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 18,
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Space align="start" size={14}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(250, 173, 20, 0.12)",
                  color: "#faad14",
                  fontSize: 18,
                }}
              >
                <EyeInvisibleOutlined />
              </div>
              <div>
                <Typography.Text type="secondary">
                  Hidden Sections
                </Typography.Text>
                <Typography.Title level={3} style={{ margin: "6px 0 0" }}>
                  {hiddenCount}
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          borderRadius: 18,
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
        }}
        bodyStyle={{ padding: 20 }}
      >
        <Input
          allowClear
          size="large"
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="Search home sections by name, title, subtitle, or description"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ borderRadius: 12 }}
        />
      </Card>

      {isLoading ? (
        <Card
          bordered={false}
          style={{
            borderRadius: 18,
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Space align="center" size={12}>
            <Spin />
            <Typography.Text type="secondary">
              Loading home page CMS sections...
            </Typography.Text>
          </Space>
        </Card>
      ) : isError ? (
        <Card
          bordered={false}
          style={{
            borderRadius: 18,
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Space direction="vertical" size={12}>
            <Typography.Text type="danger">
              Failed to load home page CMS sections.
            </Typography.Text>
            <Button onClick={() => refetch()} style={{ borderRadius: 10 }}>
              Retry
            </Button>
          </Space>
        </Card>
      ) : filteredSections.length === 0 ? (
        <Card
          bordered={false}
          style={{
            borderRadius: 18,
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Empty
            description="No sections found for your search."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Row gutter={[18, 18]}>
          {filteredSections.map((section) => {
            const actualIndex = sections.findIndex(
              (item) => item.key === section.key,
            );
            const isFirst = actualIndex === 0;
            const isLast = actualIndex === sections.length - 1;

            return (
              <Col xs={24} key={section.key}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    borderRadius: 20,
                    boxShadow: "0 8px 22px rgba(15, 23, 42, 0.06)",
                  }}
                  bodyStyle={{ padding: 22 }}
                >
                  <Row gutter={[20, 20]} align="middle" justify="space-between">
                    <Col xs={24} lg={16}>
                      <Space
                        direction="vertical"
                        size={12}
                        style={{ width: "100%" }}
                      >
                        <Space wrap size={[8, 8]}>
                          <Tag
                            color="blue"
                            style={{
                              borderRadius: 999,
                              paddingInline: 10,
                              marginInlineEnd: 0,
                            }}
                          >
                            #{section.order}
                          </Tag>

                          <Typography.Title level={4} style={{ margin: 0 }}>
                            {section.name}
                          </Typography.Title>

                          <Tag
                            color={section.enabled ? "green" : "default"}
                            style={{
                              borderRadius: 999,
                              paddingInline: 10,
                              marginInlineEnd: 0,
                            }}
                          >
                            {section.enabled ? "Enabled" : "Hidden"}
                          </Tag>
                        </Space>

                        <div>
                          <Typography.Text
                            strong
                            style={{
                              display: "block",
                              fontSize: 16,
                              marginBottom: 6,
                            }}
                          >
                            {section.title || "No title set"}
                          </Typography.Text>

                          <Typography.Paragraph
                            type="secondary"
                            style={{
                              marginBottom: 0,
                              fontSize: 14,
                              lineHeight: 1.7,
                            }}
                          >
                            {section.subtitle ||
                              section.description ||
                              "No subtitle or description set."}
                          </Typography.Paragraph>
                        </div>
                      </Space>
                    </Col>

                    <Col xs={24} lg={8}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Space wrap>
                          <Button
                            icon={<ArrowUpOutlined />}
                            onClick={() => moveSection(section.key, "up")}
                            disabled={isSaving || isFirst}
                            style={{ borderRadius: 10 }}
                          >
                            Move Up
                          </Button>

                          <Button
                            icon={<ArrowDownOutlined />}
                            onClick={() => moveSection(section.key, "down")}
                            disabled={isSaving || isLast}
                            style={{ borderRadius: 10 }}
                          >
                            Move Down
                          </Button>

                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => setEditingSection(section)}
                            loading={isSaving}
                            style={{ borderRadius: 10 }}
                          >
                            Edit Section
                          </Button>
                        </Space>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <CmsHomePageFormModal
        open={Boolean(editingSection)}
        section={editingSection}
        onClose={() => setEditingSection(null)}
        onSave={saveSection}
      />
    </Space>
  );
};

export default CmsHomePageManagementBoard;
