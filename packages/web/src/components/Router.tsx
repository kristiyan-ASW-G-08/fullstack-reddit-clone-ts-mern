import React, { FC, lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Loader from './Loader';
import Navbar from './Navbar/Navbar';
import { observer } from 'mobx-react-lite';
import ModalsContainer from './ModalsContainer/ModalsContainer';
import EmailConfirmationModal from './EmailConfirmationModal/EmailConfirmationModal';
const Router: FC = observer(
  (): JSX.Element => {
    return (
      <BrowserRouter>
        <>
          <Navbar />
          <ModalsContainer />
          <Switch>
            <Route
              exact
              path="/confirmation/:token"
              render={(props): JSX.Element => (
                <Suspense fallback={<Loader />}>
                  <EmailConfirmationModal {...props} />
                </Suspense>
              )}
            />
          </Switch>
        </>
      </BrowserRouter>
    );
  },
);

export default Router;
