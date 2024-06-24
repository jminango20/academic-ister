const express = require('express');
const router = express.Router();
const factoryController = require('../controllers/factoryController');

router.post('/deployAcademicCertificate', factoryController.deployAcademicCertificate);
router.get('/getAcademicCertificateDeployed/:owner', factoryController.getAcademicCertificateDeployed);
router.post('/getAcademicCertificateDeployedByInstitution', factoryController.getAcademicCertificateDeployedByInstitution);
router.get('/getLastAcademicCertificateDeployed/:owner', factoryController.getLastAcademicCertificateDeployed);
router.post('/getLastAcademicCertificateDeployedByInstitution', factoryController.getLastAcademicCertificateDeployedByInstitution);

module.exports = router;
