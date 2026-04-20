import dayjs, { type Dayjs } from "dayjs";
import { DatePicker, Segmented } from "antd";
import type { AnalyticsPeriod } from "@/redux/features/reports/dashboardApi";

type AnalyticsDateFilterBarProps = {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  startDate: string;
  endDate: string;
  onRangeChange: (next: { startDate: string; endDate: string }) => void;
};

const AnalyticsDateFilterBar = ({
  period,
  onPeriodChange,
  startDate,
  endDate,
  onRangeChange,
}: AnalyticsDateFilterBarProps) => {
  const rangeValue: [Dayjs, Dayjs] = [dayjs(startDate), dayjs(endDate)];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Segmented
        value={period}
        options={[
          { label: "Monthly", value: "monthly" },
          { label: "Yearly", value: "yearly" },
          { label: "Custom", value: "custom" },
        ]}
        onChange={(value) => onPeriodChange(value as AnalyticsPeriod)}
      />

      {period === "custom" ? (
        <DatePicker.RangePicker
          value={rangeValue}
          allowClear={false}
          format="YYYY-MM-DD"
          onChange={(dates) => {
            if (!dates || !dates[0] || !dates[1]) {
              return;
            }

            onRangeChange({
              startDate: dates[0].format("YYYY-MM-DD"),
              endDate: dates[1].format("YYYY-MM-DD"),
            });
          }}
        />
      ) : null}
    </div>
  );
};

export default AnalyticsDateFilterBar;
