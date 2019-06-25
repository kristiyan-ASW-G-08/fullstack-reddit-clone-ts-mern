import React, { FC, lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Loader from './Loader';
import Navbar from './Navbar/Navbar';
import Modal from './Modal/Modal';
import { observer } from 'mobx-react-lite';
import RootStoreContext from '../stores/RootStore/RootStore';
const Router: FC = observer(
  (): JSX.Element => {
    const { authStore, themeStore, modalStore } = useContext(RootStoreContext);
    const { isAuth } = authStore.authState;
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
          {/* <Modal /> */}
          <Switch />
        </>
      </BrowserRouter>
    );
  },
);

export default Router;
