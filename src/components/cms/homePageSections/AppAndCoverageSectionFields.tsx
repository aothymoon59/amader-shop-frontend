import type { ReactNode } from "react";
import { Form, Input } from "antd";
import type { ArrayTextAreaFieldRenderer, ButtonFieldsProps } from "./types";

type AppAndCoverageSectionFieldsProps = {
  renderArrayTextArea: ArrayTextAreaFieldRenderer;
  renderButtonFields: (props?: ButtonFieldsProps) => ReactNode;
};

const AppAndCoverageSectionFields = ({
  renderArrayTextArea,
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
    {renderArrayTextArea(
      "coverageItems",
      "Coverage Highlights",
      "Add one short coverage point per line",
    )}
  </>
);

export default AppAndCoverageSectionFields;
