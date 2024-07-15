/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 2100000,
      gasPrice: 8000000000
    },
    polygon_amoy: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 8000000,
      gasPrice: 5000000000,
    },
    matic: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    }  
  }
};
