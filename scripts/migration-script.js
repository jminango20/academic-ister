const fs = require("fs");
const csv = require("csv-parser");
const { ethers } = require("ethers");
require("dotenv").config();

// Configuration
const CONFIG = {
  RPC_URL: process.env.API_URL || "http://localhost:8545",

  CONTRACT_ADDRESS: "0x082659D1b27F0fc2898dDE7C71Eff922f0ab905B",

  PRIVATE_KEY: "0xPrivateKey",

  // CSV file path
  CSV_FILE_PATH: "./certificates.csv",

  // Batch processing settings
  BATCH_SIZE: 1,
  DELAY_BETWEEN_BATCHES: 2000,

  // Gas settings
  GAS_LIMIT: 800000, // Gas limit per transaction
  GAS_PRICE: "20000000000", // 20 gwei
};

const CONTRACT_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "documentId", type: "string" },
          { internalType: "string", name: "course", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "institution", type: "string" },
          { internalType: "string", name: "area", type: "string" },
          { internalType: "string", name: "issuedDate", type: "string" },
          { internalType: "string", name: "startDate", type: "string" },
          { internalType: "string", name: "endDate", type: "string" },
          { internalType: "uint256", name: "hoursWorked", type: "uint256" },
          { internalType: "string", name: "signatoryName", type: "string" },
        ],
        internalType: "struct AcademicCertificate.CertificateIssuanceParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "issueCertificate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

class CertificateMigration {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    this.wallet = new ethers.Wallet(CONFIG.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(
      CONFIG.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      this.wallet
    );
    this.certificates = [];
    this.results = {
      success: [],
      failed: [],
      total: 0,
    };
  }

  // Read and parse CSV file
  async readCSV() {
    return new Promise((resolve, reject) => {
      const certificates = [];

      fs.createReadStream(CONFIG.CSV_FILE_PATH)
        .pipe(csv())
        .on("data", (row) => {
          // Map CSV columns to the structure
          const certificate = {
            name: row.name || row.Name || "",
            documentId:
              row.documentId || row.document_id || row.DocumentId || "",
            course: row.course || row.Course || "",
            description: row.description || row.Description || "",
            institution: row.institution || row.Institution || "",
            area: row.area || row.Area || "",
            issuedDate:
              row.issuedDate || row.issued_date || row.IssuedDate || "",
            startDate: row.startDate || row.start_date || row.StartDate || "",
            endDate: row.endDate || row.end_date || row.EndDate || "",
            hoursWorked: parseInt(
              row.hoursWorked || row.hours_worked || row.HoursWorked || "0"
            ),
            signatoryName:
              row.signatoryName ||
              row.signatory_name ||
              row.SignatoryName ||
              "",
          };

          certificates.push(certificate);
        })
        .on("end", () => {
          console.log(
            `✅ CSV file read successfully. Found ${certificates.length} certificates.`
          );
          resolve(certificates);
        })
        .on("error", (error) => {
          console.error("❌ Error reading CSV file:", error);
          reject(error);
        });
    });
  }

  // Validate certificate data
  validateCertificate(cert, index) {
    const required = ["name", "documentId", "course", "institution"];
    const missing = required.filter(
      (field) => !cert[field] || cert[field].trim() === ""
    );

    if (missing.length > 0) {
      console.warn(
        `⚠️  Certificate ${index + 1} missing required fields: ${missing.join(
          ", "
        )}`
      );
      return false;
    }

    return true;
  }

