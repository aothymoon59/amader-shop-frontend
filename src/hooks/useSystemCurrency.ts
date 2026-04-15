import { useGetSystemSettingsQuery } from "@/redux/features/generalApi/systemSettingsApi";

export const useSystemCurrency = () => {
  const query = useGetSystemSettingsQuery();

  return {
    ...query,
    currency: query.data?.data.currency,
  };
};
