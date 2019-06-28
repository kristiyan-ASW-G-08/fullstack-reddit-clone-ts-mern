import React, { FC, lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Loader from './Loader';
import Navbar from './Navbar/Navbar';
import { observer } from 'mobx-react-lite';
import RootStoreContext from '../stores/RootStore/RootStore';
import ModalsContainer from './ModalsContainer/ModalsContainer';
const Router: FC = observer(
  (): JSX.Element => {
    return (
      <BrowserRouter>
        <>
          <Navbar />
          <ModalsContainer />
          <Switch />
        </>
      </BrowserRouter>
    );
  },
);

export default Router;
