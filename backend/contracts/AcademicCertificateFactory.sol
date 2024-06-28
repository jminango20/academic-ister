// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AcademicCertificate.sol";
import "./IAcademicCertificateFactory.sol";

contract AcademicCertificateFactory is IAcademicCertificateFactory, Ownable {
      
    mapping(address => address[]) private academicCertificateDeployed;
    mapping(string => address[]) private academicCertificateDeployedByInstitution;
    
    constructor() Ownable(msg.sender) {}

    function deployAcademicCertificate(address newOwner, string memory institutionName) external override onlyOwner {
        AcademicCertificate newCertificate = new AcademicCertificate(newOwner, institutionName);
        address newCertificateAddress = address(newCertificate);
        emit CertificateDeployed(newOwner, newCertificateAddress);
        academicCertificateDeployed[newOwner].push(newCertificateAddress); 
        academicCertificateDeployedByInstitution[institutionName].push(newCertificateAddress); 
    }

    function getAcademicCertificateDeployed(address newOwner) external override onlyOwner view returns(address[] memory) {
        return academicCertificateDeployed[newOwner];
    } 

    function getAcademicCertificateDeployedByInstitution(string memory institutionName) external override onlyOwner view returns(address[] memory) {
        return academicCertificateDeployedByInstitution[institutionName];
    } 

    function getLastAcademicCertificateDeployed(address newOwner) external override onlyOwner view returns(address) {
        return academicCertificateDeployed[newOwner][academicCertificateDeployed[newOwner].length - 1];
    } 

    function getLastAcademicCertificateDeployedByInstitution(string memory institutionName) external override onlyOwner view returns(address) {
        return academicCertificateDeployedByInstitution[institutionName][academicCertificateDeployedByInstitution[institutionName].length - 1];
    } 
}