import React, { FC, lazy, Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import ModalState from '../../types/ModalState';
import Loader from '../Loader';
const SignUpFormModal = lazy(() => import('../SignUpForm/SignUpFormModal'));
interface ModalContainerProps {
  modalState: ModalState;
}
const ModalsContainer: FC<ModalContainerProps> = observer(({ modalState }) => {
  const modals: any = {
    signUp: <SignUpFormModal />,
  };
  return (
    <>
      {modalState.visible ? (
        <Suspense fallback={<Loader />}> {modals[modalState.type]}</Suspense>
      ) : null}
    </>
  );
});

export default ModalsContainer;
