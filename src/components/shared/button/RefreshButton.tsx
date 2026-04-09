import { Button } from "antd";
import { VscRefresh } from "react-icons/vsc";

const RefreshButton = ({
  refetch,
  isLoading,
  text = "Refresh",
  iconOnly = false,
}) => {
  return (
    <Button
      size="medium"
      icon={<VscRefresh />}
      onClick={refetch}
      loading={isLoading}
      title="Refresh"
    >
      {iconOnly ? null : text}
    </Button>
  );
};

export default RefreshButton;
