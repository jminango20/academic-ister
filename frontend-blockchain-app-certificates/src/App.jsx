import { useState, useEffect, createContext,React} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Header from './components/common/Header';
import { useUserHash } from './contexts/UserHashContext';
import './App.css'
import ConnectMetaMask from '@pages/ConnectWallet';
import Home from '@pages/Home';
import Web3 from 'web3';

const App = () => {
  const { userHash } = useUserHash();

  const web3 = new Web3(Web3.givenProvider);

  const [loggedIn, setLoggedIn] = useState(false);
  const [ethWallet, setEthWallet] = useState(null);
  const [userAcc, setUserAcc] = useState(null);
  const [connectError, setConnectError] = useState(null);
  
  const contextVal = {
    authenticated: loggedIn,
    ethWallet: ethWallet,
    userAcc: userAcc,
    connectionErr: connectError,
    mmLogin: connectWallet
  };

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
