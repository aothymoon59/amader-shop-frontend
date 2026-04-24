import type { FormInstance } from "antd";
import type { ReactNode } from "react";

import type { ManagedCmsSection } from "@/types/cmsSections";
import type {
  CmsSectionFormModalProps,
  FormValues,
} from "../../sections/sharedSectionFields/types";

export type SectionModalProps = CmsSectionFormModalProps;

export type SectionContentBuilder = (
  values: FormValues,
  section: ManagedCmsSection,
) =>
  | Record<string, unknown>
  | null
  | Promise<Record<string, unknown> | null>;

export type CmsSectionEditorModalProps = CmsSectionFormModalProps & {
  description: string;
  submitLoading?: boolean;
  buildContent: SectionContentBuilder;
  children: (form: FormInstance<FormValues>) => ReactNode;
};
