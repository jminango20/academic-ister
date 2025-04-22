// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Contrato de Certificados Académicos del Instituto Tecnológico Superior Rumiñahui (ISTER)
 * @author PhD Juan Carlos Minango Negrete
 * @dev Este contrato permite la emisión y verificación de certificados académicos en blockchain
 * @contact juancarlos.minango@ister.edu.ec
 * 
 * Este contrato ha sido desarrollado para el Instituto Tecnológico Superior Rumiñahui (ISTER)
 * y permite la emisión de certificados académicos como tokens ERC1155.
 */
import "./IAcademicCertificate.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";


contract AcademicCertificate is IAcademicCertificate, ERC1155, Ownable {

    /**
     * @dev Estructura para almacenar los datos principales del certificado
     * @param name Nombre del estudiante
     * @param documentIdentification Número de documento de identidad
     * @param course Nombre del curso o programa académico
     */
    struct CertificateData {
        string name;
        string documentIdentification;
        string course;
    }
    
    /**
     * @dev Estructura para almacenar los metadatos del certificado
     * @param description Descripción del certificado
     * @param institution Institución que emite el certificado
     * @param issuedAt Fecha de emisión del certificado (timestamp)
     */
    struct CertificateMetadata {
        string description;
        string institution;
        uint256 issuedAt;
        string startDate;         // Start date of the work period
        string endDate;           // End date of the work period
        uint256 hoursWorked;      // Number of hours worked
        string signatoryName;     // Name of the person who signed
    }
    
    
    /**
     * @dev Mapeo de hashes de certificados para evitar duplicados
     */
    mapping(bytes32 => bool) private certificateHashes;
    
    /**
     * @dev Mapeo de tokenId a datos principales del certificado
     */
    mapping(uint256 => CertificateData) private certificateMainData;
    
    /**
     * @dev Mapeo de tokenId a metadatos del certificado
     */
    mapping(uint256 => CertificateMetadata) private certificateExtraData;
    
    /**
     * @dev Mapeo de documento de identidad a array de IDs de certificados
     */
    mapping(string => uint256[]) private documentToCertificates;
    
    /**
     * @dev Mapeo de institución a array de IDs de certificados
     */
    mapping(string => uint256[]) private institutionToCertificates;

    /**
     * @dev ID del próximo token a emitir
     */
    uint256 private nextTokenId;
    
    /**
     * @dev Nombre de la institución propietaria del contrato (ISTER)
     */
    string public ownerInstitution;
    

    /**
     * @dev Constructor del contrato
     * @param initialOwner Dirección del propietario inicial del contrato
     * @param _ownerInstitution Nombre de la institución propietaria
     */
    constructor(address initialOwner, string memory _ownerInstitution) 
        ERC1155("") 
        Ownable(initialOwner) 
    {
        nextTokenId = 1;
        ownerInstitution = _ownerInstitution; 
    }

    /**
     * @dev Emite un nuevo certificado
     * @param params Parámetros para la emisión del certificado
     * @return ID del token del certificado emitido
     */
    function issueCertificate(
        CertificateIssuanceParams calldata params
    ) external onlyOwner returns (uint256) {
        // Creamos el hash del certificado
        bytes32 certHash = keccak256(abi.encodePacked(
            params.name, params.documentId, params.course, params.institution
        ));
        
        require(!certificateHashes[certHash], "El certificado ya existe");

        uint256 tokenId = nextTokenId++;
        uint256 timestamp = block.timestamp;
        
        // Almacenamos los datos del certificado
        certificateMainData[tokenId] = CertificateData(
            params.name,
            params.documentId,
            params.course
        );
        
        certificateExtraData[tokenId] = CertificateMetadata(
            params.description,
            params.institution,
            timestamp,
            params.startDate,
            params.endDate,
            params.hoursWorked,
            params.signatoryName
        );
        
        // Actualizamos los mapeos
        documentToCertificates[params.documentId].push(tokenId);
        institutionToCertificates[params.institution].push(tokenId);
        
        // Marcamos el hash como usado
        certificateHashes[certHash] = true;
        
        // Emitimos el token como NFT 
        _mint(msg.sender, tokenId, 1, "");
        
        // Emitimos el evento
        emit CertificateMinted(
            tokenId,
            params.name,
            params.documentId,
            params.course,
            params.description,
            params.institution,
            timestamp
        );
        
        return tokenId;
    }

    /**
     * @dev Verifica si un token existe
     * @param _tokenId ID del token a verificar
     * @return Verdadero si el token existe, falso en caso contrario
     */
    function _exists(uint256 _tokenId) internal view returns (bool) {
        return _tokenId < nextTokenId && _tokenId >= 1;
    }

    /**
     * @dev Verifica si los datos de un certificado coinciden con los almacenados
     * @param _tokenId ID del token a verificar
     * @param _name Nombre del estudiante
     * @param _documentId Documento de identificación
     * @param _course Nombre del curso
     * @return Verdadero si los datos coinciden, falso en caso contrario
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
        
        // Comparamos los hashes de los datos de entrada con los datos almacenados (excluyendo institución y timestamp)
        bytes32 inputHash = keccak256(abi.encodePacked(_name, _documentId, _course, _institution));
        bytes32 storedHash = keccak256(abi.encodePacked(
            mainData.name,
            mainData.documentIdentification,
            mainData.course,
            extraData.institution
        ));
        
        return inputHash == storedHash;
    }

    /**
     * @dev Obtiene los metadatos de un certificado por su ID
     * @param _tokenId ID del token del certificado
     * @return name Nombre del estudiante
     * @return documentId Documento de identificación
     * @return course Nombre del curso
     * @return description Descripción del certificado
     * @return institution Institución que emitió el certificado
     * @return issuedAt Fecha de emisión (timestamp)
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
            uint256 issuedAt,
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
            extraData.issuedAt,
            extraData.startDate,
            extraData.endDate,
            extraData.hoursWorked,
            extraData.signatoryName
        );
    }

    /**
     * @dev Obtiene todos los IDs de certificados para un documento específico
     * @param _documentId Documento de identificación
     * @return Array de IDs de certificados
     */
    function getCertificateIdsByDocumentId(string calldata _documentId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return documentToCertificates[_documentId];
    }
    
    /**
     * @dev Obtiene toda la información de certificados para un documento específico
     * @param _documentId Documento de identificación
     * @return tokenIds Array de IDs de certificados
     * @return names Array de nombres
     * @return courses Array de cursos
     * @return descriptions Array de descripciones
     * @return institutions Array de instituciones
     * @return issuedAts Array de fechas de emisión
     */
    function getCertificatesByDocumentId(string calldata _documentId)
        external
        view
        returns (
            uint256[] memory tokenIds,
            string[] memory names,
            string[] memory courses,
            string[] memory descriptions,
            string[] memory institutions,
            uint256[] memory issuedAts,
            string[] memory startDates,
            string[] memory endDates,
            uint256[] memory hoursWorked,
            string[] memory signatoryNames
        )
    {
        uint256[] memory ids = documentToCertificates[_documentId];
        uint256 count = ids.length;
        
        names = new string[](count);
        courses = new string[](count);
        descriptions = new string[](count);
        institutions = new string[](count);
        issuedAts = new uint256[](count);
        startDates = new string[](count);
        endDates = new string[](count);
        hoursWorked = new uint256[](count);
        signatoryNames = new string[](count);
        
        for (uint256 i = 0; i < count; i++) {
            uint256 tokenId = ids[i];
            CertificateData memory mainData = certificateMainData[tokenId];
            CertificateMetadata memory extraData = certificateExtraData[tokenId];
            
            names[i] = mainData.name;
            courses[i] = mainData.course;
            descriptions[i] = extraData.description;
            institutions[i] = extraData.institution;
            issuedAts[i] = extraData.issuedAt;
            startDates[i] = extraData.startDate;
            endDates[i] = extraData.endDate;
            hoursWorked[i] = extraData.hoursWorked;
            signatoryNames[i] = extraData.signatoryName;
        }
        
        return (ids, names, courses, descriptions, institutions, issuedAts, startDates, endDates, hoursWorked, signatoryNames);
    }

    /**
     * @dev Obtiene el nombre de la institución propietaria (ISTER)
     * @return Nombre de la institución propietaria
     */
    function getOwnerInstitution() 
        external 
        view 
        returns (string memory) 
    {
        return ownerInstitution;
    }

    /**
     * @dev Obtiene todos los IDs de certificados para una institución específica
     * @param _institution Nombre de la institución
     * @return Array de IDs de certificados
     */
    function getCertificateIdsByInstitution(string calldata _institution) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return institutionToCertificates[_institution];
    }
    
    /**
     * @dev Obtiene toda la información de certificados emitidos por una institución específica
     * @param _institution Nombre de la institución
     * @return tokenIds Array de IDs de certificados
     * @return names Array de nombres
     * @return documentIds Array de documentos de identificación
     * @return courses Array de cursos
     * @return descriptions Array de descripciones
     * @return issuedAts Array de fechas de emisión
     */
    function getCertificatesByInstitution(string calldata _institution)
        external
        view
        returns (
            uint256[] memory tokenIds,
            string[] memory names,
            string[] memory documentIds,
            string[] memory courses,
            string[] memory descriptions,
            uint256[] memory issuedAts
        )
    {
        uint256[] memory ids = institutionToCertificates[_institution];
        uint256 count = ids.length;
        
        names = new string[](count);
        documentIds = new string[](count);
        courses = new string[](count);
        descriptions = new string[](count);
        issuedAts = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            uint256 tokenId = ids[i];
            CertificateData memory mainData = certificateMainData[tokenId];
            CertificateMetadata memory extraData = certificateExtraData[tokenId];
            
            names[i] = mainData.name;
            documentIds[i] = mainData.documentIdentification;
            courses[i] = mainData.course;
            descriptions[i] = extraData.description;
            issuedAts[i] = extraData.issuedAt;
        }
        
        return (ids, names, documentIds, courses, descriptions, issuedAts);
    }
}