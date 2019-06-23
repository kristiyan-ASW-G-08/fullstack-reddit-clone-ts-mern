import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { observer } from 'mobx-react-lite';
import { ThemeStoreContext } from './stores/ThemeStore/ThemeStore';
const App: React.FC = observer(() => {
  const themeStore = useContext(ThemeStoreContext);
  return (
    <div className="App">
      <Navbar
        theme={themeStore.theme}
        toggleTheme={() => themeStore.toggleTheme()}
      />
    </div>
  );
});

export default App;
