import { FC } from 'react';
import { createContext } from 'react';
import { observable, action } from 'mobx';
import ModalState from '../../types/ModalState';
import defaultModalState from './defaultModalState';
class ModalStore {
  @observable public modalState: ModalState = {
    visible: false,
    title: '',
    type: '',
  };
  @action public setModalState(
    title: string,
    type: 'signUp' | 'login' | '',
  ): void {
    console.log(this);
    console.log(title, type);
    this.modalState.title = title;
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
