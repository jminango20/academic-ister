let args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ];


let options = {
      format: 'A5',
      printBackground: true,
      preferCSSPageSize: true
    };

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
                justify-content: start;
                margin-top: -3rem;
                margin-left: 1rem;
            }
    
            .name-participant-section {
                /* background: red; */
                margin-top: 22rem;
                margin-left: 23rem;
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
        </style>
</head>

<body style="margin: 0">
    
    <div class="page-background"></div>
    <div id="bodydiv">
        <div class="name-participant-section">
            <h1 class="participant-name"><strong>{{name}}</strong></h1>
            <p>Por haber aprobado el curso {{course}}: {{description}}.</p>
            <p class="course-name"><strong>{{course2}}</strong></p>
            <p><strong>Fecha:</strong> {{issuedAt}}</p>
            <p><strong>Transaction Hash:</strong></p>
            <a href="{{url-hash}}" class="hash-style">{{transactionHash}}</a>
        </div>
        <div class="qr-code">
            <img style="max-width: 80px; border: white solid 5px;border-radius: 5%;" src="data:image/png;base64,{{transactionHashQRBase64}}" alt="Transaction Hash QR Code">
        </div>
    </div>
</body>

</html>
`;

module.exports = html_template;