import React, { FunctionComponent } from 'react';
import ModalStore from './ModalStore';
import defaultModalState from './defaultModalState';
const TestComponent: FunctionComponent = () => (
  <div className="test-component">Test</div>
);
describe('ModalStore', (): void => {
  const modalStore = new ModalStore();
  const title = 'Title';
  it('should be default', (): void => {
    expect(modalStore.modalState).toEqual(defaultModalState);
  });
  it('setModalState', (): void => {
    modalStore.setModalState(TestComponent, title);
    expect(modalStore.modalState.title).toEqual(title);
    expect(modalStore.modalState.Component).toEqual(TestComponent);
  });
  it('resetAuthState', (): void => {
    modalStore.resetModalState();
    expect(modalStore.modalState).toEqual(defaultModalState);
  });
});
