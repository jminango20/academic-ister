const QRCode = require('qrcode');
const fs = require('fs-extra');
const htmlToPdf = require('html-pdf');

async function generateCertificatePDF(name, documentIdentification, course, description, issuedAt, tokenId, transactionHash, academicAddress) {

    try {

        const htmlTemplatePath = './src/utils/certificate-template.html';
        let htmlTemplate = await fs.readFile(htmlTemplatePath, 'utf-8');
    
        // Replace placeholders with actual data
        htmlTemplate = htmlTemplate.replace('{{name}}', name);
        htmlTemplate = htmlTemplate.replace('{{documentIdentification}}', documentIdentification);
        htmlTemplate = htmlTemplate.replace('{{course}}', course);
        htmlTemplate = htmlTemplate.replace('{{description}}', description);
        htmlTemplate = htmlTemplate.replace('{{issuedAt}}', issuedAt);
        htmlTemplate = htmlTemplate.replace('{{tokenId}}', tokenId);
        htmlTemplate = htmlTemplate.replace('{{transactionHash}}', transactionHash);

        const logoPath = './src/utils/Logo.jpg';
        const logoImageBytes = await fs.readFile(logoPath);
        const logoBase64 = logoImageBytes.toString('base64');
        htmlTemplate = htmlTemplate.replace('{{Logo}}', logoBase64);


        const url = `https://sepolia.etherscan.io/nft/${academicAddress}/${tokenId}`;        
        const transactionHashQRCode = await QRCode.toDataURL(url);
        const transactionHashQRBase64 = transactionHashQRCode.split(',')[1];
    
        htmlTemplate = htmlTemplate.replace('{{transactionHashQRBase64}}', transactionHashQRBase64);
    
        const options = { format: 'A4', timeout: 30000 };
    
        return new Promise((resolve, reject) => {
            htmlToPdf.create(htmlTemplate, options).toBuffer((err, buffer) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(buffer);
            });
        });
    } catch (error) {
        throw new Error(`Error generating PDF: ${error.message}`);
    }
}

module.exports = generateCertificatePDF;
