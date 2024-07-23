import React, { useState, useEffect, forwardRef } from "react";
import { useTheme } from '@mui/material/styles';
import { StyledTextField, BootstrapInput } from "@utils/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box, Button, Divider, Typography,
  FormControl, Modal, Select, MenuItem,
  Radio, RadioGroup, FormLabel, FormControlLabel 
} from '@mui/material';

// Icons
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';

import QRCode from 'qrcode'
import useAPIsCertificate from '@hooks/useAPIsCertificate';
import useAPIsContract from '@hooks/useAPIsContract';
import {html_course_template_certificate, html_project_template_certificate} from "@utils/certificate-template/html_template"
import { formatDate, formatDateWCity } from "@utils/helpers"
import { callContractCreateCertificate } from "@services/web3_service";
import { useAuthUser } from "@contexts/AuthUserContext";
import Progress_loading from '@utils/Progress_loading';
import {CancelTransactionDialogSlide, SucessfullyTransactionDialogSlide} from "@utils/AlertDialogSlide";


const _url_background = import.meta.env.VITE_URL_BACKGROUND_CERTIFICATE;
const _sign_instructor = import.meta.env.VITE_URL_SIGN_INSTRUCTOR;
const _sign_director = import.meta.env.VITE_URL_SIGN_DIRECTOR;
const _sign_analyst = import.meta.env.VITE_URL_SIGN_ANALYST;
const _name_signer_analyst = import.meta.env.VITE_NAME_SIGNER_ANALYST;
const _name_signer_director = import.meta.env.VITE_NAME_SIGNER_DIRECTOR;
const _id_director = import.meta.env.VITE_ID_DIRECTOR;
const _charge_signer_director = import.meta.env.VITE_CHARGE_SIGNER_DIRECTOR;
const _charge_signer_analyst = import.meta.env.VITE_CHARGE_SIGNER_ANALYST;
// const ContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS_ACADEMIC_ISTER;



const styleModal = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  // bgcolor: 'background.paper',
  textAlign: 'center',
  border: '2px solid #000',
  color: 'white',
  // boxShadow: 24,
  padding: 4,
  borderRadius: 40,
  backgroundColor: '#ffffff',
};


