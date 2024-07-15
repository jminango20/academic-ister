const hre = require("hardhat");
require("dotenv").config();

async function main() {
  
  const academic = await hre.ethers.getContractFactory("AcademicCertificate");
  console.log(process.env.CONTRACT_ADDRESS_ACADEMIC_FACTORY);
  const academic_ = await academic.deploy(
    process.env.CONTRACT_ADDRESS_ACADEMIC_FACTORY,
    "Instituto Universitario Rumiñahui Test" //Academic contract name
  );

  await academic_.deployed();

  console.log(
    `Contract Academic Address:  ${academic_.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});