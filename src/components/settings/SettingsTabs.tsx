import { Grid, Tabs, Typography } from "antd";
import type { TabsProps } from "antd";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

type SettingsTabsProps = {
  title?: string | null;
  description?: string | null;
  items: TabsProps["items"];
  activeKey?: string;
  onChange?: (key: string) => void;
};

const SettingsTabs = ({
  title,
  description,
  items,
  activeKey,
  onChange,
}: SettingsTabsProps) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div className="space-y-4 sm:space-y-6">
      {(title || description) && (
        <div>
          {title && (
            <Title level={2} className="!mb-2">
              {title}
            </Title>
          )}
          {description && (
            <Paragraph className="!mb-0 text-muted-foreground">
              {description}
            </Paragraph>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card p-2 sm:p-4">
        <Tabs
          activeKey={activeKey}
          onChange={onChange}
          tabPosition={isMobile ? "top" : "left"}
          items={items}
          className={[
            "[&_.ant-tabs-content-holder]:pl-0",
            "[&_.ant-tabs-nav]:mb-4",
            !isMobile ? "[&_.ant-tabs-nav]:min-w-[220px]" : "",
            !isMobile ? "md:[&_.ant-tabs-content-holder]:pl-6" : "",
            isMobile
              ? "[&_.ant-tabs-nav-list]:w-full [&_.ant-tabs-tab]:flex-1 [&_.ant-tabs-tab-btn]:w-full [&_.ant-tabs-tab-btn]:text-center"
              : "",
          ].join(" ")}
        />
      </div>
    </div>
  );
};

export default SettingsTabs;
