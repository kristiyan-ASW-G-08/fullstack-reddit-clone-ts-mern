import React, { FC, cloneElement, useState } from 'react';
import { Modal as AntModal, Button } from 'antd';
interface ModalProps {
  title: string;
  visible: boolean;
  cancelHandler: () => void;
}
const Modal: FC<ModalProps> = ({ title, cancelHandler, children, visible }) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  return (
    <AntModal
      title={title}
      visible={visible}
      onCancel={cancelHandler}
      confirmLoading={confirmLoading}
      footer={[
        <Button
          key="back"
          loading={confirmLoading}
          onClick={cancelHandler}
          type="danger"
        >
          Cancel
        </Button>,
      ]}
    >
      {cloneElement(children as React.ReactElement<any>, {
        setConfirmLoading,
      })}
    </AntModal>
  );
};

export default Modal;
