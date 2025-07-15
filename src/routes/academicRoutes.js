const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');

router.post('/issueCertificate', academicController.issueCertificate);

module.exports = router;