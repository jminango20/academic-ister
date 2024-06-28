// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IAcademicCertificate.sol";

contract AcademicCertificate is IAcademicCertificate, ERC1155, Ownable {

    mapping(bytes32 => bool) public certificateExists;
    mapping(uint256 => Certificate) public certificates;
    mapping(string => uint256[]) internal certificatesByDocumentId;
    

    uint256 public lastTokenId;
    string private institutionName;

     constructor(address owner, string memory _institutionName) ERC1155("") Ownable(owner){
        lastTokenId = 0;
        institutionName = _institutionName;
    }

    function issueCertificate(
        string memory name, 
        string memory documentIdentification, 
        string memory course, 
        string memory description
        ) external override onlyOwner returns (uint256) {

            bytes32 certHash = keccak256(abi.encodePacked(name, documentIdentification, course, description));
            require(!certificateExists[certHash], "Certificate already exists");

            uint256 tokenId = lastTokenId;
            
            certificates[tokenId] = Certificate(
                name, 
                documentIdentification, 
                course, 
                description
                );
            
            certificatesByDocumentId[documentIdentification].push(tokenId);
            
            _mint(msg.sender, tokenId, 1, "");
            
            emit CertificateMinted(tokenId, name, documentIdentification, course, description);

            certificateExists[certHash] = true;
            
            lastTokenId++;
            
            return tokenId;
    }

    function issueCertificatesBatch(
        string[] memory names, 
        string[] memory documentIdentifications, 
        string memory course, 
        string memory description
    ) external override onlyOwner {
        require(names.length == documentIdentifications.length, "Arrays length mismatch");

        uint256[] memory ids = new uint256[](names.length);
        uint256[] memory amount = new uint256[](names.length);

        for (uint256 i = 0; i < names.length; i++) {
            string memory name = names[i];
            string memory documentIdentification = documentIdentifications[i];
            bytes32 certHash = keccak256(abi.encodePacked(name, documentIdentification, course, description));
            require(!certificateExists[certHash], "Certificate already exists");

            uint256 tokenId = lastTokenId + i;
            ids[i] = tokenId;
            amount[i] = 1;
            certificates[tokenId] = Certificate(name, documentIdentification, course, description);
            certificatesByDocumentId[documentIdentification].push(tokenId);
            emit CertificateMinted(tokenId, name, documentIdentification, course, description);
            certificateExists[certHash] = true;
        }
        _mintBatch(msg.sender, ids, amount, "");
        lastTokenId += names.length;
    }

    function verifyCertificate(
        uint256 tokenId, 
        string memory name, 
        string memory documentIdentification, 
        string memory course,
        string memory description) external override view returns (bool) {
            Certificate memory cert = certificates[tokenId];
            bytes32 hash = keccak256(abi.encodePacked(name, documentIdentification, course, description));
            return hash == keccak256(abi.encodePacked(cert.name, cert.documentIdentification, cert.course, cert.description));
    }

    function getCertificateMetadata(uint256 tokenId) external override view returns (Certificate memory) {
        return certificates[tokenId];
    }

    function getCertificateIdsByDocumentId(string memory documentIdentification) external override view returns (uint256[] memory) {
        return certificatesByDocumentId[documentIdentification];
    }

    function getInstitutionName() external override view returns (string memory) {
        return institutionName;
    }

}
