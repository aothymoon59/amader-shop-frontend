import { Card, Form, Input } from "antd";

const ContactFormSectionFields = () => (
  <Card size="small" title="Form Behavior">
    <Form.Item
      label="Recipient Email"
      name="recipientEmail"
      extra="Optional. If empty, new messages are sent to the Support Email from Contact Details."
    >
      <Input placeholder="support@amadershop.com" />
    </Form.Item>
    <Form.Item label="Success Message" name="successMessage">
      <Input.TextArea
        rows={3}
        placeholder="Thanks for reaching out. Our team will reply soon."
      />
    </Form.Item>
  </Card>
);

export default ContactFormSectionFields;
