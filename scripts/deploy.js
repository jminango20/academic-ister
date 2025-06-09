// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 DEPLOYING ACADEMIC CERTIFICATE CONTRACT");
    console.log("==========================================\n");

    // Get deployer account using hre.ethers instead of direct ethers import
    const [deployer] = await hre.ethers.getSigners();
    const network = await hre.ethers.provider.getNetwork();
    
    console.log("📋 Deployment Details:");
    console.log(`   Network: ${network.name} (Chain ID: ${network.chainId})`);
    console.log(`   Deployer: ${deployer.address}`);
    
    // Check deployer balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`   Balance: ${balance.toString()} ETH\n`);
    
    if (balance < hre.ethers.parseEther("0.01")) {
        console.log("❌ Insufficient balance for deployment!");
        console.log("   Minimum required: 0.01 ETH");
        return;
    }

    // Contract constructor parameters
    const ownerInstitution = "Instituto Tecnológico Superior Rumiñahui (ISTER)";
    
    console.log("🏗️  Contract Parameters:");
    console.log(`   Owner: ${deployer.address}`);
    console.log(`   Institution: ${ownerInstitution}\n`);

    try {
        // Get contract factory
        console.log("📝 Compiling contract...");
        const AcademicCertificate = await hre.ethers.getContractFactory("AcademicCertificate");
                
        // Deploy contract
        console.log("🚀 Deploying contract...");
        const startTime = Date.now();
        
        const contract = await AcademicCertificate.deploy(
            deployer.address, 
            ownerInstitution
        );
        
        console.log(`   Transaction hash: ${contract.deploymentTransaction().hash}`);
        console.log("   Waiting for confirmation...");
        
        // Wait for deployment
        await contract.waitForDeployment();
        const deployTime = Date.now() - startTime;
        
        // Get contract address
        const contractAddress = await contract.getAddress();
        
        console.log(`✅ Contract deployed successfully in ${deployTime/1000}s!`);
        console.log(`   Contract address: ${contractAddress}\n`);

        // Get deployment receipt
        const receipt = await contract.deploymentTransaction().wait();
        
        console.log("📊 Deployment Results:");
        console.log(`   Block number: ${receipt.blockNumber}`);
        console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
        console.log(`   Actual cost: ${hre.ethers.formatEther(receipt.gasUsed * receipt.gasPrice)} ETH`);
        
        // Check contract size
        console.log("\n📏 Contract Size Analysis:");
        const contractCode = await hre.ethers.provider.getCode(contractAddress);
        const sizeInBytes = (contractCode.length - 2) / 2; // Remove 0x and convert to bytes
        const maxSize = 24576; // EIP-170 limit
        const percentUsed = ((sizeInBytes / maxSize) * 100).toFixed(1);
        
        console.log(`   Bytecode size: ${sizeInBytes} bytes`);
        console.log(`   Size limit: ${maxSize} bytes`);
        console.log(`   Usage: ${percentUsed}%`);
        
        if (sizeInBytes > maxSize) {
            console.log("❌ CONTRACT EXCEEDS SIZE LIMIT!");
            console.log("   This contract cannot be deployed on mainnet.");
            console.log("   Consider further optimizations.");
        } else {
            const remaining = maxSize - sizeInBytes;
            console.log(`✅ Contract fits! ${remaining} bytes remaining (${(100-percentUsed).toFixed(1)}% free)`);
        }

        // Test basic functionality
        console.log("\n🧪 Testing Basic Functionality:");
        try {
            const ownerInst = await contract.getOwnerInstitution();
            console.log(`   ✅ getOwnerInstitution(): "${ownerInst}"`);
            console.log(`   ✅ Contract initialized properly`);
            
        } catch (error) {
            console.log(`   ⚠️  Basic test failed: ${error.message}`);
        }

        // Create deployment information
        const deploymentInfo = {
            // Contract details
            contractAddress: contractAddress,
            contractName: "AcademicCertificate",
            
            // Network details
            network: network.name,
            chainId: network.chainId.toString(),
            
            // Deployment details
            deployer: deployer.address,
            ownerInstitution: ownerInstitution,
            deploymentHash: contract.deploymentTransaction().hash,
            blockNumber: receipt.blockNumber,
            timestamp: new Date().toISOString(),
            
            // Gas details
            gasUsed: receipt.gasUsed.toString(),
            gasPrice: receipt.gasPrice.toString(),
            deploymentCost: hre.ethers.formatEther(receipt.gasUsed * receipt.gasPrice),
            
            // Contract size
            bytecodeSize: sizeInBytes,
            sizeLimit: maxSize,
            sizePercentage: percentUsed,
            
            // Status
            status: sizeInBytes <= maxSize ? "SUCCESS" : "SIZE_LIMIT_EXCEEDED",
        };

        // Save deployment info
        const deploymentFile = `./deployment-info.json`;
        
        fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
        
        console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

        // Print next steps
        console.log("\n🎯 Next Steps:");
        console.log(`      CONTRACT_ADDRESS: "${contractAddress}"`);
        
        console.log("\n🎉 Deployment completed successfully!");
        
        return {
            contract,
            address: contractAddress,
            deploymentInfo
        };

    } catch (error) {
        console.error("💥 Deployment failed:");
        console.error(error);
        
        // Save error info
        const errorInfo = {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            network: network.name,
            deployer: deployer.address
        };
        
        fs.writeFileSync('./deployment-error.json', JSON.stringify(errorInfo, null, 2));
        console.log("❌ Error details saved to ./deployment-error.json");
        
        process.exit(1);
    }
}

// Run deployment
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { main };