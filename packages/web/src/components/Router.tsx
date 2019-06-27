import React, { FC, lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Loader from './Loader';
import Navbar from './Navbar/Navbar';
import Modal from './Modal/Modal';
import { observer } from 'mobx-react-lite';
import RootStoreContext from '../stores/RootStore/RootStore';
import { Modal as ModalC } from 'antd';
import ModalsContainer from './ModalsContainer/ModalsContainer';
const Router: FC = observer(
  (): JSX.Element => {
    const { authStore, themeStore, modalStore } = useContext(RootStoreContext);
    return (
      <BrowserRouter>
        <>
          <Navbar
            authState={authStore.authState}
            theme={themeStore.theme}
            toggleTheme={() => themeStore.toggleTheme()}
            loginModalHandler={() => modalStore.setModalState('login')}
            signUpModalHandler={() => modalStore.setModalState('signUp')}
          />
          <ModalsContainer modalState={modalStore.modalState} />
          <Route />
          <Switch />
        </>
      </BrowserRouter>
    );
  },
);

export default Router;
