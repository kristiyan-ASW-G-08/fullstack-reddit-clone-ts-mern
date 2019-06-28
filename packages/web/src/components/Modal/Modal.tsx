import React, { FC, cloneElement, useState } from 'react';
import { Modal as AntModal, Button } from 'antd';
interface ModalProps {
  title: string;
  cancelHandler: () => void;
}
const Modal: FC<ModalProps> = ({ title, cancelHandler, children }) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  return (
    <AntModal
      title={title}
      visible={true}
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
