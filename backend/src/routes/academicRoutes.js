const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');

router.post('/issueCertificate', academicController.issueCertificate);
router.post('/issueCertificatesBatch', academicController.issueCertificatesBatch);
router.post('/verifyCertificate', academicController.verifyCertificate);
router.get('/certificate/:tokenId', academicController.getCertificateMetadata);
router.get('/certificates', academicController.getAllCertificatesMetadataDB);
router.post('/certificateIds/', academicController.getCertificateIdsByDocumentId);
router.get('/institutionName', academicController.getInstitutionName);

router.post('/verifyCertificateDB', academicController.verifyCertificate);
router.get('/certificateDB/:tokenId', academicController.getCertificateMetadata);
router.post('/certificateIdsDB/', academicController.getCertificateIdsByDocumentId);

module.exports = router;