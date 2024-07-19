const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');

//Certificates routes
router.post('/issueCertificate', academicController.issueCertificate);
router.post('/issueCertificatesBatch', academicController.issueCertificatesBatch);
router.post('/verifyCertificate', academicController.verifyCertificate);
router.get('/certificate/:tokenId', academicController.getCertificateMetadata);
router.get('/certificates', academicController.getAllCertificatesMetadataDB);
router.get('/certificates_by_type', academicController.getAllCertificatesMetadataDB_ByType);
router.post('/certificateIds/', academicController.getCertificateIdsByDocumentId);
router.get('/institutionName', academicController.getInstitutionName);

//Contracts routes
router.get('/get_allcontracts', academicController.getAllContractsDB);
router.post('/issueContract', academicController.issueContract);

//Verify certificates
router.post('/verifyCertificateDB', academicController.verifyCertificate);
router.get('/certificateDB/:tokenId', academicController.getCertificateMetadata);
router.post('/certificateIdsDB/', academicController.getCertificateIdsByDocumentId);

module.exports = router;