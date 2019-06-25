import { FC } from 'react';
import { createContext } from 'react';
import { observable, action } from 'mobx';
import ModalState from '../../types/ModalState';
import defaultModalState from './defaultModalState';
class ModalStore {
  @observable public modalState: ModalState = {
    visible: false,
    Component: null,
    title: '',
  };
  @action public setModalState(Component: FC | null, title: string): void {
    this.modalState.Component = Component;
    this.modalState.title = title;
    this.modalState.visible = true;
  }
  @action public resetModalState(): void {
    this.modalState = defaultModalState;
  }
}

const ModalStoreContext = createContext(new ModalStore());
export { ModalStoreContext };
export default ModalStore;
