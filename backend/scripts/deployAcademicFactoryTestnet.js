const hre = require("hardhat");

async function main() {
  
  const academicFactory = await hre.ethers.getContractFactory("AcademicCertificateFactory");
  const academicFactory_ = await academicFactory.deploy();

  await academicFactory_.deployed();

  console.log(
    `Contract Academic Factory Testnet Address:  ${academicFactory_.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Compile
// npx hardhat run scripts/deployExample.js --network matic
// npx hardhat run scripts/deployExample.js --network polygon_amoy