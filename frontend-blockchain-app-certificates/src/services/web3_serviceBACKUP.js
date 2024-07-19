// ref: https://medium.com/@erinlim555/building-a-web3-app-with-react-f85843db2f47
// ref: https://github.com/Limerin555/react_web3

import Web3 from 'web3';
import { ethers } from 'ethers';
import {loadAcademicCertificateI_ABI} from '@smartContract'

// Variable global para almacenar la instancia del contrato
let academicContract;
let web3;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const rpcUrl = 'https://polygon-amoy.drpc.org';
// let signer;
// const contractAddress = process.env.VITE_CONTRACT_ADDRESS_ACADEMIC_ISTER;

export const callContractCreateCertificate = async (account, contractHash, contractData) => {
  try {
    // Send the transaction
      await initWeb3();

      academicContract = new web3.eth.Contract(abi, contractHash, { from: account });
      const estimatedGas = await academicContract.estimateGas.issueCertificate(contractData.name, contractData.documentIdentification, contractData.course, contractData.description);
      console.log('Estimated Gas:', ethers.utils.formatEther(estimatedGas));
  //   const transaction = await contract.methods.yourContractFunction().send({ from: account });
      const transaction = await contract.methods.issueCertificate(contractData.name, contractData.documentIdentification, contractData.course, contractData.description).send({
          from: account,
          gas: gasEstimate,
          gasPrice: web3.utils.toWei('100', 'gwei')

  });

    // Get the transaction hash from the receipt
    const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);

    const txHash = receipt.transactionHash;
    console.log("SUCCESSFUL TRANSACTION")
    console.log('Transaction hash:', transaction.transactionHash);

    alert(`Function call is successful.\n\nTransaction Hash: ${txHash}`);
  } catch (error) {
    console.error('Error calling contract function:', error);
  }
};


async function initWeb3() {
  // Modern dapp browsers
  if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
          // Request account access if needed
          await window.ethereum.enable();
      } catch (error) {
          throw new Error('User denied account access');
      }
  }
  // Legacy dapp browsers
  else if (window.web3) {
      web3 = new Web3(web3.currentProvider);
  }
  // Non-dapp browsers
  else {
      throw new Error('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
}

// Function to load ABI and initialize contract
async function init(contractHash, account) {
    try {
      await initWeb3(); 

      const abi = await loadAcademicCertificateI_ABI(); // Load ABI from your JSON file
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed or not connected.');
      }

      // provider = new ethers.BrowserProvider(window.ethereum)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();

      // Initialize contract instance using ethers.js
      academicContract = new web3.eth.Contract(abi, contractHash, { from: account }); // Use ethereum provider from MetaMask
  
      // console.log('Contract instance created:', academicContract);
      // displayContractMethods(contractHash);
    } catch (error) {
      console.error('Error during initialization:', error);
      throw error;
    }
  }

async function checkMetaMaskConnection() {
    if (!window.ethereum || !ethereum.isConnected()) {
        throw new Error('MetaMask is not installed or not connected.');
    }
}

async function displayContractMethods(contractHash) {
    try {
      await checkMetaMaskConnection(); // Verificar si MetaMask está conectado
  
      if (!academicContract) {
        await init(contractHash); // Inicializar contrato si no lo está
      }
  
      // Mostrar los métodos disponibles
      console.log('Métodos disponibles en el contrato:');
      academicContract.interface.fragments.forEach(func => {
        if (func.name === "issueCertificate") {
          console.log(`Nombre: ${func.name}`);
          console.log(`Inputs: ${JSON.stringify(func.inputs)}`);
          console.log(`Outputs: ${JSON.stringify(func.outputs)}`);
          console.log('----------------------------------');
        }
      });
    } catch (error) {
      console.error('Error al mostrar métodos del contrato:', error);
      throw error;
    }
  }
  

