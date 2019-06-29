import React, { FC, lazy, Suspense, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Loader from '../Loader';
import RootStoreContext from '../../stores/RootStore/RootStore';
const SignUpFormModal = lazy(() => import('../SignUpForm/SignUpFormModal'));
const LoginFormModal = lazy(() => import('../LoginForm/LoginFormModal'));
const CommunityFormModal = lazy(() =>
  import('../Community/CommunityFormModal/CommunityFormModal'),
);
const ModalsContainer: FC = observer(() => {
  const { modalStore } = useContext(RootStoreContext);
  const { modalState } = modalStore;
  return (
    <>
      {modalState.type === 'signUp' ? (
        <Suspense fallback={<Loader />}>
          {' '}
          <SignUpFormModal
            resetModalState={() => modalStore.resetModalState()}
          />
        </Suspense>
      ) : (
        ''
      )}
      {modalState.type === 'login' ? (
        <Suspense fallback={<Loader />}>
          {' '}
          <LoginFormModal
            resetModalState={() => modalStore.resetModalState()}
          />
        </Suspense>
      ) : (
        ''
      )}
      {modalState.type === 'community' ? (
        <Suspense fallback={<Loader />}>
          {' '}
          <CommunityFormModal
            resetModalState={() => modalStore.resetModalState()}
          />
        </Suspense>
      ) : (
        ''
      )}
    </>
  );
});

export default ModalsContainer;
