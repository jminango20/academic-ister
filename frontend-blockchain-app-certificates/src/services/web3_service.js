// ref: https://medium.com/@erinlim555/building-a-web3-app-with-react-f85843db2f47
// ref: https://github.com/Limerin555/react_web3

import Web3 from 'web3';
import { ethers } from 'ethers';

import {academicCertificateI_abi} from '@smartContract'

console.log('ABI:', academicCertificateI_abi);
const web3 = new Web3(Web3.givenProvider);
console.log('Web3 Provider:', Web3.givenProvider);

const contractAddress = process.env.VITE_CONTRACT_ADDRESS_ACADEMIC_ISTER;
console.log('Contract Address:', contractAddress);

const academicContract = new web3.eth.Contract(academicCertificateI_abi, contractAddress);

export const callContractCreateCertificate = async (account, contractHash, contractData) => {
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
        const contractInstance = new ethers.Contract(contractHash, academicCertificateI_abi, signer);

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

export const callContractCreateCertificate_BAK = async (account, contractHash, contractData) => {
    try {
        // Comprobación de la conexión de MetaMask
        if (!window.ethereum) {
            throw new Error('MetaMask no está instalado o no se ha conectado.');
        }
        console.log("INIT CALL");
        const web3 = new Web3(window.ethereum);

        // Obtener el ID de la red actual
        const chainId = await web3.eth.getChainId();
        console.log("Red actual:", Number(chainId));

        // const desiredChainId = 80002; // AMOY TESTNET
        
        // // Verificar si la red actual es la red deseada
        // if (Number(chainId) !== desiredChainId) {
        //     throw new Error(`Por favor, conecta MetaMask a la red correcta. Se requiere Chain ID: ${desiredChainId}`);
        // }
    
        const userAccount = account; // Tomamos la primera cuenta por simplicidad

        // Crear instancia del contrato usando la dirección y Web3
        const contractInstance = new web3.eth.Contract(academicCertificateI_abi, contractHash);

        //Estimar el gas requerido
        console.log("contractInstance", contractInstance);
        console.log("contractHash:", contractHash);
        const methods = Object.keys(contractInstance.methods);
        console.log("Métodos disponibles:", methods);

        console.log("Inicio de estimación de gas");
        try {
            const estimatedGas = await contractInstance.methods.issueCertificate(
                contractData.name, 
                contractData.documentIdentification, 
                contractData.course, 
                contractData.description
            ).estimateGas({ from: userAccount });
        
            console.log('Gas estimado:', estimatedGas);
        } catch (error) {
            console.error('Error al estimar el gas:', error);
            throw new Error(`Error al estimar el gas: ${error.message}`);
        }
        // console.log('Estimated Gas:', ethers.utils.formatEther(gasEstimate));

        // Llamar a la función del contrato para emitir un certificado
        const receipt = await contractInstance.methods.issueCertificate(
            contractData.name,
            contractData.documentIdentification,
            contractData.course,
            contractData.description
        ).send({ 
            from: userAccount,
            gas: gasEstimate,
            gasPrice: web3.utils.toWei('100', 'gwei') });

        console.log("SUCCESSFUL TRANSACTION")
        console.log('Transaction hash:', receipt.transactionHash);

        // const event = receipt.events.find(event => event.event === 'CertificateMinted');
        const events = await contractInstance.getPastEvents('CertificateMinted', {
            filter: {
                // Puedes filtrar eventos aquí si es necesario
            },
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