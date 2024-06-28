// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAcademicCertificateFactory {
   
    event CertificateDeployed(address indexed university, address indexed contractAddress);

    function deployAcademicCertificate(address newOwner, string memory institutionName) external;

    function getAcademicCertificateDeployed(address newOwner) external view returns(address [] memory);

    function getAcademicCertificateDeployedByInstitution(string memory institutionName) external view returns(address[] memory);

    function getLastAcademicCertificateDeployed(address newOwner) external view returns(address);

    function getLastAcademicCertificateDeployedByInstitution(string memory institutionName) external view returns(address);
    
}