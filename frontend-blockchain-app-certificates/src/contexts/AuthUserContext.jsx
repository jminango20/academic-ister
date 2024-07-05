import React, { useState, useEffect, createContext, useContext } from 'react';
import Web3 from 'web3';

const AuthUserContext = createContext();

export const useAuthUser = () => {
    return useContext(AuthUserContext);
  };

const AuthUserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ethWallet, setEthWallet] = useState(null);
  const [userAcc, setUserAcc] = useState(null);
  const [connectError, setConnectError] = useState(null);

  const contextValue = {
    authenticated: loggedIn,
    ethWallet: ethWallet,
    userAcc: userAcc,
    connectionErr: connectError,
    mmLogin: connectWallet,
    mmLogout: disconnect
  };

  // Check if MetaMask is installed
  async function checkWalletConnection() {
    const ethereum = window.ethereum;
    setEthWallet(ethereum ? true : false);

    // If installed, get user's accounts.
    if (ethereum) {
        const web3 = new Web3(ethereum);
        const userAcc = await web3.eth.getAccounts();
        console.log(userAcc);
      if (userAcc.length > 0) {
        setUserAcc(userAcc[0]);
        setLoggedIn(true);
      } else {
        if (loggedIn) {
          setUserAcc(null);
          setLoggedIn(false);
        }
      }
    }
  }

  // Connect to MetaMask wallet
  async function connectWallet() {
    try {
      // If MetaMask is not installed, throw error.
      if (!ethWallet) {
        const errMsg = "Por favor instala metamask en tu navegador (https://metamask.io/download/)";
        setConnectError(errMsg);
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setLoggedIn(true);

      // Reset error
      if (connectError !== null) { setConnectError(null); }

      window.location.reload(false);
      return;
    } catch (error) {
      setConnectError(error.message);
      console.error(error);
      return;
    }
  }

  // Función para desconectar de MetaMask
  async function disconnect() {
    try {
      const ethereum = window.ethereum;
      if (ethereum) {
        await ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
        setUserAcc(null);
        setLoggedIn(false);
        setConnectError(null);
      }
    } catch (error) {
      console.error('Error al desconectar de MetaMask:', error);
      setConnectError(error.message);
    }
  }

  useEffect(() => {
    if (ethWallet === null) { checkWalletConnection(); }
  }, [ethWallet]);

  return (
    <AuthUserContext.Provider value={contextValue}>
      {children}
    </AuthUserContext.Provider>
  );
};

export default AuthUserProvider;
