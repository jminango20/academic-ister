//  JS file for html PDF template

const html_template_certificate = `
<!DOCTYPE html>
<html style="-webkit-print-color-adjust: exact; margin: 0">
<head>
    <title>{{web-title}}</title>
    <!-- fonts -->
    <!-- Name Certificate -->
    <link rel="icon" href="https://res.cloudinary.com/dvjnqwzpc/image/upload/v1720111589/blockchain-webpage/cerif-logo_xkfm37.ico" type="image/x-icon">
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
            top: 0;
            left: 0;
            right: 0;
            min-height: 21cm;
            min-width: 29.7cm;
            max-height: 21cm;
            max-width: 29.7cm;
            position: absolute;
            display: flex;
            flex-direction: row;
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
            background-image: url({{url-background}});
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
            margin-bottom: 0.2cm;
            /* margin-left: 2.5cm; */
            margin-top: -4cm;
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
    <div class="bodydiv" style="margin-top: 5cm !important;min-height: 16cm;
    max-height: 16cm !important;">
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
                <p class="montserrat-text" style="text-align: right;">{{issuedAt}}</p>
                <div class="signs-section">
                    <div>
                        <img style="max-width: 2.5cm;min-height: 2cm;max-height: 2cm;" src="{{url-sign-instructor}}" alt="Instructor sign">
                        <div class="sign-linea"></div>
                        <p style="margin-top: 0cm;font-size: 0.4cm !important;" class="montserrat-text-sign"><strong>PhD. Juan Minango</strong></p>
                        <p style="margin-top: -0.35cm;font-size: 0.35cm !important;" class="montserrat-text-sign">Instructor del curso</p>
                    </div>
                    <div>
                        <img style="max-width: auto; min-height: 2cm;max-height: 2cm;" src="{{url-sign-director}}" alt="director sign">
                        <div class="sign-linea"></div>
                        <p style="margin-top: 0cm;font-size: 0.4cm !important;" class="montserrat-text-sign"><strong>PhD. Marcelo Zambrano</strong></p>
                        <p style="margin-top: -0.35cm;font-size: 0.35cm !important;" class="montserrat-text-sign">Director de Investigación</p>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="col2">
            <a href="{{url-hash}}" class="hash-style" target="_blank" rel="noopener noreferrer">Hash: {{transactionHash}}</a>
            <img style="max-width: 1.5cm; border: white solid 0.01cm; border-radius: 5%;" src="data:image/png;base64,{{transactionHashQRBase64}}" alt="Transaction Hash QR Code">
        </div>
    </div>
</body>

</html>
`

export default html_template_certificate;
// module.exports = html_template_certificate;