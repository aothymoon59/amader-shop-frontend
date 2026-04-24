import { Form, Input } from "antd";

const TopPromoBarSectionFields = () => (
  <>
    <Form.Item label="Left Message" name="primaryText">
      <Input placeholder="Free delivery on orders above $30" />
    </Form.Item>
    <Form.Item label="Right Message" name="secondaryText">
      <Input placeholder="Delivery in 30-60 minutes in selected areas" />
    </Form.Item>
  </>
);

export default TopPromoBarSectionFields;
