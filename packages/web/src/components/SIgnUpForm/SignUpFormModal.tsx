import React, { FC } from 'react';
import Modal from '../Modal/Modal';
import SignUpForm from './SignUpForm';
import { observer } from 'mobx-react-lite';
interface SignUpFormModalProps {
  resetModalState: () => void;
}
const SignUpFormModal: FC<SignUpFormModalProps> = observer(
  ({ resetModalState }) => {
    return (
      <Modal title={'Sign Up'} cancelHandler={resetModalState} visible={true}>
        <SignUpForm />
      </Modal>
    );
  },
);

export default SignUpFormModal;
