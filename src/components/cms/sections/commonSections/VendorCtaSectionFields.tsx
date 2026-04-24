import type { ReactNode } from "react";
import type { ButtonFieldsProps } from "../sharedSectionFields/types";

type VendorCtaSectionFieldsProps = {
  renderButtonFields: (props?: ButtonFieldsProps) => ReactNode;
};

const VendorCtaSectionFields = ({
  renderButtonFields,
}: VendorCtaSectionFieldsProps) =>
  renderButtonFields({
    primaryTextLabel: "Primary Button Text",
    primaryTextPlaceholder: "Apply as Vendor",
    primaryLinkLabel: "Primary Button Link",
    primaryLinkPlaceholder: "/provider/apply",
    secondaryTextLabel: "Secondary Button Text",
    secondaryTextPlaceholder: "Explore Marketplace",
    secondaryLinkLabel: "Secondary Button Link",
    secondaryLinkPlaceholder: "/products",
  });

export default VendorCtaSectionFields;
