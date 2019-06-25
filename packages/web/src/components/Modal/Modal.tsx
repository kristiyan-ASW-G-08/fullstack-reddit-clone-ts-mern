import React from 'react';
import { Modal } from 'antd';
interface ModalComponentProps {
  visible: boolean;
  title: string;
  resetModalState: () => void;
}
const ModalComponent: React.FC<ModalComponentProps> = ({
  title,
  resetModalState,
  visible,
  children,
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={resetModalState}
      footer={[]}
    >
      <p>{children}</p>
    </Modal>
  );
};

export default ModalComponent;
