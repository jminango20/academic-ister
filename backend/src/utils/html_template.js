//  JS file for html PDF template

const html_version2 = `
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
            font-family: "Montserrat", sans-serif;
            transform-origin: 0 0;
            transform: scale(1);
            min-height: 21cm;
            min-width: 29.7cm;
            max-height: 21cm;
            max-width: 29.7cm;
        }

        .bodydiv {
            position: absolute;
            display: flex;
            flex-direction: row;
            min-height: 16cm;
        }

        @page {
            size: A4 landscape;
            margin: 0;
            min-height: 21cm;
            min-width: 29.7cm;
            max-height: 21cm;
            max-width: 29.7cm;
        }

        .page-background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            min-height: 21cm;
            min-width: 29.7cm;
            max-height: 21cm;
            max-width: 29.7cm;
            z-index: -1;
            background: #D1EBF9;
            background-image: url('./img/background-certificado.png');
            background-position: fixed;
            background-repeat: repeat;
            background-size: cover;
        }

        .qr-code {
            display: flex;
            flex-direction: column;
            justify-content: start;
            margin-top: 0cm;
            margin-left: 24cm;
        }

        .name-participant-section {
            /* margin-top: 2.5cm; */
            margin-left: 3.2cm;
            margin-right: 1cm;
            min-width: 18cm;
            max-width: 18cm !important;
            padding-bottom: 0.5cm;
        }

        .participant-name {
            font-family: "Playball", cursive !important;
            font-weight: 400;
            font-style: normal;
            color: #28348A;
            font-size: 1.1cm;
        }

        h1 {
            font-size: 1cm;
            margin-bottom: 1cm;
        }

        p {
            font-size: .5cm;
        }

        .playball-regular {
            font-family: "Playball", regular;
            font-weight: 400;
            font-style: normal;
            color: #28348A;
        }

        .montserrat-text {
            font-family: "Montserrat", sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            font-size: 0.4cm !important;
            font-style: normal;
        }
        .montserrat-text-banner {
            font-family: "Montserrat", sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            font-style: normal;
        }
        .montserrat-text-sign {
            font-family: "Montserrat", sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            font-style: normal;
        }
        .montserrat-text-sign {
            font-family: "Montserrat", sans-serif;
            font-optical-sizing: auto;
            font-weight: 300;
            font-style: normal;
        }
        .montserrat-bold-text {
            font-family: "Montserrat", sans-serif;
            font-optical-sizing: auto;
            font-weight: 650;
            font-size: 0.8cm !important;
            font-style: normal;
        }
        .montserrat-bold-text-2 {
            font-family: "Montserrat", sans-serif;
            font-optical-sizing: auto;
            font-weight: 800;
            font-size: 0.65cm !important;
            font-style: normal;
            margin-top: -0.5cm;
            margin-bottom: -0.2cm;
        }

        .hash-style {
            font-size: 0.3cm;
        }

        .hash-style {
            text-decoration: none;
            color: #28348A;
            text-orientation:  sideways;
            writing-mode: vertical-lr;
            align-self: flex-end;
            margin-bottom: 0.5cm;
            /* margin-left: 2.5cm; */
            margin-top: 3cm;
        }

        .hash-style:active {
            color: #28348A;
        }

        .pill {
            display: flex;
            justify-content: center;
            align-items: center;
            width: auto;
            margin-top: 0.5cm;
            height: 1cm;
            background: #3c55c4;
            border-radius: 999em 999em 999em 40px;
        }
        .name-section {
            display: flex;
            flex-direction: column;
            min-height: 2cm;
            max-height: 2cm;
            justify-content: center;
            align-items: center;
            /* border: #28348A solid; */
        }
        
        .linea {
            margin-top: -1cm !important;
            border-top: 1.5px solid #28348A;
            height: 2px;
        }
        .sign-linea {
            border-top: 1.5px solid #28348A;
            height: 2px;
        }
        .signs-section {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }
        .col2{
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: flex-end;
            /* margin-left: 0.5cm; */
            padding-left: 0.99cm;
            padding-bottom: 0.5cm;
        }
        .blockchain-banner-section {
            display: flex;
            justify-content: center;
            /* position: relatie; */
            align-content: center;
            align-items: center;
            align-self: center;
            width: auto;
            margin-top: 0.5cm;
            height: 1cm;
            background: #3c55c4 !important;
            border-radius: 999em 999em 999em 40px;
            margin-left: 4cm;
        }
        .col0 {
            /* border: #28348A solid; */
            margin-left: 0.1cm;
        }
    </style>
</head>

<body style="margin: 0">
    <div class="page-background"></div>
    <div class="bodydiv" style="margin-top: 5cm;">
        <div class="col0">
            <div class="blockchain-banner-section">
                <p class="montserrat-text-banner" 
                style="font-size: 0.25cm;color: white;position: absolute; bottom: 0; width: 100%;margin-top: 80%;
                margin-left: -5cm;background: #ff8300 !important; height: 0.5cm; align-content: center;
            align-items: center;
                border-radius: 999em 999em 999em 999em; max-width: 3cm;"
                >
                <strong>Blockchain NFT</strong></p>  
            </div>
        </div>
        <div class="col1">
            <div class="name-participant-section">
                <h1 class="montserrat-bold-text">El Departamento de Investigación del Instituto Universitario Rumiñahui</h1>
                <h1 class="montserrat-bold-text-2">CERTIFICA A:</h1>
                <h1 class="participant-name"><strong>{{name}}</strong></h1>
                <!-- <hr> -->
                <div class="linea"></div>
                <p class="montserrat-text">Por haber aprobado el curso <strong>{{course}}</strong>: {{description}}.</p>
                <p class="montserrat-text" style="text-align: right;"><strong>Fecha:</strong> {{issuedAt}}</p>
                <div class="signs-section">
                    <div>
                        <img style="max-width: 2.5cm;min-height: 2cm;max-height: 2cm;" src="./signs/firmaJM.svg" alt="Transaction Hash QR Code">
                        <div class="sign-linea"></div>
                        <p style="margin-top: 0cm;font-size: 0.4cm !important;" class="montserrat-text-sign"><strong>PhD. Juan Minango</strong></p>
                        <p style="margin-top: -0.35cm;font-size: 0.35cm !important;" class="montserrat-text-sign">Instructor del curso</p>
                    </div>
                    <div>
                        <img style="max-width: auto; min-height: 2cm;max-height: 2cm;" src="./signs/firmaMZ.svg" alt="Transaction Hash QR Code">
                        <div class="sign-linea"></div>
                        <p style="margin-top: 0cm;font-size: 0.4cm !important;" class="montserrat-text-sign"><strong>PhD. Marcelo Zambrano</strong></p>
                        <p style="margin-top: -0.35cm;font-size: 0.35cm !important;" class="montserrat-text-sign">Director de Investigación</p>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="col2">
            <a href="{{url-hash}}" class="hash-style">Hash: {{transactionHash}}</a>
            <img style="max-width: 1.5cm; border: white solid 0.15cm; border-radius: 5%;" src="data:image/png;base64,{{transactionHashQRBase64}}" alt="Transaction Hash QR Code">
        </div>
    </div>
</body>

</html>
`

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

module.exports = html_version2;