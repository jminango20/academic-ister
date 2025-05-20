// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAcademicCertificate {
    /**
     * @dev Estructura para los parámetros de emisión de certificados
     */
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
    
    /**
     * @dev Evento emitido cuando se crea un nuevo certificado
     */
    event CertificateMinted(
        uint256 indexed tokenId,
        string name,
        string indexed documentIdentification,
        string course,
        string description,
        string indexed institution,
        uint256 issuedAt
    );

    /**
     * @dev Emite un nuevo certificado
     * @param params Parámetros para la emisión del certificado
     * @return ID del token del certificado emitido
     */
    function issueCertificate(
        CertificateIssuanceParams calldata params
    ) external returns (uint256);

    /**
     * @dev Verifica si los datos de un certificado coinciden con los almacenados
     * @param _tokenId ID del token a verificar
     * @param _name Nombre del estudiante
     * @param _documentId Documento de identificación
     * @param _course Nombre del curso
     * @param _institution Institución que emitió el certificado
     * @return Verdadero si los datos coinciden, falso en caso contrario
     */
    function verifyCertificate(
        uint256 _tokenId,
        string calldata _name,
        string calldata _documentId,
        string calldata _course,
        string calldata _institution
    ) external view returns (bool);

    /**
     * @dev Obtiene los metadatos de un certificado por su ID
     * @param _tokenId ID del token del certificado
     * @return name Nombre del estudiante
     * @return documentId Documento de identificación
     * @return course Nombre del curso
     * @return description Descripción del certificado
     * @return institution Institución que emitió el certificado
     * @return issuedAt Fecha de emisión (timestamp)
     * @return startDate Fecha de inicio
     * @return endDate Fecha de fin
     * @return hoursWorked Horas trabajadas
     * @return signatoryName Nombre del firmante
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
        );

    /**
     * @dev Obtiene todos los IDs de certificados para un documento específico
     * @param _documentId Documento de identificación
     * @return Array de IDs de certificados
     */
    function getCertificateIdsByDocumentId(string calldata _documentId) 
        external 
        view 
        returns (uint256[] memory);
    
    /**
     * @dev Obtiene toda la información de certificados para un documento específico
     * @param _documentId Documento de identificación
     * @return tokenIds Array de IDs de certificados
     * @return names Array de nombres
     * @return courses Array de cursos
     * @return descriptions Array de descripciones
     * @return institutions Array de instituciones
     * @return issuedAts Array de fechas de emisión
     * @return startDates Array de fechas de inicio
     * @return endDates Array de fechas de fin
     * @return hoursWorked Array de horas trabajadas
     * @return signatoryNames Array de nombres de firmantes
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
        );

    /**
     * @dev Obtiene el nombre de la institución propietaria
     * @return Nombre de la institución propietaria
     */
    function getOwnerInstitution() 
        external 
        view 
        returns (string memory);

    /**
     * @dev Obtiene todos los IDs de certificados para una institución específica
     * @param _institution Nombre de la institución
     * @return Array de IDs de certificados
     */
    function getCertificateIdsByInstitution(string calldata _institution) 
        external 
        view 
        returns (uint256[] memory);
    
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
        );
}