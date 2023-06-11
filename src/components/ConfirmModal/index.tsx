import { QuestionCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";
const { confirm } = Modal;

type Props = {
  title: string;
  icon?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  onOk: () => void;
  onCancel?: () => void;
};

const ConfirmModal = ({
  title,
  icon = <QuestionCircleOutlined />,
  okText = "Có",
  cancelText = "Không",
  onOk,
  onCancel = () => {}
}: Props) => {
  return confirm({
    title,
    icon,
    okText,
    cancelText,
    onOk,
    onCancel
  });
};

export default ConfirmModal;