export const callContractCreateCertificate_BAKNEW = async (account, contractHash, contractData) => {
    try {
        await checkMetaMaskConnection();

        if (!academicContract) {
            await init(contractHash);
          }
        // Comprobación de la conexión de MetaMask
        if (!window.ethereum) {
            throw new Error('MetaMask no está instalado o no se ha conectado.');
        }
        console.log("INIT CALL");

        const chainId = await ethereum.request({ method: 'eth_chainId' });
        console.log("Red actual:", Number(chainId));

        // const desiredChainId = 80002; // AMOY TESTNET
        
        // // Verificar si la red actual es la red deseada
        // if (Number(chainId) !== desiredChainId) {
        //     throw new Error(`Por favor, conecta MetaMask a la red correcta. Se requiere Chain ID: ${desiredChainId}`);
        // }
    
        const userAccount = account;
        // displayContractMethods(contractHash);
        // Crear instancia del contrato usando la dirección y Web3
        // const contractInstance = new web3.eth.Contract(academicCertificateI_abi, contractHash);

        // Estimate gas required
        console.log("Estimating gas...");
        const gasEstimate = await academicContract.methods.issueCertificate(
            contractData.name,
            contractData.documentIdentification,
            contractData.course,
            contractData.description
        ).estimateGas();

        console.log('Estimated Gas:', gasEstimate);


        try {
            const estimateGas = academicContract.estimateGas["issueCertificate(string,string,string,string)"](
              contractData.name,
              contractData.documentIdentification,
              contractData.course,
              contractData.description
            );
            console.log('Estimated Gas:', ethers.utils.formatEther(estimateGas));
            // const estimatedGas = await academicContract.issueCertificate.estimateGas(
            //     contractData.name,
            //     contractData.documentIdentification,
            //     contractData.course,
            //     contractData.description
            // );

            // console.log('Estimated Gas:', ethers.utils.formatEther(estimatedGas));
        } catch (error) {
            console.error('Error al estimar el gas:', error);
            throw new Error(`Error al estimar el gas: ${error.message}`);
        }
        // console.log('Estimated Gas:', ethers.utils.formatEther(gasEstimate));
        // Llamar a la función del contrato para emitir un certificado
        const txResponse = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: userAccount,
              to: contractHash,
              gas: estimatedGas.toHexString(), // Convert gas estimate to string
              data: academicContract.interface.encodeFunctionData('issueCertificate', [
                contractData.name,
                contractData.documentIdentification,
                contractData.course,
                contractData.description
              ])
            }]
          });

        console.log("SUCCESSFUL TRANSACTION")
        console.log('Transaction sent:', txResponse);

        // Wait for transaction receipt
        const receipt = await txResponse.wait();
        console.log('Transaction hash:', receipt.transactionHash);

        // const event = receipt.events.find(event => event.event === 'CertificateMinted');
        const events = await academicContract.getPastEvents('CertificateMinted', {
            fromBlock: receipt.blockNumber,
            toBlock: receipt.blockNumber,
        });
        if (events.length === 0) {
            throw new Error('CertificateMinted event not found in transaction receipt');
        }
        console.log(events);
        const event = events[0];
        console.log(event);
        
        // const tokenId = event.args.tokenId.toString();
        if (!event || !event.returnValues || !event.returnValues.tokenId) {
            throw new Error('Failed to obtain tokenId from transaction receipt');
        }

        const tokenId = event.returnValues.tokenId.toString();
        const txHash = receipt.transactionHash;
        console.log("TKID:", tokenId);
        console.log("TX HASH:", txHash);
        
        if (!tokenId) {
            throw new Error('Failed to obtain tokenId from transaction receipt');
        }
            
        return [tokenId, txHash];
        
    } catch (error) {
        throw new Error(`Error al crear el certificado: ${error.message}`);
    }
  };

export const callContractCreateCertificate_BAK = async (account, contractHash, contractData) => {
  try {
      // Comprobación de la conexión de MetaMask
      if (!window.ethereum) {
          throw new Error('MetaMask no está instalado o no se ha conectado.');
      }
      console.log("INIT CALL");
      
      // Conectar a MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Obtener el ID de la red actual
      const chainId = await signer.getChainId();
      console.log("Red actual:", Number(chainId));

      const desiredChainId = 80001; // Polygon Testnet Mumbai
      
      // Verificar si la red actual es la red deseada
      if (Number(chainId) !== desiredChainId) {
          throw new Error(`Por favor, conecta MetaMask a la red correcta. Se requiere Chain ID: ${desiredChainId}`);
      }

      // Crear instancia del contrato usando ethers.js
      const contractInstance = new ethers.Contract(contractHash, loadAcademicCertificateI_ABI, signer);

      console.log("contractInstance", contractInstance);
      console.log("contractHash:", contractHash);
      const methods = Object.keys(contractInstance.functions);
      console.log("Métodos disponibles:", methods);

      console.log("Inicio de estimación de gas");
      let estimatedGas;
      try {
          estimatedGas = await contractInstance.estimateGas.issueCertificate(
              contractData.name, 
              contractData.documentIdentification, 
              contractData.course, 
              contractData.description
          );
          console.log('Gas estimado:', estimatedGas.toString());
      } catch (error) {
          console.error('Error al estimar el gas:', error);
          throw new Error(`Error al estimar el gas: ${error.message}`);
      }

      // Llamar a la función del contrato para emitir un certificado
      const tx = await contractInstance.issueCertificate(
          contractData.name,
          contractData.documentIdentification,
          contractData.course,
          contractData.description,
          {
              gasLimit: estimatedGas,
              gasPrice: ethers.utils.parseUnits('100', 'gwei')
          }
      );

      const receipt = await tx.wait();
      console.log("SUCCESSFUL TRANSACTION")
      console.log('Transaction hash:', receipt.transactionHash);

      // Obtener los eventos del recibo de la transacción
      const event = receipt.events.find(event => event.event === 'CertificateMinted');
      if (!event) {
          throw new Error('CertificateMinted event not found in transaction receipt');
      }
      console.log(event);

      const tokenId = event.args.tokenId.toString();
      const txHash = receipt.transactionHash;
      console.log("TKID:", tokenId);
      console.log("TX HASH:", txHash);

      return [tokenId, txHash];

  } catch (error) {
      throw new Error(`Error al crear el certificado: ${error.message}`);
  }
};

