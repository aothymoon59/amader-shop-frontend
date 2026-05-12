import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const formatDateTime = (value?: string | null) =>
  value ? dayjs.utc(value).format("MMM D, YYYY, h:mm A") : "";
