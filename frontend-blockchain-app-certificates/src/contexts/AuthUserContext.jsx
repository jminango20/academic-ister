import React, { useState, useEffect, createContext, useContext } from 'react';
import Web3, { Contract } from 'web3';
import { loadAcademicCertificateI_ABI } from '@smartContract';

const AuthUserContext = createContext();

export const useAuthUser = () => {
    return useContext(AuthUserContext);
  };

const AuthUserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ethWallet, setEthWallet] = useState(null);
  const [userAcc, setUserAcc] = useState(null);
  const [connectError, setConnectError] = useState(null);

  //SMART CONTRACTS VARIABLES
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  const contextValue = {
    authenticated: loggedIn,
    ethWallet: ethWallet,
    userAcc: userAcc,
    connectionErr: connectError,
    mmLogin: connectWallet,
    mmLogout: disconnect,
    callContractMethod: callContractMethod,
    loadContract: loadContract
  };

  //USE EFFECT SECTION
  useEffect(() => {
    if (ethWallet === null) { checkWalletConnection(); }
  }, [ethWallet]);

  useEffect(() => {
    if (contract != null) {
      console.log("Contrato actualizado:", contract);
    }
  }, [contract])
  

  // Check if MetaMask is installed

  async function checkWalletConnection() {
    const ethereum = window.ethereum;
    setEthWallet(ethereum);
    // If installed, get user's accounts.
    if (ethereum) {
        // const web3Instance  = new Web3("https://polygon-amoy.g.alchemy.com/v2/WDCCKqD3vamJDfoX2mJy64294wcs1bWk");
        const web3Instance  = new Web3(ethereum);
        setWeb3(web3Instance);
        const userAcc = await web3Instance.eth.getAccounts();

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
        return true;
      }

      await ethWallet.request({ method: 'eth_requestAccounts' });
      setLoggedIn(true);

      // Reset error
      if (connectError !== null) { setConnectError(null); }

      window.location.reload(false);
      return true;
    } catch (error) {
      setConnectError(error.message);
      console.error("Error metamask:", error);
      return false;
    }
  }

  // Función para desconectar de MetaMask
  async function disconnect() {
    try {
      // const ethereum = window.ethereum;
      if (ethWallet) {
        await ethWallet.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
        setUserAcc(null);
        setLoggedIn(false);
        setConnectError(null);
      }
    } catch (error) {
      console.error('Error al desconectar de MetaMask:', error);
      setConnectError(error.message);
    }
  }

  async function loadContract(contractAddress) {
    if (!web3) return;

    const abi = await loadAcademicCertificateI_ABI();
    const contractInstance = new web3.eth.Contract(abi, contractAddress);
    setContract(contractInstance);
    return contractInstance;
  }

  async function getGasFees() {
    const latestBlock = await web3.eth.getBlock("latest");
    const baseFeePerGas = latestBlock.baseFeePerGas;
    const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei');

    const maxFeePerGas = new web3.utils.toBN(baseFeePerGas).add(new web3.utils.BN(maxPriorityFeePerGas));

    return {
      maxPriorityFeePerGas: web3.utils.toHex(maxPriorityFeePerGas),
      maxFeePerGas: web3.utils.toHex(maxFeePerGas)
    };
  }

  async function GetRecipt_tx(tx_hash){
    // Esperar a que la transacción sea minada
    let receipt = null;
    while (receipt == null) {
      try {
        console.log('Esperando la confirmación de la transacción...');
        receipt = await web3.eth.getTransactionReceipt(tx_hash);
        console.log(receipt);
        if (receipt == null) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos antes de volver a comprobar
        }
      } catch (error) {
        console.error('Error al obtener el recibo de la transacción:', error);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos antes de volver a comprobar en caso de error
      }
    }
    return receipt;
  }

  async function getTransactionTimestamp(tx_hash) {
    const receipt = await GetRecipt_tx(tx_hash);
    if (!receipt) {
        throw new Error('No se pudo obtener el recibo de la transacción');
    }

    const block = await web3.eth.getBlock(receipt.blockNumber);
    const timestamp = block.timestamp;

    return {
        receipt,
        timestamp
    };
}

  async function callContractMethod(contractAddress, methodName, params, isReadOnly = false) {
    
    let contract_local;
    
    if (!contract || contract.options.address !== contractAddress) {
      contract_local = await loadContract(contractAddress);
    } 
    // throw new Error('Contract or user account not initialized');

    try {
      const method = contract_local.methods[methodName](...params);
      if (isReadOnly) {
        const result = await method.call({ from: userAcc });
        return result;
      } else {
        const gasEstimate = await method.estimateGas({ from: userAcc });


        const transactionParameters = {
          from: userAcc,
          to: contract_local.options.address,
          gas: web3.utils.toHex(gasEstimate),
          // maxPriorityFeePerGas, //Optional
          // maxFeePerGas,  //Optional
          data: method.encodeABI(),
        };

        console.log("TX PARAMS:", transactionParameters);

        const txHash  = await ethWallet.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
        // Esperar a que la transacción sea minada
        const { receipt, timestamp } = await getTransactionTimestamp(txHash);

        const tx_hash = receipt.transactionHash;

        // const event = receipt.events.find(event => event.event === 'CertificateMinted');
        const events = await contract_local.getPastEvents('CertificateMinted', {
          fromBlock: receipt.blockNumber,
          toBlock: receipt.blockNumber,
        });
        if (events.length === 0) {
            throw new Error('CertificateMinted event not found in transaction receipt');
        }
        
        const event = events[0];
        
        // const tokenId = event.args.tokenId.toString();
        if (!event || !event.returnValues || !event.returnValues.tokenId) {
            throw new Error('Failed to obtain tokenId from transaction receipt');
        }

        const tokenId = event.returnValues.tokenId.toString();

        return {tx_hash, tokenId, timestamp: timestamp.toString()};
      }
    } catch (error) {
      throw new Error(`Error executing contract method: ${error.message}`);
    }
  }


  return (
    <AuthUserContext.Provider value={contextValue}>
      {children}
    </AuthUserContext.Provider>
  );
};

export default AuthUserProvider;
