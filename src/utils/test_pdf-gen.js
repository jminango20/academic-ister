// Importación de módulos necesarios
const generateCertificatePDF = require('./generateCertificatePDF'); // Asegúrate de ajustar la ruta si es diferente
const fs = require('fs-extra'); // Para operaciones con archivos

// Datos de prueba para generar el certificado
const name = 'Juan Perez';
const documentIdentification = '12345678';
const course = 'Curso de Desarrollo Web';
const description = 'Aprobó con éxito el curso de desarrollo web avanzado.';
const issuedAt = '2024-06-27';
const tokenId = '987654321';
const transactionHash = '0x123abc456def';
const academicAddress = '0xAcademicAddress';

// Función para generar el certificado y guardar el PDF en disco
async function generateAndSaveCertificate() {
    try {
        // Generar el PDF
        const pdfBuffer = await generateCertificatePDF(
            name,
            documentIdentification,
            course,
            description,
            issuedAt,
            tokenId,
            transactionHash,
            academicAddress
        );

        // Guardar el PDF en disco (por ejemplo, en el directorio actual)
        const pdfFilePath = './generated-certificate.pdf';
        await fs.writeFile(pdfFilePath, pdfBuffer);
        
        console.log(`PDF generado y guardado en: ${pdfFilePath}`);
    } catch (error) {
        console.error(`Error al generar el PDF: ${error.message}`);
    }
}

// Invocar la función para generar y guardar el certificado
generateAndSaveCertificate();