const CRUDCertificate = () => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [rows, setRows] = useState([]);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateSection, setOpenCreateSection] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleCloseCreateSection = () => setOpenCreateSection(false);
  
  const [contracts, setContracts] = useState([]);
  const [contrato, setContrato] = useState('');
  const [contractHash, setContractHash] = useState('');
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('USAR CONTRATO');
  const [typeCertificate, setTypeCertificate] = useState('Nombre del Proyecto');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const theme = useTheme();

  //Radio Buttons
  const [certifType, setCertifType] = useState('proyecto');
  const [dataCertificatesType, setDataCertificatesType] = useState('proyecto');
  const [prevCertificatesType, setPrevCertificatesType] = useState(dataCertificatesType);

  //Table columns
  const columnsTable = [
    { id: 'document_id', label: 'Identificación', minWidth: 70, align: 'center' },
    { id: 'name', label: 'Nombre del Participante', minWidth: 170, align: 'center' },
    { id: 'course', label: 'Curso/Proyecto', minWidth: 170, align: 'center' },
    { id: 'issued_at', label: 'Fecha de Emisión', minWidth: 80, align: 'center' },
    { id: 'token_id', label: 'Token ID', minWidth: 80, align: 'center' },
    { id: 'tx_hash', label: 'Hash de la Transacción', minWidth: 100, maxWidth: 150, align: 'center' },
    { id: 'btns-section', label: 'Acciones', minWidth: 100, align: 'center' },
  ]

  const handleChangeRadio = (event) => {
    setCertifType(event.target.value);
  };
  const handleChangeRadioData = (event) => {
    setDataCertificatesType(event.target.value);
  };
  
  const { userAcc, ethWallet, connectionErr, callContractMethod } = useAuthUser();
  
  let html_template_course = html_course_template_certificate;
  let html_template_project = html_project_template_certificate;
  
  const handleOpenCreateSection = () => {
    getContracts();
    setOpenCreateSection(true);
  };

  // API REST variables
  const { data, loading, error, dataCertificate, loadingData, errorData,
    submitCertificate, getCertificatesPagination_ByType } = useAPIsCertificate();
  
  const { dataContract, loadingDataContract, errorDataContract, getContracts } = useAPIsContract();

  

  // #region USE_EFFECT_SECTION
  // Use effect to update the open variable when the button is pressed
  useEffect(() => {
    if (ethWallet) {
      handleClose();
    }
  }, [ethWallet]);

  useEffect(() => {
    if (connectionErr) {
      handleClose();
    }
  }, [connectionErr]);

  useEffect(() => {
    if (certifType == "proyecto") {
      setTypeCertificate("Nombre del Proyecto");
    } else {
      setTypeCertificate("Nombre del Curso");
    }
  }, [certifType])
  

  useEffect(() => {
    if (prevCertificatesType != dataCertificatesType) {
      setPage(0);
      getCertificatesPagination_ByType(1, rowsPerPage, dataCertificatesType);
      setPrevCertificatesType(dataCertificatesType);
    } else {
      getCertificatesPagination_ByType(page + 1, rowsPerPage, dataCertificatesType);
    }
  }, [page, rowsPerPage, dataCertificatesType]);

  useEffect(() => {
    if (dataCertificate && dataCertificate.certificates) {
      setRows(dataCertificate.certificates || []);
    }
  }, [dataCertificate?.certificates]);

  useEffect(() => {
    if (dataCertificate) {
      if (dataCertificate.certificates) {
        setRows(dataCertificate.certificates);
        setTotalCertificates(parseInt(dataCertificate.totalCertificates, 10) || 0);
      }
    }
  }, [dataCertificate]);

  // USE EFFECT for contracts
  useEffect(() => {
    if (dataContract && dataContract.contracts) {
      setContracts(dataContract.contracts || []);
    }
  }, [dataContract?.contracts]);

  useEffect(() => {
    if (dataContract) {
      if (dataContract.contracts) {
        setContracts(dataContract.contracts);
      }
    }
  }, [dataContract]);

  // #endregion


  // Form variables to create certificate
  const [formData, setFormData] = useState({
    name: '',
    documentIdentification: '',
    course: '',
    description: '',
    tokenId: '', 
    transactionHash: '', 
    contract_address: '',
  });

  const clearFormData = () => {
    setFormData({
      name: '',
      documentIdentification: '',
      course: '',
      description: '',
      tokenId: '', 
      transactionHash: '', 
      contract_address: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "documentIdentification") {
      // Check if the value is a number and its length is between 10 and 13
      if (!/^\d*$/.test(value) || value.length > 13) {
        return;
      }
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreateCertificate = async (contractAddress, name, ci, course, description) => {
    const methodName = 'issueCertificate';
    const params = [name, ci, course, description];

    try {
      const { tx_hash, tokenId, timestamp } = await callContractMethod(contractAddress, methodName, params);
      console.log('Transaction Hash:', tx_hash, timestamp);
      return { tx_hash, tokenId, timestamp };
    } catch (error) {
      console.error('Error creating certificate:', error);
      return [null, null];
    }
  };

  const handleSubmit = async (e) => {
    handleOpen();
    e.preventDefault();
    if (formData.documentIdentification.length < 10 || formData.documentIdentification.length > 13) {
      alert("El documento de identidad no es correcto.");
      return;
    }

    try {
      const { tx_hash, tokenId, timestamp } = await handleCreateCertificate(contractHash, formData.name, formData.documentIdentification, formData.course, formData.description);

      if (tokenId != null) {
          setFormData(prevState => {
          const updatedFormData = {
            ...prevState,
            tokenId: tokenId,
            transactionHash: tx_hash,
            timestamp: timestamp.toString(),
            type: certifType
          };
          
          // Almacenar datos en DB
          const receipt = submitCertificate(updatedFormData);
          console.log(receipt);
          setModalMessage('La transacción se realizó correctamente.');
          handleOpenDialog();
          clearFormData();
          setPage(0);
          return(updatedFormData);
      });
      }
    } catch (error) {
      setModalMessage(`Error al crear el certificado: ${error.message}`);
      console.log(error);
      setOpen(false);
    } finally {
      setModalOpen(true);
      handleOpenDialog();
      setOpen(false);
    }
  };

  // Generate QR Code based on url
  const getTransactionHashQRCode = async (url) => {
    try {
        const transactionHashQRCode = await QRCode.toDataURL(url);
        return transactionHashQRCode.split(',')[1];
    } catch (error) {
        console.error('Error al generar el QR code:', error);
        throw error;
    }
  };


const generateCertificateHTML = (rowData, transactionHashQRBase64) => {
  try {
      let html_template_copy;
      let doc_id;
      if (rowData.type == 'curso') {
        html_template_copy = html_course_template_certificate; // Copiar el template del certificado original
      } else {
        html_template_copy = html_project_template_certificate; // Copiar el template del certificado de proyecto original
        doc_id = rowData.document_id;
      }
      const url = `https://polygonscan.com/nft/${rowData.addresscontract}/${rowData.token_id}`;
      const course = rowData.course;

      // Reemplazar los placeholders con los datos de la fila específica
      html_template_copy = html_template_copy.replace('{{web-title}}', `certificado-${rowData.name}-${
        (function(text, maxLength) {
          return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
      })(rowData.course, 20)
      }-${formatDate(rowData.issued_at)}`);

      html_template_copy = html_template_copy.replace('{{name}}', rowData.name);
      html_template_copy = html_template_copy.replace('{{documentIdentification}}', rowData.document_id);
      html_template_copy = html_template_copy.replace('{{course}}', rowData.course);
      html_template_copy = html_template_copy.replace('{{course2}}', course);
      html_template_copy = html_template_copy.replace('{{description}}', rowData.description);
      html_template_copy = html_template_copy.replace('{{issuedAt}}', formatDateWCity('Sangolquí', rowData.issued_at));
      html_template_copy = html_template_copy.replace('{{transactionHash}}', rowData.tx_hash);
      html_template_copy = html_template_copy.replace('{{url-background}}', _url_background);
      html_template_copy = html_template_copy.replace('{{url-sign-instructor}}', _sign_instructor);
      html_template_copy = html_template_copy.replace('{{transactionHashQRBase64}}', transactionHashQRBase64);
      html_template_copy = html_template_copy.replace('{{url-hash}}', url);
      // Conditional to verify which person sign the project certificate
      if (doc_id === _id_director) {
        html_template_copy = html_template_copy.replace('{{name-signer}}', _name_signer_analyst);
        html_template_copy = html_template_copy.replace('{{charge-signer}}', _charge_signer_analyst);
        html_template_copy = html_template_copy.replace('{{url-sign-director}}', _sign_analyst);
      } else {
        html_template_copy = html_template_copy.replace('{{name-signer}}', _name_signer_director);
        html_template_copy = html_template_copy.replace('{{charge-signer}}', _charge_signer_director);
        html_template_copy = html_template_copy.replace('{{url-sign-director}}', _sign_director);
      }

      // Abrir una nueva pestaña con el HTML generado
      const newWindow = window.open();
      newWindow.document.open();
      newWindow.document.write(html_template_copy);
      newWindow.document.close();
  } catch (error) {
      console.error('Error al generar el certificado HTML:', error);
  }
};


  const openCertificateHTML = async (rowData) => {
    try {
        const url = `https://polygonscan.com/nft/${rowData.addresscontract}/${rowData.token_id}`;
        const transactionHashQRBase64 = await getTransactionHashQRCode(url);
        generateCertificateHTML(rowData, transactionHashQRBase64);
    } catch (error) {
        console.error('Error al abrir el certificado HTML:', error);
    }
};

const handleOpenCertificate = () => {
  openCertificateHTML(formData);
};


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectChange = (event) => {
    const selectedContractId = event.target.value;
    setContrato(selectedContractId);
    const selectedContract = contracts.find(contract => contract.idcontract === selectedContractId);
    if (selectedContract) {
      setContractHash(selectedContract.addresscontract);
    }
  };

  const handleButtonClick = () => {
    if (isSelectDisabled) {
      // Permitir seleccionar de nuevo
      setIsSelectDisabled(false);
      setButtonText('USAR CONTRATO');
      setContrato('');
      setContractHash('');
      setFormData(prevState => ({
        ...prevState,
        contract_address: ''
      }));
    } else {
      const selectedContract = contracts.find(contract => contract.idcontract === contrato);
      
      if (selectedContract && selectedContract != undefined) {
        // Deshabilitar selección si se ha seleccionado un contrato
        setFormData(prevState => ({
          ...prevState,
          contract_address: selectedContract.addresscontract
        }));
        setIsSelectDisabled(true);
        setButtonText('CAMBIAR DE CONTRATO');
      } else {
        alert('Por favor, seleccione un contrato antes de continuar.');
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        color: "white",
        width: "100%",
      }}
    >
      <Typography style={{ fontWeight: "bold" }}>
        {openCreateSection ? 'CREAR CERTIFICADO' : ''}</Typography>
      { !openCreateSection ? (
        <Button
                sx={{
                  bgcolor: "#39C8C8",
                  "&:hover": { bgcolor: "#45EEEE" },
                  minWidth: "20%",
                  minHeight: "20%",
                  maxWidth: "40%",
                  marginBottom: "0.5rem",
                  // marginTop: "2rem"
                }}
                color="primary"
                variant="contained"
                onClick={handleOpenCreateSection}
              >
                Crear nuevo certificado
              </Button>

      ): (
        <>
          <Typography component={'div'} label="Input 1"
            sx={{ minWidth: "20%" }}>Seleccione el contrato asociado a su billetera:</Typography>
          <Box sx={{
            display: "flex", flexDirection: "row", gap: 2,
            paddingRight: "20%"
          }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
                alignItems: "center",
                minWidth: "33.33%",
    
              }}
            >
              <Typography component={'span'} label="Input 1">NOMBRE DEL CONTRATO</Typography>
              <FormControl required sx={{ minWidth: "90%" }} disabled={isSelectDisabled}>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={contrato}
                label="Contrato *"
                onChange={handleSelectChange}
                sx={{ minWidth: "90%" }}
                input={<BootstrapInput />}
                enab
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {contracts.map((contract) => (
                  <MenuItem key={contract.idcontract} value={contract.idcontract}>
                    {contract.namecontract}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
              {/* <StyledTextField
                label="Contract address"
                InputLabelProps={{
                  style: { color: "white" },
                }}
                InputProps={{
                  readOnly: true,
                  style: { color: "white" },
                }}
                defaultValue=""
                size="small"
                id="outlined-disabled"
                sx={{ minWidth: "90%" }}
              /> */}
            </Box>
            <Box
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
                alignItems: "center",
                minWidth: "33.33%",
              }}
            >
              <Typography component={'div'} label="Input 1">HASH DEL CONTRATO</Typography>
              <StyledTextField
                label="Contract hash"
                InputLabelProps={{
                  style: { color: "white" },
                }}
                InputProps={{
                  style: { color: "white" },
                  readOnly: true,
                }}
                defaultValue=""
                value={contractHash}
                size="small"
                id="outlined-disabled"
                sx={{ minWidth: "90%" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 4,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Button
                sx={{
                  bgcolor: !isSelectDisabled ? "#39C8C8" : "#227878",
                  "&:hover": { bgcolor: !isSelectDisabled ? "#45EEEE": "#2da0a0" },
                  minWidth: "60%",
                  minHeight: "70%",
                  maxWidth: "3rem",
                  marginTop: "2rem"
                }}
                // color="primary"
                variant="contained"
                onClick={handleButtonClick}
              >
                {buttonText}
              </Button>
            </Box>
          </Box>
          {/* END FIRST SECTION */}
          <Divider color="white" />
          {isSelectDisabled ? (
            <FormControl component="form" onSubmit={handleSubmit}>
              <Typography>Tipo de Certificado</Typography>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={certifType}
                onChange={handleChangeRadio}
                sx={{display: "flex", flexDirection: 'row'}}
              >
                <FormControlLabel value="proyecto" control={<Radio color="default" />} label="Proyecto de Investigación" />
                <FormControlLabel value="curso" control={<Radio color="default" />} label="Curso" />
              </RadioGroup>
              <Typography style={{ fontWeight: "bold", marginBottom: "15px" }}>CAMPOS DEL CERTIFICADO</Typography>
              <Box sx={{
                display: "flex", flexDirection: "row", gap: 2,
                paddingRight: "20%", minWidth: '100%'
              }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 2,
                    minWidth: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 2,
                      minWidth: "100%",
                    }}
                  >
                    <Typography component={'div'} label="Input 1"
                      sx={{ minWidth: "20%" }}>Nombre</Typography>
                    <StyledTextField
                      label="Ingrese el nombre y apellido del beneficiario"
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        readOnly: false,
                        style: { color: "white" },
                      }}
                      name="name"
                      defaultValue=""
                      value={formData.name}
                      onChange={handleChange}
                      required
                      size="small"
                      id="outlined-disabled"
                      sx={{ minWidth: "40%" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 2,
                      minWidth: "100%",
                    }}
                  >
                    <Typography component={'div'} label="Input 1"
                      sx={{ minWidth: "20%" }}>Cédula</Typography>
                    <StyledTextField
                      label="Ingrese el número de cédula"
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        style: { color: "white" },
                      }}
                      name="documentIdentification"
                      defaultValue=""
                      value={formData.documentIdentification}
                      required
                      onChange={handleChange}
                      size="small"
                      id="outlined-disabled"
                      sx={{ minWidth: "40%" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 2,
                      minWidth: "100%",
                    }}
                  >
                    <Typography component={'div'} label="Input 1"
                      sx={{ minWidth: "20%" }}>{typeCertificate}</Typography>
                    <StyledTextField
                      label={`Ingrese el nombre del ${certifType}`}
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        style: { color: "white" },
                      }}
                      defaultValue=""
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      multiline
                      maxRows={3}
                      size="small"
                      id="outlined-disabled"
                      sx={{ minWidth: "40%" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 2,
                      minWidth: "100%",
                    }}
                  >
                    <Typography component={'div'} label="Input 1"
                      sx={{ minWidth: "20%" }}>Descripción</Typography>
                    <StyledTextField
                      label={`Ingrese una descripción del ${certifType}`}
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        style: { color: "white" },
                      }}
                      defaultValue=""
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      multiline
                      maxRows={4}
                      size="small"
                      id="outlined-disabled"
                      aria-describedby="my-helper-text"
                      sx={{ minWidth: "40%" }}
                    />
                  </Box>
                  <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                  <Button
                      type="submit" disabled={loading}
                      sx={{
                        bgcolor: "rgba(214, 97, 97,0.85)",
                        ":hover" : {bgcolor: 'rgba(214, 97, 97,0.95)' },
                        minWidth: "20%",
                        minHeight: "20%",
                        maxWidth: "45",
                        marginBottom: "2rem",
                        marginRight: '1rem'
                        // marginTop: "2rem"
                      }}
                      color="primary"
                      variant="contained"
                    >
                      CANCELAR
                    </Button>
                    <Button
                      type="submit" disabled={loading}
                      sx={{
                        bgcolor: "#39C8C8",
                        "&:hover": { bgcolor: "#45EEEE" },
                        minWidth: "20%",
                        minHeight: "20%",
                        maxWidth: "45",
                        marginBottom: "2rem",
                        // marginTop: "2rem"
                      }}
                      color="primary"
                      variant="contained"
                    >
                      {loading ? 'CREANDO CERTIFICADO...' : 'CREAR CERTIFICADO'}
                    </Button>
                  </div>
                </Box>
              </Box>
            </FormControl>
          ):
          (<></>)}
            <Progress_loading open={open} handleClose={handleClose} message="Creando certificado ..." />
            {error && <p>Error: {error.message}</p>}
            {data && <p>Certificate issued successfully!</p>}
            {/* <Modal
              style={styleModal}
              keepMounted
              open={modalOpen} onClose={handleModalClose}
              // Suggested code may be subject to a license. Learn more: ~LicenseLog:1029329151.
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box>
                <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                  ¿Desea ver el certificado?
                </Typography>
                <Typography id="modal-modal-description" variant="h6" component="h2">
                  {modalMessage}
                </Typography>
                {/* Button to open html code store uin const html_certificate in new tab */}
            {/* <Button
                  onClick={() => window.open(html_template, '_blank')}
                  sx={{
                    bgcolor: "#39C8C8",
                    "&:hover": { bgcolor: "#45EEEE" },
                    minWidth: "20%",
                    minHeight: "20%",
                    maxWidth: "45",
                    marginBottom: "2rem",
                    // marginTop: "2rem"
                  }}
                  color="primary"
                  variant="contained"
                >
                  VER CERTIFICADO
                </Button>
      
      
              </Box>
            </Modal> */}
            {openDialog && modalMessage === 'La transacción se realizó correctamente.' && (
            <SucessfullyTransactionDialogSlide
              open={openDialog}
              handleClose={handleCloseDialog}
            />
            )}
            {openDialog && modalMessage.includes('Error') && (
              <CancelTransactionDialogSlide
                open={openDialog}
                handleClose={handleCloseDialog}
              />
            )}
        </>
      )
      }
      <Divider color="white" />
      {/* END CREATE CERTIFICATE */}
      
      <Typography style={{ fontWeight: "bold" }}>LISTA DE CERTIFICADOS</Typography>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={dataCertificatesType}
        onChange={handleChangeRadioData}
        sx={{display: "flex", flexDirection: 'row'}}
      >
        <FormControlLabel value={'proyecto'} control={<Radio color="default" />} label="Proyecto de Investigación" />
        <FormControlLabel value={'curso'} control={<Radio color="default" />} label="Curso" />
      </RadioGroup>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          justifyContent: "center",
          maxWidth: "75%",
          alignItems: "end",
        }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{ bgcolor: 'white' }}>
              <TableRow sx={{ color: "white" }}>
                {columnsTable.map((column, index) => (
                  <TableCell
                    key={`${column.id}-${index}`}
                    align={column.align}
                    style={{ minWidth: column.minWidth, color: 'white' }}
                  // sx={{ bgcolor: "white" }}
                  >
                    {column.label === 'Curso/Proyecto' ? 
                    dataCertificatesType.charAt(0).toUpperCase() + dataCertificatesType.slice(1) : column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow hover key={row.id}>
                  {columnsTable.map((column) => (
                    <TableCell key={`${row.id}-${column.id}`} align={column.align} style={{ color: 'white' }}>
                      {column.id === 'btns-section' ? (
                        <IconButton onClick={() => openCertificateHTML(row)} color="inherit">
                          {theme.direction === 'rtl' ? <PrintIcon color="inherit" /> : <PrintIcon />}
                        </IconButton>
                      ) : (
                        column.id === 'issued_at' ? formatDate(row.issued_at) :
                          column.id === 'tx_hash' ? (
                            <a style={{ color: 'white' }}
                              href={`https://polygonscan.com/tx/${row.tx_hash}`} target="_blank" rel="noopener noreferrer">
                              {/* {row[column.id]} */}
                              {`${row[column.id].slice(0, 7)}...${row[column.id].slice(-5)}`}
                            </a>
                          ) : (
                            row[column.id] || '-' // Fallback value if cell is empty
                          )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          style={{ color: 'white' }}
          rowsPerPageOptions={[4, 8, 15]}
          component="div"
          count={totalCertificates}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default CRUDCertificate;
