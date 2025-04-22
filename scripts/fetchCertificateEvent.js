require("dotenv").config();
const { ethers } = require("hardhat");

// Replace with your NFT contract address & transaction hash
const CONTRACT_ADDRESS = "0x9F70E57deDABfC7b156ddD0AF4bE777CF5b72cD4";
const TX_HASH = "0x0fc71d3c70ef938e4faef27e5109b047dc1f0f42244a41d1d2842f4836dc2dd1";

// ABI for the `CertificateMinted` event
const ABI = [
  "event CertificateMinted(uint256 indexed tokenId, string name, string documentIdentification, string course, string description)"
];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  try {
    // Fetch transaction receipt
    const txReceipt = await provider.getTransactionReceipt(TX_HASH);

    if (!txReceipt) {
      console.log("Transaccion no encontrada.");
      return;
    }

    console.log("🔹 Transaccion Encontrada! Extrayendo datos de eventos.");

    // Decode events
    for (const log of txReceipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog.name === "CertificateMinted") {
          console.log("✅ Certificado Encontrado!");
          console.log(`- Token ID: ${parsedLog.args.tokenId.toString()}`);
          console.log(`- Nombre: ${parsedLog.args.name}`);
          console.log(`- Cedula de Identidad: ${parsedLog.args.documentIdentification}`);
          console.log(`- Curso: ${parsedLog.args.course}`);
          console.log(`- Descripcion: ${parsedLog.args.description}`);
        }
      } catch (err) {
        // Ignore logs that do not match the event
      }
    }
  } catch (error) {
    console.error("❌ Error fetching transaction details:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
