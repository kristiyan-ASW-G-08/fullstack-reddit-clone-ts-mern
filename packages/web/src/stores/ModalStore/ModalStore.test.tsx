import React, { FunctionComponent } from 'react';
import ModalStore from './ModalStore';
import defaultModalState from './defaultModalState';

describe('ModalStore', (): void => {
  const modalStore = new ModalStore();
  const title = 'Title';
  it('should be default', (): void => {
    expect(modalStore.modalState).toEqual(defaultModalState);
  });
  it('setModalState', (): void => {
    modalStore.setModalState(title);
    expect(modalStore.modalState.title).toEqual(title);
  });
  it('resetAuthState', (): void => {
    modalStore.resetModalState();
    expect(modalStore.modalState).toEqual(defaultModalState);
  });
});
