import { Modal } from "antd";
import type { ReactNode } from "react";

type AntdModalProps = {
  title?: string;
  width?: number | string;
  height?: number | string;
  children?: ReactNode;
  closeModal?: () => void;
  isCentered?: boolean;
  isModalOpen?: boolean;
};

const AntdModal = ({
  title,
  width = 600,
  height,
  children,
  closeModal,
  isCentered = true,
  isModalOpen = false,
}: AntdModalProps) => {
  return (
    <Modal
      title={<h3 className="text-2xl mb-3">{title}</h3>}
      open={isModalOpen}
      onCancel={closeModal}
      centered={isCentered}
      width={width}
      footer={null}
      maskClosable={false}
      styles={{
        body: {
          maxHeight: height,
          minHeight: height,
          overflowY: height ? "auto" : undefined,
        },
      }}
    >
      {children}
    </Modal>
  );
};

export default AntdModal;
