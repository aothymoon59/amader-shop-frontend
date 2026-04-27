import { Card, Form, Input } from "antd";

const ContactDetailsSectionFields = () => (
  <Card size="small" title="Public Contact Details">
    <Form.Item
      label="Support Email"
      name="contactEmail"
      extra="Shown on the public Contact page and used as the fallback recipient for new contact messages."
    >
      <Input placeholder="support@amadershop.com" />
    </Form.Item>
    <Form.Item label="Support Phone" name="contactPhone">
      <Input placeholder="+880 1700-000000" />
    </Form.Item>
    <Form.Item label="Address" name="contactAddress">
      <Input.TextArea rows={3} placeholder="Dhaka, Bangladesh" />
    </Form.Item>
    <Form.Item label="Support Hours" name="supportHours">
      <Input placeholder="Saturday to Thursday, 9:00 AM - 6:00 PM" />
    </Form.Item>
    <Form.Item label="Response Time Text" name="responseTimeText">
      <Input placeholder="We usually reply within one business day." />
    </Form.Item>
    <Form.Item label="Map Embed URL" name="mapEmbedUrl">
      <Input placeholder="https://www.google.com/maps/embed?..." />
    </Form.Item>
  </Card>
);

export default ContactDetailsSectionFields;