export async function getInstitutionName() {
  try {
    const institutionName = await academicContract.methods.getInstitutionName().call();
    return institutionName;
  } catch (error) {
    console.error('Error getting institution name:', error);
    throw error;
  }
}

export const callContractCreateCertificateBak = async (account, contractData) => {
    try {
      // Send the transaction
        const estimatedGas = await academicContract.estimateGas.issueCertificate(contractData.name, contractData.documentIdentification, contractData.course, contractData.description);
        console.log('Estimated Gas:', ethers.utils.formatEther(estimatedGas));
    //   const transaction = await contract.methods.yourContractFunction().send({ from: account });
        const transaction = await contract.methods.issueCertificate(contractData.name, contractData.documentIdentification, contractData.course, contractData.description).send({
            from: account,
            gas: gasEstimate,
            gasPrice: web3.utils.toWei('100', 'gwei')

    });

      // Get the transaction hash from the receipt
      const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);

      const txHash = receipt.transactionHash;
      console.log("SUCCESSFUL TRANSACTION")
      console.log('Transaction hash:', transaction.transactionHash);

      alert(`Function call is successful.\n\nTransaction Hash: ${txHash}`);
    } catch (error) {
      console.error('Error calling contract function:', error);
    }
  };

export async function issueCertificate ()  {
    const { name, documentIdentification, course, description } = req.body;
    const timestamp = Date.now();
    const humanReadableTimestamp = new Date(timestamp).toISOString();

    try {
        console.log("***** ACADEMIC CONTROLLER START *****");
        const balance = await provider.getBalance(wallet.address);
        console.log('Balance:', ethers.utils.formatEther(balance));

        // Estimar el gas necesario para la transacción
        const estimatedGas = await academicContract.estimateGas.issueCertificate(name, documentIdentification, course, description);
        console.log('Estimated Gas:', ethers.utils.formatEther(estimatedGas));


        // Enviar la transacción
        const tx = await academicContract.issueCertificate(name, documentIdentification, course, description, {
            gasLimit: estimatedGas.mul(2),  // Puedes ajustar este límite según sea necesario
            gasPrice: ethers.utils.parseUnits('100', 'gwei')
        });

        // const tx = await academicContract.issueCertificate(name, documentIdentification, course, description);
        
        
        const receipt = await tx.wait();
        const event = receipt.events.find(event => event.event === 'CertificateMinted');
        if (!event) {
            throw new Error('CertificateMinted event not found in transaction receipt');
        }

        const tokenId = event.args.tokenId.toString();
        
        if (!tokenId) {
            throw new Error('Failed to obtain tokenId from transaction receipt');
        }

        await pool.query('INSERT INTO certificates (name, document_id, course, description, issued_at, token_id, tx_hash) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
            [name, documentIdentification, course, description, humanReadableTimestamp, tokenId, receipt.transactionHash]);

        
        // const pdfBuffer = await generateCertificatePDF(name, documentIdentification, course, description, humanReadableTimestamp, tokenId, receipt.transactionHash, academicAddress);
        
        // const pdfFileName = `certificate_${name}-${tokenId}-${timestamp}.pdf`;
        // // const filePath = `./certificatesInPDF/${pdfFileName}`; 
        // // New absolute path
        // const filePath = path.join(__dirname, '..', 'certificatesInPDF', pdfFileName); 
        // await fs.writeFile(filePath, pdfBuffer);
    
        responseHandler.success(res, {
            message: "Academic Certificate deployed successfully",
            transactionHash: receipt.transactionHash,
            tokenId: tokenId,
            pdfDownloadLink: filePath
        });
    } catch (error) {
        if (error.message.includes('Certificate already exists')) {
            responseHandler.error(res, {message:'Certificate already exists'});
        } else if (error.message.includes('Insufficient funds for intrinsic transaction cost')) {
            responseHandler.error(res, {message:'Insufficient funds for the transaction'});
            console.error("Insufficient funds for the transaction");
        } else {
            responseHandler.error(res, error);
            console.error(error.message);
        }
    }
};