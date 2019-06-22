import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar/Navbar';
const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar theme={'light'} />
    </div>
  );
};

export default App;
