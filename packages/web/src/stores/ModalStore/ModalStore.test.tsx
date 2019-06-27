import React, { FunctionComponent } from 'react';
import ModalStore from './ModalStore';
import defaultModalState from './defaultModalState';

describe('ModalStore', (): void => {
  const modalStore = new ModalStore();
  it('should be default', (): void => {
    expect(modalStore.modalState).toEqual(defaultModalState);
  });
  it('setModalState', (): void => {
    const type = 'signUp';
    modalStore.setModalState(type);
    expect(modalStore.modalState.type).toEqual(type);
  });
  it('resetAuthState', (): void => {
    modalStore.resetModalState();
    expect(modalStore.modalState).toEqual(defaultModalState);
  });
});
