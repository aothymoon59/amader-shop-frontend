import { Button, Card, Form, Input, Space, Typography } from "antd";

const FaqSectionFields = () => (
  <Form.List name="items">
    {(fields, { add, remove }) => (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Typography.Text strong>FAQ Items</Typography.Text>
          <Button type="dashed" onClick={() => add({})}>
            Add FAQ
          </Button>
        </Space>

        {fields.map((field, index) => (
          <Card size="small" key={field.key}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Form.Item
                label={`Question ${index + 1}`}
                name={[field.name, "title"]}
              >
                <Input placeholder="How do customers place orders?" />
              </Form.Item>

              <Form.Item
                label={`Answer ${index + 1}`}
                name={[field.name, "subtitle"]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Customers browse products, add to cart, and checkout from the storefront."
                />
              </Form.Item>

              <Button danger type="default" onClick={() => remove(field.name)}>
                Remove FAQ
              </Button>
            </Space>
          </Card>
        ))}
      </Space>
    )}
  </Form.List>
);

export default FaqSectionFields;
