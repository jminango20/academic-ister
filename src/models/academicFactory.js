const { ethers } = require("ethers");
require('dotenv').config();

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const academicFactoryAddress = process.env.CONTRACT_ADDRESS_ACADEMIC_FACTORY;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const { abi } = require("../../artifacts/contracts/AcademicCertificateFactory.sol/AcademicCertificateFactory.json");

const factoryContract = new ethers.Contract(academicFactoryAddress, abi, signer);

module.exports = factoryContract;