import React, { FC } from 'react';
import { Modal as AntModal } from 'antd';
interface ModalProps {
  title: string;
  visible: boolean;
  cancelHandler: () => void;
}
const Modal: FC<ModalProps> = ({ title, visible, cancelHandler, children }) => {
  return (
    <AntModal
      title={title}
      visible={visible}
      onCancel={cancelHandler}
      footer={[]}
    >
      {children}
    </AntModal>
  );
};

export default Modal;
