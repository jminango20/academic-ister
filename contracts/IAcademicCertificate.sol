// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAcademicCertificate {

    struct Certificate {
        string name;
        string documentIdentification;
        string course;
        string description;
    }

    event CertificateMinted(uint256 indexed tokenId, string name, string documentIdentification, string course, string description);

    function issueCertificate(
        string memory name, 
        string memory documentIdentification, 
        string memory course, 
        string memory description
    ) external returns (uint256);

    function issueCertificatesBatch(
        string[] memory names, 
        string[] memory documentIdentifications, 
        string memory course, 
        string memory description
    ) external; 

    function verifyCertificate(
        uint256 tokenId, 
        string memory name, 
        string memory documentIdentification, 
        string memory course,
        string memory description
    ) external view returns (bool);

    function getCertificateMetadata(uint256 tokenId) external view returns (Certificate memory);

    function getCertificateIdsByDocumentId(string memory documentIdentification) external view returns (uint256[] memory);

    function getInstitutionName() external view returns (string memory);

}
