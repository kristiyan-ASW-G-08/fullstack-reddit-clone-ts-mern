import React, { useEffect, useContext } from 'react';
import './App.css';
import RootStoreContext from 'stores/RootStore/RootStore';
import Router from './components/Router';
import { observer } from 'mobx-react-lite';
const App: React.FC = observer(() => {
  const { authStore } = useContext(RootStoreContext);
  useEffect(() => {
    const { expiryDate } = authStore.authState;
    if (expiryDate) {
      if (new Date(expiryDate).getTime() <= new Date().getTime()) {
        authStore.resetAuthState();
      }
    }
  }, []);
  return <Router />;
});

export default App;
