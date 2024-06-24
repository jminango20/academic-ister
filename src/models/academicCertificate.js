const { ethers } = require("ethers");
require("dotenv").config();

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const academicAddress = process.env.CONTRACT_ADDRESS_ACADEMIC_ISTER;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const { abi } = require("../../artifacts/contracts/IAcademicCertificate.sol/IAcademicCertificate.json");

const academicContract = new ethers.Contract(academicAddress, abi, signer);

module.exports = academicContract;