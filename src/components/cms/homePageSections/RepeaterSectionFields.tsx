import { Button, Card, Form, Input, Select, Space, Typography } from "antd";
import type { HomeSectionKey } from "@/types/homePageCms";

type RepeaterSectionFieldsProps = {
  sectionKey: Extract<HomeSectionKey, "stats" | "promo" | "whyChooseUs" | "howItWorks">;
};

const sectionTitles = {
  stats: "Items",
  promo: "Promo Cards",
  whyChooseUs: "Feature Cards",
  howItWorks: "Steps",
} as const;

const RepeaterSectionFields = ({ sectionKey }: RepeaterSectionFieldsProps) => (
  <Form.List name="items">
    {(fields, { add, remove }) => (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Typography.Text strong>{sectionTitles[sectionKey]}</Typography.Text>
          <Button
            type="dashed"
            onClick={() =>
              add(
                sectionKey === "whyChooseUs"
                  ? { extra: "Truck" }
                  : sectionKey === "promo"
                    ? { extraTwo: "primary" }
                    : {},
              )
            }
          >
            Add Item
          </Button>
        </Space>

        {fields.map((field) => (
          <Card size="small" key={field.key}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Form.Item
                label={sectionKey === "stats" ? "Label" : "Title"}
                name={[field.name, "title"]}
              >
                <Input placeholder={sectionKey === "stats" ? "Local Shops" : "Enter title"} />
              </Form.Item>
              <Form.Item
                label={sectionKey === "stats" ? "Value" : "Description"}
                name={[field.name, "subtitle"]}
              >
                {sectionKey === "stats" ? (
                  <Input placeholder="300+" />
                ) : (
                  <Input.TextArea rows={3} placeholder="Enter supporting text" />
                )}
              </Form.Item>

              {sectionKey === "promo" ? (
                <>
                  <Form.Item label="Badge Text" name={[field.name, "extra"]}>
                    <Input placeholder="Fresh" />
                  </Form.Item>
                  <Form.Item label="Card Style" name={[field.name, "extraTwo"]}>
                    <Select
                      options={[
                        { value: "primary", label: "Primary" },
                        { value: "accent", label: "Accent" },
                        { value: "mixed", label: "Mixed" },
                      ]}
                    />
                  </Form.Item>
                </>
              ) : null}

              {sectionKey === "whyChooseUs" ? (
                <Form.Item label="Icon" name={[field.name, "extra"]}>
                  <Select
                    options={[
                      { value: "Truck", label: "Truck" },
                      { value: "ShieldCheck", label: "Shield Check" },
                      { value: "BadgePercent", label: "Discount Badge" },
                      { value: "Clock3", label: "Clock" },
                    ]}
                  />
                </Form.Item>
              ) : null}

              <Button danger type="default" onClick={() => remove(field.name)}>
                Remove Item
              </Button>
            </Space>
          </Card>
        ))}
      </Space>
    )}
  </Form.List>
);

export default RepeaterSectionFields;
