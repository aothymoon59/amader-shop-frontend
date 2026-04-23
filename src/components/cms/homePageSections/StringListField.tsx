import { Button, Form, Input, Space, Typography } from "antd";
import type { FormValues } from "./types";

type StringListFieldProps = {
  name: keyof FormValues;
  label: string;
  itemLabel: string;
  placeholder: string;
  addButtonText?: string;
};

const StringListField = ({
  name,
  label,
  itemLabel,
  placeholder,
  addButtonText = "Add Item",
}: StringListFieldProps) => (
  <Form.List name={name}>
    {(fields, { add, remove }) => (
      <Space
        direction="vertical"
        size={12}
        style={{ width: "100%", marginBottom: 16 }}
      >
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Typography.Text strong>{label}</Typography.Text>
          <Button type="dashed" onClick={() => add("")}>
            {addButtonText}
          </Button>
        </Space>

        {fields.map((field, index) => (
          <div
            key={field.key}
            style={{
              alignItems: "flex-end",
              display: "flex",
              gap: 8,
              width: "100%",
            }}
          >
            <Form.Item
              label={`${itemLabel} ${index + 1}`}
              name={field.name}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input placeholder={placeholder} />
            </Form.Item>
            <Button danger onClick={() => remove(field.name)}>
              Remove
            </Button>
          </div>
        ))}
      </Space>
    )}
  </Form.List>
);

export default StringListField;
