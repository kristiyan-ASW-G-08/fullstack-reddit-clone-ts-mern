import { FC } from 'react';
export default interface ModalState {
  visible: boolean;
  title: string;
  type: 'signUp' | 'login' | '';
}
