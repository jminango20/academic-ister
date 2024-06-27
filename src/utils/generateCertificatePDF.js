const QRCode = require('qrcode');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const locateChrome = require('locate-chrome');
const htmlTemplate = require('./html_template');

// const logFilePath = path.join(__dirname, 'logfile.txt');
// function writeToLog(message) {
//     fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
// }
// writeToLog('Iniciando script...');
// console.log = (message) => {
//     writeToLog(message); // Redirige los logs a tu archivo
//     process.stdout.write(`${message}\n`); // También imprime en la consola estándar
// };
// console.error = (message) => {
//     writeToLog(`[ERROR] ${message}`);
//     process.stderr.write(`[ERROR] ${message}\n`);
// };

async function generateCertificatePDF(name, documentIdentification, course, description, issuedAt, tokenId, transactionHash, academicAddress) {
    try {
        let htmlTemplateCopy = htmlTemplate;

        const course_l = course;
        // const htmlTemplatePath = './src/utils/certificate-template.html';
        // let htmlTemplate = await fs.readFileSync(htmlTemplatePath, 'utf-8');
        // const cssFilePath = './src/utils/styles.css';
        // const cssStyles = await fs.readFile(cssFilePath, 'utf-8');

        // Insertar estilos CSS en el HTML (dentro de la etiqueta <style>)
        // htmlTemplate = htmlTemplate.replace('</head>', `<style>${cssStyles}</style></head>`);
        // Replace placeholders with actual data
        htmlTemplateCopy = htmlTemplateCopy.replace('{{name}}', name);
        htmlTemplateCopy = htmlTemplateCopy.replace('{{documentIdentification}}', documentIdentification);
        htmlTemplateCopy = htmlTemplateCopy.replace('{{course}}', course);
        htmlTemplateCopy = htmlTemplateCopy.replace('{{course2}}', course_l);
        htmlTemplateCopy = htmlTemplateCopy.replace('{{description}}', description);
        htmlTemplateCopy = htmlTemplateCopy.replace('{{issuedAt}}', issuedAt);
        htmlTemplateCopy = htmlTemplateCopy.replace('{{tokenId}}', tokenId);
        htmlTemplateCopy = htmlTemplateCopy.replace('{{transactionHash}}', transactionHash);

        // const backgroundPath = './src/utils/img/background.png';
        // const backgroundImageBytes = await fs.readFile(backgroundPath);
        // const backgroundBase64 = backgroundImageBytes.toString('base64');
        // htmlTemplate = htmlTemplate.replace('{{Logo}}', backgroundBase64);

        const url = `https://sepolia.etherscan.io/nft/${academicAddress}/${tokenId}`;
        const transactionHashQRCode = await QRCode.toDataURL(url);
        const transactionHashQRBase64 = transactionHashQRCode.split(',')[1];

        htmlTemplateCopy = htmlTemplateCopy.replace('{{transactionHashQRBase64}}', transactionHashQRBase64);
        htmlTemplateCopy = htmlTemplateCopy.replace('{{url-hash}}', url);

        // Generate PDF using Puppeteer
        // const browser = await puppeteer.launch();
        let executablePath = await new Promise(resolve => locateChrome((arg) => resolve(arg))) || '';

        const browser = await puppeteer.launch({
            executablePath,
            headless: false,
            // Performance Tuning For Faster Puppeteer ref: https://apitemplate.io/blog/tips-for-generating-pdfs-with-puppeteer/
            args: [   '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials',
            '--autoplay-policy=user-gesture-required',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            '--disable-domain-reliability',
            '--disable-extensions',
            '--disable-features=AudioServiceOutOfProcess',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-popup-blocking',
            '--disable-print-preview',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-setuid-sandbox',
            '--disable-speech-api',
            '--disable-sync',
            '--hide-scrollbars',
            '--ignore-gpu-blacklist',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--no-pings',
            '--no-sandbox',
            '--no-zygote',
            '--password-store=basic',
            '--use-gl=swiftshader',
            '--use-mock-keychain']
        });
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            console.log(req.url(), req.resourceType());
            req.continue();
        });

        page.on('response', (r) => {
            if (r.status() >= 400)
                console.error(r.url(), r.status());
        });

        await page.setViewport({ width: 1920, height: 1080 });
        await page.setContent(htmlTemplateCopy, { waitUntil: 'networkidle0' });
        // await page.addStyleTag({ path: './src/utils/styles.css' });
        await page.emulateMediaType('screen');
        // await page.screenshot({
        //     path: './src/utils/screenshot.jpg',
        //     fullPage: true,
        //     quality: 100,
        //     encoding: 'binary',
        //     type: 'jpeg',
        //   });

        const pdfOptions = {
            landscape: true, // Establecer formato horizontal
            printBackground: true, // Imprimir fondo e imágenes
            format: 'A4',
        };

        const buffer = await page.pdf(pdfOptions);

        await browser.close();

        return buffer;
    } catch (error) {
        throw new Error(`Error generating PDF: ${error.message}`);
    }
}

module.exports = generateCertificatePDF;
