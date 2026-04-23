import { Form, Input } from "antd";

const TestimonialsSectionFields = () => (
  <Form.Item label="Empty State Message" name="emptyStateText">
    <Input.TextArea
      rows={4}
      placeholder="Message shown until featured customer reviews are available"
    />
  </Form.Item>
);

export default TestimonialsSectionFields;
