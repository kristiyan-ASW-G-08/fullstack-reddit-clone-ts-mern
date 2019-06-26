import React, { FC, lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Loader from './Loader';
import Navbar from './Navbar/Navbar';
import Modal from './Modal/Modal';
import { observer } from 'mobx-react-lite';
import RootStoreContext from '../stores/RootStore/RootStore';
import { Modal as ModalC } from 'antd';
const SignUpFormModal = React.lazy(() =>
  import('./SignUpForm/SignUpFormModal'),
);

const Router: FC = observer(
  (): JSX.Element => {
    const { authStore, themeStore, modalStore } = useContext(RootStoreContext);
    const loginModalHandler = () => {};
    const signUpModalHandler = () => {};
    return (
      <BrowserRouter>
        <>
          <Navbar
            authState={authStore.authState}
            theme={themeStore.theme}
            toggleTheme={() => themeStore.toggleTheme()}
            loginModalHandler={() => loginModalHandler()}
            signUpModalHandler={() => signUpModalHandler()}
          />
          <Route
            path="/signUp"
            render={(props): JSX.Element => (
              <Suspense fallback={<Loader />}>
                <SignUpFormModal />
              </Suspense>
            )}
          />
          <Route />
          <Switch />
        </>
      </BrowserRouter>
    );
  },
);

export default Router;
