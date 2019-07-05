import { createContext } from 'react';
import { observable, action } from 'mobx';
import ModalState from 'types/ModalState';
import defaultModalState from './defaultModalState';
class ModalStore {
  @observable public modalState: ModalState = {
    type: '',
  };
  @action public setModalState(
    type: 'signUp' | 'login' | 'community' | 'rule' | '',
  ): void {
    this.modalState.type = type;
  }
  @action public resetModalState(): void {
    this.modalState = defaultModalState;
  }
}

const ModalStoreContext = createContext(new ModalStore());
export { ModalStoreContext };
export default ModalStore;
