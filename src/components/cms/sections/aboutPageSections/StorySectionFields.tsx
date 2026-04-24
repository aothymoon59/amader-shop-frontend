import { Form, Input } from "antd";

const StorySectionFields = () => (
  <Form.Item
    label="Story Content"
    name="description"
    extra="Use paragraphs to explain the mission, background, and story of the business."
  >
    <Input.TextArea
      rows={10}
      placeholder="Write the About page story content here"
    />
  </Form.Item>
);

export default StorySectionFields;
