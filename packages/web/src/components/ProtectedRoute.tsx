import React, { FC, Suspense, useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Loader from './Loader';
interface ProtectedRouteProps {
  Component: FC;
  path: string;
  isAuth: boolean;
}
const ProtectedRoute: FC<ProtectedRouteProps> = ({
  Component,
  isAuth,
  ...rest
}): JSX.Element => {
  return (
    <Route
      {...rest}
      render={(props): JSX.Element => {
        if (isAuth) {
          return (
            <Suspense fallback={<Loader />}>
              <Component />
            </Suspense>
          );
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
