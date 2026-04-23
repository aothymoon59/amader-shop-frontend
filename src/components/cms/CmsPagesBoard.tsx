import { App, Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { ArrowRightOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type CmsPagesBoardProps = {
  role: "admin" | "super-admin";
};

type CmsPageDefinition = {
  key: "home";
  name: string;
  route: string;
  description: string;
};

const cmsPages: CmsPageDefinition[] = [
  {
    key: "home",
    name: "Home Page",
    route: "/",
    description:
      "Manage section sequence, section titles, subtitles, descriptions, buttons, cards, and other home page content.",
  },
];

const CmsPagesBoard = ({ role }: CmsPagesBoardProps) => {
  const navigate = useNavigate();
  const basePath = role === "admin" ? "/admin/cms/management" : "/super-admin/cms/management";

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 8 }}>
          CMS Pages
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Select a page to manage its content. More CMS pages can be added here later.
        </Typography.Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        {cmsPages.map((page) => (
          <Col xs={24} md={12} xl={8} key={page.key}>
            <Card
              hoverable
              style={{ height: "100%" }}
              actions={[
                <Button
                  key="manage"
                  type="link"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate(`${basePath}/${page.key}`)}
                >
                  Manage Page
                </Button>,
              ]}
            >
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Space align="start">
                  <FileTextOutlined style={{ fontSize: 20, color: "#1677ff", marginTop: 4 }} />
                  <div>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {page.name}
                    </Typography.Title>
                    <Space wrap style={{ marginTop: 8 }}>
                      <Tag color="blue">{page.route}</Tag>
                      <Tag color="green">Ready</Tag>
                    </Space>
                  </div>
                </Space>

                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {page.description}
                </Typography.Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
};

export default CmsPagesBoard;
