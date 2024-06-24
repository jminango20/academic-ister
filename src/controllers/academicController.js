const pool = require('../resources/db');
const fs = require('fs-extra');
const generateCertificatePDF = require('../utils/generateCertificatePDF');
require("dotenv").config();

const academicAddress = process.env.CONTRACT_ADDRESS_ACADEMIC_ISTER;

const academicContract = require('../models/academicCertificate');
const responseHandler = require('../views/responseHandler');

exports.issueCertificate = async (req, res) => {
    const { name, documentIdentification, course, description } = req.body;
    const timestamp = Date.now();
    const humanReadableTimestamp = new Date(timestamp).toISOString();

    try {
        const tx = await academicContract.issueCertificate(name, documentIdentification, course, description);
        const receipt = await tx.wait();
        const event = receipt.events.find(event => event.event === 'CertificateMinted');
        if (!event) {
            throw new Error('CertificateMinted event not found in transaction receipt');
        }

        const tokenId = event.args.tokenId.toString();
        
        if (!tokenId) {
            throw new Error('Failed to obtain tokenId from transaction receipt');
        }

        await pool.query('INSERT INTO certificates (name, document_id, course, description, issued_at, token_id, tx_hash) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
            [name, documentIdentification, course, description, humanReadableTimestamp, tokenId, receipt.transactionHash]);

        
        const pdfBuffer = await generateCertificatePDF(name, documentIdentification, course, description, humanReadableTimestamp, tokenId, receipt.transactionHash, academicAddress);
        
        const pdfFileName = `certificate_${name}-${tokenId}-${timestamp}.pdf`;
        const filePath = `./certificatesInPDF/${pdfFileName}`; 
        await fs.writeFile(filePath, pdfBuffer);
    
        responseHandler.success(res, {
            message: "Academic Certificate deployed successfully",
            transactionHash: receipt.transactionHash,
            tokenId: tokenId,
            pdfDownloadLink: filePath
        });
    } catch (error) {
        if (error.message.includes('Certificate already exists')) {
            responseHandler.error(res, {message:'Certificate already exists'});
        } else {
            responseHandler.error(res, error);
        }
    }
};

exports.issueCertificatesBatch = async (req, res) => {
    const { names, documentIdentifications, course, description } = req.body;
    const timestamp = Date.now();
    const humanReadableTimestamp = new Date(timestamp).toISOString();
    
    if (!Array.isArray(names) || !Array.isArray(documentIdentifications) || names.length !== documentIdentifications.length) {
        return responseHandler.error(res, "Invalid or mismatched arrays for names and documentIdentifications");
    }

    try {
        const tx = await academicContract.issueCertificatesBatch(names, documentIdentifications, course, description);
        const receipt = await tx.wait();

        const eventLogs = receipt.events.filter(event => event.event === "CertificateMinted");
        if (!eventLogs || eventLogs.length !== names.length) {
            throw new Error('Mismatch between the number of events and names');
        }

        const tokenIds = eventLogs.map(event => event.args.tokenId.toNumber());

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (let i = 0; i < names.length; i++) {
                await client.query(
                    'INSERT INTO certificates (name, document_id, course, description, issued_at, token_id, tx_hash) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [names[i], documentIdentifications[i], course, description, humanReadableTimestamp, tokenIds[i], receipt.transactionHash]
                );
            }

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }  

        responseHandler.success(res, { 
            transactionHash: receipt.transactionHash,
            tokenIds: tokenIds
         });
    } catch (error) {
        responseHandler.error(res, error);
    }
};

exports.verifyCertificate = async (req, res) => {
    const { tokenId, name, documentIdentification, course, description } = req.body;
    try {
        const isValid = await academicContract.verifyCertificate(tokenId, name, documentIdentification, course, description);
        responseHandler.success(res, { isValid });
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};

exports.getCertificateMetadata = async (req, res) => {
    const { tokenId } = req.params;
    try {
        const certificate = await academicContract.getCertificateMetadata(tokenId);
        
        if (certificate.name === '' && certificate.documentIdentification === '' && certificate.course === '' && certificate.description === '') {
            responseHandler.error(res, { message: 'Certificate not found' });
        } else {
            responseHandler.success(res, { certificate });
        }
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};

exports.getCertificateIdsByDocumentId = async (req, res) => {
    const { documentId } = req.body;
    try {
        const certificateIds = await academicContract.getCertificateIdsByDocumentId(documentId);
        const formattedIds = certificateIds.map(id => id.toString());
        responseHandler.success(res, { certificateIds: formattedIds });
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};

exports.getInstitutionName = async (req, res) => {
    try {
        const institutionName = await academicContract.getInstitutionName();
        responseHandler.success(res, { institutionName });
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};

//Query using DB
exports.verifyCertificateDB = async (req, res) => {
    const { tokenId, name, documentIdentification, course, description } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query(
            'SELECT * FROM certificates WHERE token_id = $1 AND name = $2 AND document_id = $3 AND course = $4 AND description = $5',
            [tokenId, name, documentIdentification, course, description]
        );
        client.release();

        const isValid = result.rows.length > 0;
        responseHandler.success(res, { isValid });
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};

exports.getCertificateMetadataDB = async (req, res) => {
    const { tokenId } = req.params;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM certificates WHERE token_id = $1', [tokenId]);
        client.release();

        if (result.rows.length === 0) {
            responseHandler.error(res, { message: 'Certificate not found' });
        } else {
            const certificate = result.rows[0];
            responseHandler.success(res, { certificate });
        }
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};

exports.getCertificateIdsByDocumentIdDB = async (req, res) => {
    const { documentId } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT token_id FROM certificates WHERE document_id = $1', [documentId]);
        client.release();

        const certificateIds = result.rows.map(row => row.token_id.toString());
        responseHandler.success(res, { certificateIds });
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};


