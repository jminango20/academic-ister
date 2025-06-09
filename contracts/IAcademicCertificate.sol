// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct CertificateIssuanceParams {
    string name;
    string documentId;
    string course;
    string description;
    string institution;
    string area;
    string issuedDate;
    string startDate;
    string endDate;
    uint256 hoursWorked;
    string signatoryName;
}

struct CertificateInfo {
    uint256 tokenId;
    string name;
    string documentId;
    string course;
    string description;
    string institution;
    string area;
    string issuedDate;
    string startDate;
    string endDate;
    uint256 hoursWorked;
    string signatoryName;
}

struct InstitutionCertificateInfo {
    uint256 tokenId;
    string name;
    string documentId;
    string course;
    string description;
    string area;
    string signatoryName;
}

interface IAcademicCertificate {
    event CertificateMinted(
        uint256 indexed tokenId,
        string name,
        string documentId,
        string course,
        string description,
        string institution,
        uint256 timestamp
    );

    function issueCertificate(CertificateIssuanceParams calldata params) external returns (uint256);
    
    function verifyCertificate(
        uint256 _tokenId,
        string calldata _name,
        string calldata _documentId,
        string calldata _course,
        string calldata _institution
    ) external view returns (bool);

    function getCertificateMetadata(uint256 _tokenId) 
        external 
        view 
        returns (
            string memory name,
            string memory documentId,
            string memory course,
            string memory description,
            string memory institution,
            string memory area,
            string memory issuedDate,
            string memory startDate,
            string memory endDate,
            uint256 hoursWorked,
            string memory signatoryName
        );

    function getCertificateIdsByDocumentId(string calldata _documentId) 
        external view returns (uint256[] memory);
    
    function getCertificatesByDocumentId(string calldata _documentId) 
        external view returns (CertificateInfo[] memory);

    function getOwnerInstitution() external view returns (string memory);

    function getCertificateIdsByInstitution(string calldata _institution) 
        external view returns (uint256[] memory);
    
    function getCertificatesByInstitution(string calldata _institution) 
        external view returns (InstitutionCertificateInfo[] memory);
}