// ref: https://medium.com/@erinlim555/building-a-web3-app-with-react-f85843db2f47
// ref: https://github.com/Limerin555/react_web3

import Web3 from 'web3';
// import {academicCertificateABI} from '@src/smartContract';
import {academicCertificateABI} from '@smartContract'

const web3 = new Web3(Web3.givenProvider);
const contractAddress = process.env.VITE_CONTRACT_ADDRESS_ACADEMIC_ISTER;

// const academicContract = new web3.eth.Contract(academicCertificateABI, contractAddress);

export const callContractCreateCertificate = async (account, contractData) => {
    try {
        // Comprobación de la conexión de MetaMask
        if (!window.ethereum) {
            throw new Error('MetaMask no está instalado o no se ha conectado.');
        }
    
        const web3 = new Web3(window.ethereum);
    
        const userAccount = account; // Tomamos la primera cuenta por simplicidad
        // Crear instancia del contrato usando la dirección y Web3
        const contractInstance = new web3.eth.Contract(academicCertificateABI, contractAddress);
        // Llamar a la función del contrato para emitir un certificado
        const receipt = await contractInstance.methods.issueCertificate(
            contractData.name,
            contractData.documentIdentification,
            contractData.course,
            contractData.description
        ).send({ from: userAccount });
        console.log("SUCCESSFUL TRANSACTION")
        console.log('Transaction hash:', receipt.transactionHash);
            
        return receipt;
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

export const callContractCreateCertificateB = async (account, contractData) => {
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

// Otros métodos para interactuar con el contrato