  // Issue a single certificate
  async issueSingleCertificate(cert, index) {
    try {
      console.log(`📝 Issuing certificate ${index + 1} for ${cert.name}...`);

      const tx = await this.contract.issueCertificate(cert, {
        gasLimit: CONFIG.GAS_LIMIT,
        gasPrice: CONFIG.GAS_PRICE,
      });

      console.log(`⏳ Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();

      console.log(
        `✅ Certificate ${index + 1} issued successfully. Token ID: ${
          receipt.logs[0]?.topics[1]
        }`
      );

      this.results.success.push({
        index: index + 1,
        name: cert.name,
        documentId: cert.documentId,
        txHash: tx.hash,
        tokenId: receipt.logs[0]?.topics[1],
      });

      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error(
        `❌ Failed to issue certificate ${index + 1} for ${cert.name}:`,
        error.message
      );

      this.results.failed.push({
        index: index + 1,
        name: cert.name,
        documentId: cert.documentId,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  }

  // Process certificates in batches
  async processBatches() {
    const validCertificates = this.certificates.filter((cert, index) =>
      this.validateCertificate(cert, index)
    );

    console.log(
      `\n🚀 Starting migration of ${validCertificates.length} valid certificates...`
    );
    console.log(`📦 Processing in batches of ${CONFIG.BATCH_SIZE}\n`);

    for (let i = 0; i < validCertificates.length; i += CONFIG.BATCH_SIZE) {
      const batch = validCertificates.slice(i, i + CONFIG.BATCH_SIZE);
      const batchNumber = Math.floor(i / CONFIG.BATCH_SIZE) + 1;

      console.log(
        `\n📦 Processing batch ${batchNumber} (certificates ${i + 1}-${
          i + batch.length
        })...`
      );

      // Process batch in parallel
      const batchPromises = batch.map((cert, batchIndex) =>
        this.issueSingleCertificate(cert, i + batchIndex)
      );

      await Promise.all(batchPromises);

      // Delay between batches to avoid overwhelming the network
      if (i + CONFIG.BATCH_SIZE < validCertificates.length) {
        console.log(
          `⏳ Waiting ${
            CONFIG.DELAY_BETWEEN_BATCHES / 1000
          }s before next batch...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.DELAY_BETWEEN_BATCHES)
        );
      }
    }
  }

  // Generate migration report
  generateReport() {
    const report = `
🎯 MIGRATION REPORT
==================
Total certificates processed: ${this.results.total}
✅ Successfully issued: ${this.results.success.length}
❌ Failed: ${this.results.failed.length}

SUCCESSFUL CERTIFICATES:
${this.results.success
  .map((cert) => `- ${cert.name} (${cert.documentId}) - TX: ${cert.txHash}`)
  .join("\n")}

${
  this.results.failed.length > 0
    ? `
FAILED CERTIFICATES:
${this.results.failed
  .map((cert) => `- ${cert.name} (${cert.documentId}) - Error: ${cert.error}`)
  .join("\n")}
`
    : ""
}
`;

    console.log(report);

    // Save report to file
    fs.writeFileSync("./migration-report.txt", report);
    console.log("\n📄 Report saved to migration-report.txt");
  }

  // Main migration function
  async migrate() {
    try {
      console.log("🚀 Starting certificate migration...\n");

      // Check wallet balance
      const balance = await this.provider.getBalance(this.wallet.address);
      console.log(`💰 Wallet balance: ${ethers.formatEther(balance)} ETH`);

      if (balance < ethers.parseEther("0.1")) {
        console.warn(
          "⚠️  Low balance warning! Make sure you have enough ETH for gas fees."
        );
      }

      // Read CSV
      this.certificates = await this.readCSV();
      this.results.total = this.certificates.length;

      if (this.certificates.length === 0) {
        console.log("❌ No certificates found in CSV file.");
        return;
      }

      // Process in batches
      await this.processBatches();

      // Generate report
      this.generateReport();

      console.log("\n🎉 Migration completed!");
    } catch (error) {
      console.error("💥 Migration failed:", error);
    }
  }
}

// Run the migration
async function main() {
  // Validate configuration
  if (!CONFIG.PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY environment variable not set!");
    console.log('Set it with: export PRIVATE_KEY="your-private-key"');
    process.exit(1);
  }

  if (!fs.existsSync(CONFIG.CSV_FILE_PATH)) {
    console.error(`❌ CSV file not found: ${CONFIG.CSV_FILE_PATH}`);
    process.exit(1);
  }

  const migration = new CertificateMigration();
  await migration.migrate();
}

// Handle script execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CertificateMigration };
