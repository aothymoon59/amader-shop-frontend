import { Form, Input } from "antd";

const CategoriesSectionFields = () => (
  <>
    <Form.Item label="Category Card Subtitle" name="cardSubtitle">
      <Input placeholder="Browse products" />
    </Form.Item>
    <Form.Item label="Button Text" name="ctaText">
      <Input placeholder="Explore All Categories" />
    </Form.Item>
    <Form.Item label="Button Link" name="ctaLink">
      <Input placeholder="/products" />
    </Form.Item>
    <Form.Item label="Empty State Message" name="emptyStateText">
      <Input.TextArea rows={3} placeholder="Message shown when no categories are available" />
    </Form.Item>
    <Form.Item label="Error Title" name="errorTitle">
      <Input placeholder="Failed to load categories." />
    </Form.Item>
    <Form.Item label="Error Message" name="errorDescription">
      <Input placeholder="Please try again in a moment." />
    </Form.Item>
  </>
);

export default CategoriesSectionFields;
