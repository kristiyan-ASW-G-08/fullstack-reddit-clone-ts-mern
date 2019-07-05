import React, { FC, Suspense, useContext } from 'react';
import { Route } from 'react-router-dom';
import Loader from './Loader';
import { observer } from 'mobx-react-lite';
import RootStoreContext from 'stores/RootStore/RootStore';
interface ProtectedRouteProps {
  Component: React.LazyExoticComponent<React.FunctionComponent<any>>;
  path: string;
}
const ProtectedRoute: FC<ProtectedRouteProps> = observer(
  ({ Component, ...rest }): JSX.Element => {
    const { authStore, modalStore } = useContext(RootStoreContext);
    const { isAuth } = authStore.authState;
    return (
      <Route
        {...rest}
        render={props => {
          if (isAuth) {
            modalStore.resetModalState();
            return (
              <Suspense fallback={<Loader />}>
                <Component {...props} />
              </Suspense>
            );
          } else {
            modalStore.setModalState('login');
          }
        }}
      />
    );
  },
);

export default ProtectedRoute;
