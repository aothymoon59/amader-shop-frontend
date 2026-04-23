import { useMemo, useState } from "react";
import { ArrowLeftOutlined, ArrowDownOutlined, ArrowUpOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Space, Spin, Tag, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";

import CmsHomePageFormModal from "@/components/cms/CmsHomePageFormModal";
import {
  useGetAdminHomePageSectionsQuery,
  useUpdateHomePageSectionsMutation,
} from "@/redux/features/generalApi/homePageCmsApi";
import { defaultHomePageSections, type HomePageSection } from "@/types/homePageCms";

type CmsHomePageManagementBoardProps = {
  role: "admin" | "super-admin";
};

const CmsHomePageManagementBoard = ({ role }: CmsHomePageManagementBoardProps) => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetAdminHomePageSectionsQuery();
  const [updateHomePageSections, { isLoading: isSaving }] = useUpdateHomePageSectionsMutation();
  const [search, setSearch] = useState("");
  const [editingSection, setEditingSection] = useState<HomePageSection | null>(null);

  const basePath = role === "admin" ? "/admin/cms/management" : "/super-admin/cms/management";

  const sections = useMemo(
    () => [...(data?.data.sections ?? defaultHomePageSections)].sort((a, b) => a.order - b.order),
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

  const persist = async (nextSections: HomePageSection[], successText: string) => {
    try {
      await updateHomePageSections({ sections: nextSections }).unwrap();
      message.success(successText);
    } catch (error) {
      message.error("The home page CMS changes could not be saved.");
    }
  };

  const moveSection = async (sectionKey: HomePageSection["key"], direction: "up" | "down") => {
    const currentIndex = sections.findIndex((section) => section.key === sectionKey);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

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

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Space direction="vertical" size={8}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(basePath)} style={{ width: "fit-content" }}>
          Back to CMS Pages
        </Button>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Home Page Management
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
          Manage the home page section order and content using simple Ant Design forms.
        </Typography.Paragraph>
      </Space>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Typography.Text type="secondary">Total Sections</Typography.Text>
            <Typography.Title level={3} style={{ margin: "8px 0 0" }}>
              {sections.length}
            </Typography.Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Typography.Text type="secondary">Enabled Sections</Typography.Text>
            <Typography.Title level={3} style={{ margin: "8px 0 0" }}>
              {enabledCount}
            </Typography.Title>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Typography.Text type="secondary">Hidden Sections</Typography.Text>
            <Typography.Title level={3} style={{ margin: "8px 0 0" }}>
              {sections.length - enabledCount}
            </Typography.Title>
          </Card>
        </Col>
      </Row>

      <Card>
        <Input.Search
          allowClear
          placeholder="Search home sections"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Card>

      {isLoading ? (
        <Card>
          <Space align="center">
            <Spin />
            <Typography.Text type="secondary">Loading home page CMS sections...</Typography.Text>
          </Space>
        </Card>
      ) : isError ? (
        <Card>
          <Space direction="vertical">
            <Typography.Text type="danger">Failed to load home page CMS sections.</Typography.Text>
            <Button onClick={() => refetch()}>Retry</Button>
          </Space>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredSections.map((section, index) => (
            <Col xs={24} key={section.key}>
              <Card>
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  <Space wrap>
                    <Tag>#{section.order}</Tag>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {section.name}
                    </Typography.Title>
                    <Tag color={section.enabled ? "green" : "default"}>
                      {section.enabled ? "Enabled" : "Hidden"}
                    </Tag>
                  </Space>

                  <Typography.Text strong>{section.title || "No title set"}</Typography.Text>
                  <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {section.subtitle || section.description || "No subtitle or description set."}
                  </Typography.Paragraph>

                  <Space wrap>
                    <Button
                      icon={<ArrowUpOutlined />}
                      onClick={() => moveSection(section.key, "up")}
                      disabled={isSaving || index === 0}
                    >
                      Move Up
                    </Button>
                    <Button
                      icon={<ArrowDownOutlined />}
                      onClick={() => moveSection(section.key, "down")}
                      disabled={isSaving || index === sections.length - 1}
                    >
                      Move Down
                    </Button>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => setEditingSection(section)}>
                      Edit Section
                    </Button>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
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
