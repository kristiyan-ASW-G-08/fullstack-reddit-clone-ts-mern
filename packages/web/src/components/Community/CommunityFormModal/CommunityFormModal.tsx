import React, { FC } from 'react';
import Modal from '../../Modal/Modal';
import CommunityForm from './CommunityForm';
import { observer } from 'mobx-react-lite';
interface CommunityFormModalProps {
  resetModalState: () => void;
}
const CommunityFormModal: FC<CommunityFormModalProps> = observer(
  ({ resetModalState }) => {
    return (
      <Modal title={'Create New Community'} cancelHandler={resetModalState}>
        <CommunityForm />
      </Modal>
    );
  },
);
export default CommunityFormModal;
