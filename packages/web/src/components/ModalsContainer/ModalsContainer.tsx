import React, { FC, lazy, Suspense, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Loader from '../Loader';
import RootStoreContext from '../../stores/RootStore/RootStore';
const SignUpFormModal = lazy(() => import('../SignUpForm/SignUpFormModal'));
const LoginFormModal = lazy(() => import('../LoginForm/LoginFormModal'));
const ModalsContainer: FC = observer(() => {
  const { modalStore } = useContext(RootStoreContext);
  const { modalState } = modalStore;
  const modals: any = {
    signUp: (
      <SignUpFormModal resetModalState={() => modalStore.resetModalState()} />
    ),
    login: (
      <LoginFormModal resetModalState={() => modalStore.resetModalState()} />
    ),
  };
  return (
    <>
      {modalState.visible && modals[modalState.type] ? (
        <Suspense fallback={<Loader />}> {modals[modalState.type]}</Suspense>
      ) : null}
    </>
  );
});

export default ModalsContainer;
