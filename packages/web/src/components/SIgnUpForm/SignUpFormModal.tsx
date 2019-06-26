import React, { FC } from 'react';
import Modal from '../Modal/Modal';
import SignUpForm from './SignUpForm';
const SignUpFormModal: FC = () => {
  return (
    <Modal>
      <SignUpForm />
    </Modal>
  );
};

export default SignUpFormModal;
