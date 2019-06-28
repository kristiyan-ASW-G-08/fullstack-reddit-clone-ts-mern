import { createContext } from 'react';
import { observable, action } from 'mobx';
import ModalState from '../../types/ModalState';
import defaultModalState from './defaultModalState';
class ModalStore {
  @observable public modalState: ModalState = {
    visible: false,
    type: '',
  };
  @action public setModalState(
    type: 'signUp' | 'login' | 'message' | '',
  ): void {
    this.modalState.type = type;
    this.modalState.visible = true;
  }
  @action public resetModalState(): void {
    this.modalState = defaultModalState;
  }
}

const ModalStoreContext = createContext(new ModalStore());
export { ModalStoreContext };
export default ModalStore;
