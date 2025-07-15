require("dotenv").config();

const academicAddress = process.env.CONTRACT_ADDRESS_ACADEMIC_ISTER;

const academicContract = require('../models/academicCertificate');
const responseHandler = require('../views/responseHandler');

exports.issueCertificate = async (req, res) => {
    const { 
        name, 
        documentIdentification, 
        course, 
        description, 
        institution,
        area, 
        issuedDate,
        startDate,
        endDate,
        hoursWorked,
        signatoryName 
    } = req.body;
    
    // Validate that required fields are present
    if (!name || !documentIdentification || !course || !description || !institution) {
        return responseHandler.error(res, {
            message: 'Missing required fields. Please provide name, documentIdentification, course, description, and institution.'
        });
    }
    
    const timestamp = Date.now();
    const humanReadableTimestamp = new Date(timestamp).toISOString();
    
    try {
        // Create the parameters struct object for the contract call
        const certificateParams = {
            name: name,
            documentId: documentIdentification,
            course: course,
            description: description,
            institution: institution,
            area: area,
            issuedDate: issuedDate || humanReadableTimestamp.split('T')[0],
            startDate: startDate || humanReadableTimestamp.split('T')[0], 
            endDate: endDate || humanReadableTimestamp.split('T')[0],     
            hoursWorked: hoursWorked || 0,                                
            signatoryName: signatoryName || "ISTER Authority"             
        };
        
        // Call the contract function with the struct
        const tx = await academicContract.issueCertificate(certificateParams);
        const receipt = await tx.wait();
        
        const event = receipt.events.find(event => event.event === 'CertificateMinted');
        if (!event) {
            throw new Error('CertificateMinted event not found in transaction receipt');
        }
        
        const tokenId = event.args.tokenId.toString();
        
        if (!tokenId) {
            throw new Error('Failed to obtain tokenId from transaction receipt');
        }
        
        responseHandler.success(res, {
            message: "Academic Certificate deployed successfully",
            transactionHash: receipt.transactionHash,
            tokenId: tokenId
        });
    } catch (error) {
        if (error.message.includes('Certificate already exists') || 
            error.message.includes('El certificado ya existe')) {
            responseHandler.error(res, {message: 'Certificate already exists'});
        } else {
            responseHandler.error(res, error);
        }
    }
};



