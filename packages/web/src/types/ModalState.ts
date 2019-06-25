import { FC } from 'react';
export default interface ModalState {
  visible: boolean;
  title: string;
  Component: FC | null;
}
