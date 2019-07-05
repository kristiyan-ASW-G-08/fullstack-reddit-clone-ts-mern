import React, { FC, lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Loader from 'components/Loader';
import Navbar from 'components/Navbar/Navbar';
import { observer } from 'mobx-react-lite';
import ModalsContainer from 'components/ModalsContainer/ModalsContainer';
import ProtectedRoute from './ProtectedRoute';
import RootStoreContext from 'stores/RootStore/RootStore';
const EmailConfirmationModal = lazy(() =>
  import('components/EmailConfirmationModal/EmailConfirmationModal'),
);
const CommunityPage = lazy(() =>
  import('components/Community/CommunityPage/CommunityPage'),
);
const ModTools = lazy(() => import('components/Community/ModTools/ModTools'));
const Router: FC = observer(
  (): JSX.Element => {
    const { expiryDate } = useContext(RootStoreContext).authStore.authState;
    if (expiryDate) {
      if (new Date(expiryDate) <= new Date()) {
        localStorage.removeItem('authStore');
      }
    }
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
            <Route
              exact
              path="/communities/:communityId"
              render={(props): JSX.Element => (
                <Suspense fallback={<Loader />}>
                  <CommunityPage {...props} />
                </Suspense>
              )}
            />
            <ProtectedRoute
              path={'/communities/:communityId/mod'}
              Component={ModTools}
            />
          </Switch>
        </>
      </BrowserRouter>
    );
  },
);

export default Router;
