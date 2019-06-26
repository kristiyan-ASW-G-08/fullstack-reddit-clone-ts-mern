import React, { FC, lazy, Suspense } from 'react';
import { Modal } from 'antd';
import ModalState from '../../types/ModalState';
import Loader from '../Loader';
import { observer } from 'mobx-react-lite';
// interface ModalComponentProps {
//   modalState: ModalState;
//   resetModalState: () => void;
// }
const ModalComponent: FC = observer(({ children }) => {
  return (
    <Modal title={'Title'} visible={true} onCancel={() => {}} footer={[]}>
      {children}
    </Modal>
  );
});

export default ModalComponent;
