//  JS file for html PDF template

const html_template = `
<!DOCTYPE html>
<html style="-webkit-print-color-adjust: exact; margin: 0">
<head>
    <title>Web Certificate</title>
    <!-- fonts -->
    <!-- Name Certificate -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Playball&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playball&display=swap"
        rel="stylesheet">
        <style>
            body {
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: #28348A;
                /* font-family: Arial, sans-serif; */
                font-family: "Montserrat", sans-serif;
            }
    
            @page {
                size: A4 landscape;
                margin: 0;
            }
    
            .page-background {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 100vh;
                z-index: -1;
                background: #D1EBF9;
                background-image: url('https://res.cloudinary.com/dvjnqwzpc/image/upload/v1719439245/blockchain-webpage/background_uqrjd5.png');
                /* linear-gradient(rgba(214, 245, 255, 0.5), rgba(0, 0, 0, 0.5)); */
                background-position: fixed;
                background-repeat: repeat;
                background-size: cover;
            }
    
            .qr-code {
                display: flex;
                flex-direction: column;
                justify-content: start;
                margin-top: -2.8rem;
                margin-left: 1rem;
            }
    
            .name-participant-section {
                /* background: red; */
                margin-top: 22rem;
                margin-left: 22rem;
                /* border: #28348A solid; */
                max-width: 50%;
            }
    
            .participant-name {
                font-family: "Playball", cursive !important;
                font-weight: 400;
                font-style: normal;
                color: #28348A;
                font-size: 45px;
            }
    
            h1 {
                font-size: 3em;
                margin-bottom: 20px;
            }
    
            p {
                font-size: 1.5em;
            }
    
            /* fonts */
            .playball-regular {
                font-family: "Playball", cursive;
                font-weight: 400;
                font-style: normal;
                color: #28348A;
            }
    
            .montserrat-text {
                font-family: "Montserrat", sans-serif;
                font-optical-sizing: auto;
                font-weight: 400;
                font-style: normal;
            }
            .hash-style {
                text-decoration: none;
                color: #28348A; /* Color inicial del enlace */
                margin-top: -5px;
            }

            .hash-style:active {
                color: #28348A; /* Color del enlace al hacer clic */
            }
            .pill {
                display: flex;
                justify-content: center;
                align-items: center;
                width: auto;
                margin-top: 35px;
                height: 40px;
                background: #04AA6D;
                border-radius: 999em 999em 999em 40px;
                
            }
        </style>
</head>

<body style="margin: 0">
    
    <div class="page-background"></div>
        <div id="bodydiv">
            <div class="name-participant-section">
                <h1 class="participant-name"><strong>{{name}}</strong></h1>
                <p class=".playball-regular">Por haber aprobado el curso <strong>{{course}}</strong>: {{description}}.</p>
                <!-- <p class="course-name"><strong>{{course2}}</strong></p> -->
                <p class=".playball-regular">Emitido el {{issuedAt}}</p>
                <p class=".playball-regular"><strong>Transaction Hash:</strong></p>
                <a href="https://console.cloudinary.com/console/c-dbe373d6f0e0210e4726b1a020abd8/media_library/folders/c82b480d1a892b94ed34f5d4ade8efb553?view_mode=mosaic" class="hash-style">0xeeeb180c9788e1758bb3af0f152d683ba6ccc40053dc0a27519f24f0649729</a>
                <div class="pill">
                    <p class=".playball-regular" style="font-size: small;color: white;"><strong>Certificado NFT registrado en la Blockchain</strong></p>  
                </div>
        </div>
        <div class="qr-code">
            <img style="max-width: 75px; border: white solid 5px;border-radius: 5%;" src="data:image/png;base64,{{transactionHashQRBase64}}" alt="Transaction Hash QR Code">
        </div>
    </div>
</body>

</html>
`;

module.exports = html_template;