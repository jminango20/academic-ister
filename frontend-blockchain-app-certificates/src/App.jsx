import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Header from './components/common/Header';
import ConnectMetaMask from './components/pages/ConnectWallet';
import MainPage from './components/pages/MainPage';
import Main2 from './components/pages/Main';
import { useUserHash } from './contexts/UserHashContext';
import './App.css'
import Home from './components/pages/Home';

const App = () => {
  const { userHash } = useUserHash();

  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={userHash ? <Navigate to="/main" /> : <ConnectMetaMask />} />
        <Route path="/main" element={userHash ? <Home /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
