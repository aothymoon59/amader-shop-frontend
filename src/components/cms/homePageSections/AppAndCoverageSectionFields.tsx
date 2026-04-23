import type { ReactNode } from "react";
import { Form, Input } from "antd";
import StringListField from "./StringListField";
import type { ButtonFieldsProps } from "./types";

type AppAndCoverageSectionFieldsProps = {
  renderButtonFields: (props?: ButtonFieldsProps) => ReactNode;
};

const AppAndCoverageSectionFields = ({
  renderButtonFields,
}: AppAndCoverageSectionFieldsProps) => (
  <>
    {renderButtonFields({
      primaryTextLabel: "Primary Button Text",
      primaryTextPlaceholder: "Download App",
      primaryLinkLabel: "Primary Button Link",
      primaryLinkPlaceholder: "#",
      secondaryTextLabel: "Secondary Button Text",
      secondaryTextPlaceholder: "Learn More",
      secondaryLinkLabel: "Secondary Button Link",
      secondaryLinkPlaceholder: "#",
    })}
    <Form.Item label="Coverage Description" name="coverageSubtitle">
      <Input.TextArea
        rows={4}
        placeholder="Explain your delivery coverage, vendors, or service area"
      />
    </Form.Item>
    <StringListField
      name="coverageItems"
      label="Coverage Highlights"
      itemLabel="Coverage Point"
      placeholder="Same-day delivery in key neighborhoods"
      addButtonText="Add Coverage Point"
    />
  </>
);

export default AppAndCoverageSectionFields;
