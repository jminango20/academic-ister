// ref: https://medium.com/@erinlim555/building-a-web3-app-with-react-f85843db2f47
// ref: https://github.com/Limerin555/react_web3

// https://docs.web3js.org/

import Web3 from 'web3';
import { ethers } from 'ethers';
import {loadAcademicCertificateI_ABI} from '@smartContract'
let academicContract;
let abi, accounts, web3;

async function init(contract_address) {
    try {
        if (window.ethereum) {
            // web3 = new Web3(window.ethereum);
            web3 = new Web3("https://polygon-amoy.g.alchemy.com/v2/WDCCKqD3vamJDfoX2mJy64294wcs1bWk");
        } else {
            
        }
        console.log("WEB3 PROVIDER:", Web3.givenProvider);
        web3 = new Web3("https://rpc-amoy.polygon.technology");
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        abi = await loadAcademicCertificateI_ABI(); // Load ABI from your JSON file
        academicContract = new web3.eth.Contract(abi, contract_address);
        academicContract.handleRevert = true;
        // web3 = new Web3();
        // academicContract = new web3.eth.Contract(abi);
  } catch (error) {
        console.error('Error initializing contract:', error);
        throw error;
  }
}

async function getGasFees() {
    try {
        const latestBlock = await web3.eth.getBlock("latest");
        const baseFeePerGas = latestBlock.baseFeePerGas;
        const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei'); // This can be adjusted based on current network conditions

        // Convert the base fee and priority fee to BN
        const maxFeePerGas = new web3.utils.BN(baseFeePerGas).add(new web3.utils.BN(maxPriorityFeePerGas));

        return {
            maxPriorityFeePerGas: web3.utils.toHex(maxPriorityFeePerGas),
            maxFeePerGas: web3.utils.toHex(maxFeePerGas)
        };
    } catch (error) {
        console.error('Error getting gas fees:', error);
        throw error;
    }
}
// const academicContract = new web3.eth.Contract(academicCertificateABI, contractAddress);

export const callContractCreateCertificate = async (account, contractAddress, contractData) => {
    try {
        // Comprobación de la conexión de MetaMask
        if (!window.ethereum) {
            throw new Error('MetaMask no está instalado o no se ha conectado.');
        }

        if (!academicContract) {
          await init(contractAddress);
        }

        // const web3 = new Web3(window.ethereum);

        // Crear instancia del contrato usando la dirección y Web3
        console.log("SHOW ACCOUNTS");
        console.log(account);
        console.log(accounts[0]);

        console.log("SHOW CONTRACT METHODS");
        console.log(await academicContract.methods);

        const certificate = await academicContract.methods.getCertificateMetadata(0);
        console.log('Certificate:', certificate);

        // Estimate gas required
        // const gasEstimate = await academicContract.methods.issueCertificate(
        //   contractData.name,
        //   contractData.documentIdentification,
        //   contractData.course,
        //   contractData.description
        // ).estimateGas({ from: account, to: contractAddress, });

        // console.log('Estimated Gas:', Number(gasEstimate));
        // console.log('Estimated Gas:', gasEstimate);
        // console.log('Estimated Gas eth:', ethers.utils.formatEther(gasEstimate));

        // const gasFees = await getGasFees();

        // Prepare transaction parameters
        const transactionParameters = {
            // gasLimit: web3.utils.toHex(gasEstimate),
            gas: 1000000,
            gasPrice: "10000000000",
            data: academicContract.methods
            .issueCertificate(
                contractData.name,
                contractData.documentIdentification,
                contractData.course,
                contractData.description
            ).encodeABI(),
            from: account,
            to: contractAddress,
            // maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
            // maxFeePerGas: gasFees.maxFeePerGas,
        //   gasPrice: '0x09184e72a000'
      };

        // popup - request the user to sign and broadcast the transaction
        // await ethereum.request({
        //     method: 'eth_sendTransaction',
        //     params: [transactionParameters],
        // });

      const txReceipt = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
          });

      console.log("Transaction sent:", txReceipt);
      console.log('Transaction hash:', txReceipt.transactionHash);

      //https://stackoverflow.com/questions/70935982/using-matic-with-web3-and-metamask-error-returned-error-unknown-account

        // console.log("Transaction sent:", txReceipt);
        // console.log('Transaction hash:', receipt.transactionHash);

        return txReceipt;
      } catch (error) {
          throw new Error(`Error al crear el certificado: ${error.message}`);
      }
  };

  export const sendPreparedTransaction = async (transactionParameters) => {
    try {
        // Send transaction using MetaMask (MetaMask will handle signing)
        const txReceipt = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });

        console.log("Transaction sent:", txReceipt);
        console.log('Transaction hash:', txReceipt.transactionHash);

        return txReceipt;
    } catch (error) {
        throw new Error(`Error sending certificate transaction: ${error.message}`);
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