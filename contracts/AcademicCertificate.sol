// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Contrato de Certificados Académicos del Instituto Tecnológico Superior Rumiñahui (ISTER)
 * @author juancarlos.minango@ister.edu.ec
 * @notice Este contrato permite la emisión y verificación de certificados académicos en blockchain
 */
contract AcademicCertificate is ERC1155, Ownable {

    // Estructura para parámetros de emisión
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

    // Estructura para información completa del certificado
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

    // Estructura para información de certificado por institución  
    struct InstitutionCertificateInfo {
        uint256 tokenId;
        string name;
        string documentId;
        string course;
        string description;
        string area;
        string signatoryName;
    }

    // Estructura optimizada para datos principales (packed para gas efficiency)
    struct CertificateData {
        string name;
        string documentIdentification;
        string course;
    }
    
    // Estructura optimizada para metadatos (packed para gas efficiency)
    struct CertificateMetadata {
        string description;
        string institution;
        string area;
        string issuedDate;
        string startDate;
        string endDate;
        uint128 hoursWorked;      
        string signatoryName;
    }

    /**
     * Evento optimizado para más campos - máximo de información en un evento
     * Solo 3 campos pueden ser indexed, pero todos los datos van como parámetros normales
     */
    event CertificateIssued(
        uint256 indexed tokenId,
        bytes32 indexed studentHash,      // hash(name + documentId) para búsquedas
        bytes32 indexed institutionHash,  // hash(institution) para búsquedas
        string name,
        string documentId,
        string course,
        string institution
    );
    
    // Mapeo optimizado
    mapping(bytes32 => bool) public certificateHashes;
    mapping(uint256 => CertificateData) public certificateMainData;
    mapping(uint256 => CertificateMetadata) public certificateExtraData;
    mapping(string => uint256[]) public documentToCertificates;
    mapping(string => uint256[]) public institutionToCertificates;
    
    // Storage más eficiente
    uint256 private nextTokenId;
    string public ownerInstitution;

    constructor(address initialOwner, string memory _ownerInstitution) 
        ERC1155("") 
        Ownable(initialOwner) 
    {
        nextTokenId = 1;
        ownerInstitution = _ownerInstitution; 
    }

    /**
     * @dev Emite un nuevo certificado con gas optimizado
     */
    function issueCertificate(
        CertificateIssuanceParams calldata params
    ) external onlyOwner returns (uint256) {
        // Hash optimizado para duplicados
        bytes32 certHash = keccak256(abi.encodePacked(
            params.name, params.documentId, params.course, params.institution
        ));
        
        require(!certificateHashes[certHash], "El certificado ya existe");

        uint256 tokenId = nextTokenId++;
                
        // Storage optimizado con packing
        certificateMainData[tokenId] = CertificateData(
            params.name,
            params.documentId,
            params.course
        );
        
        certificateExtraData[tokenId] = CertificateMetadata(
            params.description,
            params.institution,
            params.area,
            params.issuedDate,
            params.startDate,
            params.endDate,
            uint128(params.hoursWorked), // Conversión para pack
            params.signatoryName
        );
        
        // Actualizaciones de índices
        documentToCertificates[params.documentId].push(tokenId);
        institutionToCertificates[params.institution].push(tokenId);
        certificateHashes[certHash] = true;
        
        // Mint del NFT
        _mint(msg.sender, tokenId, 1, "");
        
        // Evento completo con todos los datos
        emit CertificateIssued(
            tokenId,
            keccak256(abi.encodePacked(params.name, params.documentId)), // hash para búsquedas
            keccak256(abi.encodePacked(params.institution)),             // hash para búsquedas
            params.name,
            params.documentId,
            params.course,
            params.institution
        );
        
        return tokenId;
    }

    /**
     * @dev Verificación optimizada
     */
    function verifyCertificate(
        uint256 _tokenId,
        string calldata _name,
        string calldata _documentId,
        string calldata _course,
        string calldata _institution
    ) external view returns (bool) {
        if (!_exists(_tokenId)) return false;
        
        CertificateData memory mainData = certificateMainData[_tokenId];
        CertificateMetadata memory extraData = certificateExtraData[_tokenId];
        
        // Comparación optimizada con hashes
        return (
            keccak256(bytes(mainData.name)) == keccak256(bytes(_name)) &&
            keccak256(bytes(mainData.documentIdentification)) == keccak256(bytes(_documentId)) &&
            keccak256(bytes(mainData.course)) == keccak256(bytes(_course)) &&
            keccak256(bytes(extraData.institution)) == keccak256(bytes(_institution))
        );
    }

    /**
     * @dev Obtiene metadatos completos
     */
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
        ) 
    {
        require(_exists(_tokenId), "El certificado no existe");
        
        CertificateData memory mainData = certificateMainData[_tokenId];
        CertificateMetadata memory extraData = certificateExtraData[_tokenId];
        
        return (
            mainData.name,
            mainData.documentIdentification,
            mainData.course,
            extraData.description,
            extraData.institution,
            extraData.area,
            extraData.issuedDate,
            extraData.startDate,
            extraData.endDate,
            uint256(extraData.hoursWorked), 
            extraData.signatoryName
        );
    }

    /**
     * @dev Obtiene certificados por documento con paginación
     * @param _documentId Documento de identificación
     * @param offset Posición inicial (0 para el primero)
     * @param limit Máximo número de certificados a retornar
     */
    function getCertificatesByDocumentId(
        string calldata _documentId,
        uint256 offset,
        uint256 limit
    )
        external
        view
        returns (
            CertificateInfo[] memory certificates,
            uint256 totalCount,
            bool hasMore
        )
    {
        uint256[] memory ids = documentToCertificates[_documentId];
        totalCount = ids.length;
        
        if (offset >= totalCount) {
            return (new CertificateInfo[](0), totalCount, false);
        }
        
        uint256 end = offset + limit;
        if (end > totalCount) {
            end = totalCount;
        }
        
        uint256 length = end - offset;
        certificates = new CertificateInfo[](length);
        
        for (uint256 i = 0; i < length; i++) {
            certificates[i] = _getCertificateInfo(ids[offset + i]);
        }
        
        hasMore = end < totalCount;
        return (certificates, totalCount, hasMore);
    }

    /**
     * @dev Obtiene certificados por institución con paginación
     * @param _institution Nombre de la institución
     * @param offset Posición inicial (0 para el primero)
     * @param limit Máximo número de certificados a retornar
     */
    function getCertificatesByInstitution(
        string calldata _institution,
        uint256 offset,
        uint256 limit
    )
        external
        view
        returns (
            InstitutionCertificateInfo[] memory certificates,
            uint256 totalCount,
            bool hasMore
        )
    {
        uint256[] memory ids = institutionToCertificates[_institution];
        totalCount = ids.length;
        
        if (offset >= totalCount) {
            return (new InstitutionCertificateInfo[](0), totalCount, false);
        }
        
        uint256 end = offset + limit;
        if (end > totalCount) {
            end = totalCount;
        }
        
        uint256 length = end - offset;
        certificates = new InstitutionCertificateInfo[](length);
        
        for (uint256 i = 0; i < length; i++) {
            certificates[i] = _getInstitutionCertificateInfo(ids[offset + i]);
        }
        
        hasMore = end < totalCount;
        return (certificates, totalCount, hasMore);
    }

    // Funciones auxiliares
    function getCertificateIdsByDocumentId(string calldata _documentId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return documentToCertificates[_documentId];
    }

    function getCertificateIdsByInstitution(string calldata _institution) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return institutionToCertificates[_institution];
    }

    /**
     * @dev Obtiene total de certificados por documento
     */
    function getCertificateCountByDocumentId(string calldata _documentId) 
        external 
        view 
        returns (uint256) 
    {
        return documentToCertificates[_documentId].length;
    }

    /**
     * @dev Obtiene total de certificados por institución
     */
    function getCertificateCountByInstitution(string calldata _institution) 
        external 
        view 
        returns (uint256) 
    {
        return institutionToCertificates[_institution].length;
    }

    /**
     * @dev Funciones de compatibilidad - obtiene todos los certificados (usar con cuidado)
     * Solo usar cuando sepas que hay pocos certificados (< 50)
     */
    function getAllCertificatesByDocumentId(string calldata _documentId)
        external
        view
        returns (CertificateInfo[] memory certificates)
    {
        uint256[] memory ids = documentToCertificates[_documentId];
        require(ids.length <= 100, "Demasiados certificados, usar paginacion");
        
        certificates = new CertificateInfo[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            certificates[i] = _getCertificateInfo(ids[i]);
        }
        return certificates;
    }

    function getAllCertificatesByInstitution(string calldata _institution)
        external
        view
        returns (InstitutionCertificateInfo[] memory certificates)
    {
        uint256[] memory ids = institutionToCertificates[_institution];
        require(ids.length <= 100, "Demasiados certificados, usar paginacion");
        
        certificates = new InstitutionCertificateInfo[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            certificates[i] = _getInstitutionCertificateInfo(ids[i]);
        }
        return certificates;
    }

    function getOwnerInstitution() external view returns (string memory) {
        return ownerInstitution;
    }

    // Funciones internas optimizadas
    function _exists(uint256 _tokenId) internal view returns (bool) {
        return _tokenId < nextTokenId && _tokenId >= 1;
    }

    function _getCertificateInfo(uint256 tokenId) 
        internal 
        view 
        returns (CertificateInfo memory info) 
    {
        CertificateData memory mainData = certificateMainData[tokenId];
        CertificateMetadata memory extraData = certificateExtraData[tokenId];
        
        info = CertificateInfo({
            tokenId: tokenId,
            name: mainData.name,
            documentId: mainData.documentIdentification,
            course: mainData.course,
            description: extraData.description,
            institution: extraData.institution,
            area: extraData.area,
            issuedDate: extraData.issuedDate,
            startDate: extraData.startDate,
            endDate: extraData.endDate,
            hoursWorked: uint256(extraData.hoursWorked),
            signatoryName: extraData.signatoryName
        });
    }

    function _getInstitutionCertificateInfo(uint256 tokenId) 
        internal 
        view 
        returns (InstitutionCertificateInfo memory info) 
    {
        CertificateData memory mainData = certificateMainData[tokenId];
        CertificateMetadata memory extraData = certificateExtraData[tokenId];
        
        info = InstitutionCertificateInfo({
            tokenId: tokenId,
            name: mainData.name,
            documentId: mainData.documentIdentification,
            course: mainData.course,
            description: extraData.description,
            area: extraData.area,
            signatoryName: extraData.signatoryName
        });
    }
}