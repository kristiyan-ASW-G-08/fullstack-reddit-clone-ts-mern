import React, { FC } from 'react';
import Modal from '../Modal/Modal';
import LoginForm from './LoginForm';
import { observer } from 'mobx-react-lite';
interface LoginFormModalProps {
  resetModalState: () => void;
}
const LoginFormModal: FC<LoginFormModalProps> = observer(
  ({ resetModalState }) => {
    return (
      <Modal title={'Log In'} cancelHandler={resetModalState} visible={true}>
        <LoginForm />
      </Modal>
    );
  },
);
export default LoginFormModal;
