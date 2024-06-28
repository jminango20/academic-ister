const factoryContract = require('../models/academicFactory');
const responseHandler = require('../views/responseHandler');

exports.deployAcademicCertificate = async (req, res) => {
    const { newOwner, institution } = req.body;
    try {
        const tx = await factoryContract.deployAcademicCertificate(newOwner, institution);
        await tx.wait();
        responseHandler.success(res, {
            message: "Academic Certificate deployed successfully",
            transactionHash: tx.hash
        });
    } catch (error) {
        console.log(error);
        responseHandler.error(res, error.message);
    }
};

exports.getAcademicCertificateDeployed = async (req, res) => {
    const { owner } = req.params;
    try {
        const addresses = await factoryContract.getAcademicCertificateDeployed(owner);
        responseHandler.success(res, addresses);
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};

exports.getAcademicCertificateDeployedByInstitution = async (req, res) => {
    const { institution } = req.body;
    try {
        const addresses = await factoryContract.getAcademicCertificateDeployedByInstitution(institution);
        responseHandler.success(res, addresses);
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};

exports.getLastAcademicCertificateDeployed = async (req, res) => {
    const { owner } = req.params;
    try {
        const address = await factoryContract.getLastAcademicCertificateDeployed(owner);
        responseHandler.success(res, { address });
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};

exports.getLastAcademicCertificateDeployedByInstitution = async (req, res) => {
    const { institution } = req.body;
    try {
        const address = await factoryContract.getLastAcademicCertificateDeployedByInstitution(institution);
        responseHandler.success(res, { address });
    } catch (error) {
        responseHandler.error(res, error.message);
    }
};
