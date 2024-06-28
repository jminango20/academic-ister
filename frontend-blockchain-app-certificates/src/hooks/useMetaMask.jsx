import { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

export const useMetaMask = () => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    const detectProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setIsMetaMaskInstalled(true);
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        window.ethereum.on('accountsChanged', handleAccountsChanged);
      } else {
        console.error('MetaMask is not installed.');
      }
    };

    detectProvider();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask is not installed.');
    }
  };

  return { account, connectMetaMask, isMetaMaskInstalled };
};
