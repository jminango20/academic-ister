import React, { createContext, useContext, useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

const UserHashContext = createContext();

export const useUserHash = () => {
  return useContext(UserHashContext);
};

export const UserHashProvider = ({ children }) => {
  const [userHash, setUserHash] = useState('');
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const checkMetaMask = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setUserHash(accounts[0]);
          setAccount(accounts[0]);
        }
      }
    };
    checkMetaMask();
  }, []);

  const disconnectMetaMask = () => {
    setUserHash('');
    setAccount(null);
    // Add más lógica si necesitas limpiar otros estados o realizar acciones adicionales al desconectar
  };

  return (
    <UserHashContext.Provider value={{ userHash, setUserHash, account, setAccount, disconnectMetaMask }}>
      {children}
    </UserHashContext.Provider>
  );
};
