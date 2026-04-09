import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Modal } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import type { ReactNode } from "react";

type TableActionMenuItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  onClick: () => void;
  confirm?: {
    title: string;
    description?: string;
    okText?: string;
    cancelText?: string;
  };
};

type TableActionMenuProps = {
  items: TableActionMenuItem[];
};

const TableActionMenu = ({ items }: TableActionMenuProps) => {
  const visibleItems = items.filter((item) => !item.hidden);

  const menuItems: ItemType[] = visibleItems.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    danger: item.danger,
    disabled: item.disabled,
  }));

  const handleClick = ({ key }: { key: string }) => {
    const action = visibleItems.find((item) => item.key === key);
    if (!action) return;

    if (action.confirm) {
      Modal.confirm({
        title: action.confirm.title,
        content: action.confirm.description,
        okText: action.confirm.okText || "Yes",
        cancelText: action.confirm.cancelText || "No",
        okButtonProps: { danger: action.danger },
        onOk: action.onClick,
      });
      return;
    }

    action.onClick();
  };

  return (
    <Dropdown menu={{ items: menuItems, onClick: handleClick }} trigger={["click"]}>
      <Button icon={<MoreOutlined />} />
    </Dropdown>
  );
};

export type { TableActionMenuItem };
export default TableActionMenu;
