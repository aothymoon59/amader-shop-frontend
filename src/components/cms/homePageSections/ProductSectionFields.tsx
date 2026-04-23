import { Form, Input } from "antd";

const ProductSectionFields = () => (
  <>
    <Form.Item label="Button Text" name="ctaText">
      <Input placeholder="View all products" />
    </Form.Item>
    <Form.Item label="Button Link" name="ctaLink">
      <Input placeholder="/products" />
    </Form.Item>
    <Form.Item label="Empty State Message" name="emptyStateText">
      <Input.TextArea rows={3} placeholder="Message shown when no items are available" />
    </Form.Item>
    <Form.Item label="Error Title" name="errorTitle">
      <Input placeholder="Failed to load products." />
    </Form.Item>
    <Form.Item label="Error Message" name="errorDescription">
      <Input placeholder="Please try again in a moment." />
    </Form.Item>
  </>
);

export default ProductSectionFields;
