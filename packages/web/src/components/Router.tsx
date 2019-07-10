import React, { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import Loader from 'components/Loader';
import Navbar from 'components/Navbar/Navbar';
import ModalsContainer from 'components/ModalsContainer/ModalsContainer';
import ProtectedRoute from './ProtectedRoute';
import Home from 'components/Home/Home';
const EmailConfirmationModal = lazy(() =>
  import('components/EmailConfirmationModal/EmailConfirmationModal'),
);
const CommunityPage = lazy(() =>
  import('components/Community/CommunityPage/CommunityPage'),
);
const PostFormPage = lazy(() =>
  import('components/Post/PostForm/PostFormPage'),
);
const ModTools = lazy(() => import('components/Community/ModTools/ModTools'));
const Router: FC = (): JSX.Element => {
  return (
    <BrowserRouter>
      <>
        <Navbar />
        <ModalsContainer />
        <Switch>
          <Route exact path="/" component={Home} />
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
          <ProtectedRoute
            path={'/communities/:communityId/posts'}
            Component={PostFormPage}
          />
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default Router;
