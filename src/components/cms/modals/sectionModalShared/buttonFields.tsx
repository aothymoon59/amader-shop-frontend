import { Form, Input } from "antd";

import type { ButtonFieldsProps } from "../../sections/sharedSectionFields/types";

const renderButtonFields = (props?: ButtonFieldsProps) => (
  <>
    <Form.Item
      label={props?.primaryTextLabel || "Primary Button Text"}
      name="primaryButtonText"
    >
      <Input
        placeholder={props?.primaryTextPlaceholder || "Enter button label"}
      />
    </Form.Item>
    <Form.Item
      label={props?.primaryLinkLabel || "Primary Button Link"}
      name="primaryButtonLink"
    >
      <Input placeholder={props?.primaryLinkPlaceholder || "/products"} />
    </Form.Item>
    <Form.Item
      label={props?.secondaryTextLabel || "Secondary Button Text"}
      name="secondaryButtonText"
    >
      <Input
        placeholder={
          props?.secondaryTextPlaceholder || "Enter secondary button label"
        }
      />
    </Form.Item>
    <Form.Item
      label={props?.secondaryLinkLabel || "Secondary Button Link"}
      name="secondaryButtonLink"
    >
      <Input
        placeholder={props?.secondaryLinkPlaceholder || "/provider/apply"}
      />
    </Form.Item>
  </>
);

export default renderButtonFields;
