import { FC } from 'react';
export default interface ModalState {
  visible: boolean;
  type: 'signUp' | 'login' | 'message' | '';
}
