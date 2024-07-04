import {React, useState, useEffect} from "react";
import { Box, Button, Divider, Typography, FormControl, Modal, Select, MenuItem } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import { StyledTextField, BootstrapInput } from "../../utils/styles";
import PropTypes from 'prop-types';
import QRCode from 'qrcode'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import PrintIcon from '@mui/icons-material/Print';

import useAPIsCertificate from '../../hooks/useAPIsCertificate';
import html_template_certificate from "../../utils/certificate-template/html_template"
import {formatDate, formatDateWCity} from "../../utils/helpers"


const _url_background = import.meta.env.VITE_URL_BACKGROUND_CERTIFICATE;
const _sign_instructor = import.meta.env.VITE_URL_SIGN_INSTRUCTOR;
const _sign_director = import.meta.env.VITE_URL_SIGN_DIRECTOR;
const ContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS_ACADEMIC_ISTER;

const columnsTable = [
  { id: 'document_id', label: 'Identificación', minWidth: 70, align: 'center' },
  { id: 'name', label: 'Nombre del Participante', minWidth: 170 , align: 'center' },
  { id: 'course', label: 'Curso', minWidth: 170, align: 'center' },
  { id: 'issued_at', label: 'Fecha de Emisión', minWidth: 80, align: 'center' },
  // { id: 'token_id', label: 'Token ID', minWidth: 80, align: 'center' },
  { id: 'tx_hash', label: 'Hash de la Tx', minWidth: 100, maxWidth: 150, align: 'center' },
  {id: 'btns-section', label: 'Acciones', minWidth: 100, align: 'center'},
]


const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const CRUDCertificate = () => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [rows, setRows] = useState([]);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [open, setOpen] = useState(false);
  const [contrato, setContrato] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();
  let html_template = html_template_certificate;

  // API REST variables
  const { data, loading, error, dataCertificate, loadingData, errorData,
    submitCertificate, getCertificatesPagination } = useAPIsCertificate();

  useEffect(() => {
    getCertificatesPagination(page+1, rowsPerPage);
  }, [page, rowsPerPage]);

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



  const [formData, setFormData] = useState({
    name: '',
    documentIdentification: '',
    course: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "documentIdentification") {
      // Check if the value is a number and its length is between 10 and 13
      if (!/^\d*$/.test(value) || value.length > 13) {
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.documentIdentification.length < 10 || formData.documentIdentification.length > 13) {
      alert("El documento de identidad no es correcto.");
      return;
    }
    html_template = html_template.replace('{{name}}', formData.name);
    html_template = html_template.replace('{{documentIdentification}}', formData.documentIdentification);
    html_template = html_template.replace('{{course}}', formData.course);
    html_template = html_template.replace('{{course2}}', formData.course);
    html_template = html_template.replace('{{description}}', formData.description);
    // html_template = html_template.replace('{{issuedAt}}', formattedDate);
    // html_template = html_template.replace('{{tokenId}}', tokenId);
    // html_template = html_template.replace('{{transactionHash}}', transactionHash);

    // const url = `https://sepolia.etherscan.io/nft/${academicAddress}/${tokenId}`;
    // const transactionHashQRCode = await QRCode.toDataURL(url);
    // const transactionHashQRBase64 = transactionHashQRCode.split(',')[1];

    // html_template = html_template.replace('{{transactionHashQRBase64}}', transactionHashQRBase64);
    // html_template = html_template.replace('{{url-hash}}', url);

    submitCertificate(formData);
  };

  const openCertificateHTML = async (rowData) => {
    try {
      let html_template_copy = html_template; // Copiar el template del certificado original
    
      const url = `https://sepolia.etherscan.io/nft/${ContractAddress}/${rowData.token_id}`;
      const transactionHashQRCode = await QRCode.toDataURL(url);
      const transactionHashQRBase64 = transactionHashQRCode.split(',')[1];

      // Reemplazar los placeholders con los datos de la fila específica
      html_template_copy = html_template_copy.replace('{{web-title}}', `certificado-curso-${rowData.course}-${rowData.name}`);
      html_template_copy = html_template_copy.replace('{{name}}', rowData.name);
      html_template_copy = html_template_copy.replace('{{documentIdentification}}', rowData.documentIdentification);
      html_template_copy = html_template_copy.replace('{{course}}', rowData.course);
      html_template_copy = html_template_copy.replace('{{course2}}', rowData.course);
      html_template_copy = html_template_copy.replace('{{description}}', rowData.description);
      html_template_copy = html_template_copy.replace('{{issuedAt}}', formatDateWCity('Sangolquí', rowData.issued_at));
      html_template_copy = html_template_copy.replace('{{transactionHash}}', rowData.tx_hash);

      html_template_copy = html_template_copy.replace('{{url-background}}', _url_background);
      html_template_copy = html_template_copy.replace('{{url-sign-instructor}}', _sign_instructor);
      html_template_copy = html_template_copy.replace('{{url-sign-director}}', _sign_director);


      html_template = html_template.replace('{{transactionHashQRBase64}}', transactionHashQRBase64);
      html_template = html_template.replace('{{url-hash}}', url);
    
      // Abrir una nueva pestaña con el HTML generado
      const newWindow = window.open();
      newWindow.document.open();
      newWindow.document.write(html_template_copy);
      newWindow.document.close();
    } catch (error) {
      console.error('Error al abrir el certificado HTML:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
      <Typography style={{ fontWeight: "bold" }}>CREAR CERTIFICADO</Typography>
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
          <Typography component={'span'} label="Input 1">CONTRACT ADDRESS</Typography>
          <FormControl required sx={{ minWidth: "90%" }}>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={contrato}
              label="Contrato *"
              onChange={(event) => setContrato(event.target.value)}
              sx={{ minWidth: "90%"}}
              input={<BootstrapInput />}
            >
              <MenuItem value="">
                <em></em>
              </MenuItem>
              <MenuItem value={10}>Contrato 1</MenuItem>
              <MenuItem value={20}>Contrato 2</MenuItem>
              <MenuItem value={30}>Contrato 3</MenuItem>
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
          <Typography component={'div'} label="Input 1">INSTITUCIÓN</Typography>
          <StyledTextField
            label="Contract name"
            InputLabelProps={{
              style: { color: "white" },
            }}
            InputProps={{
              style: { color: "white" },
              readOnly: true,
            }}
            defaultValue=""
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
              bgcolor: "#39C8C8",
              "&:hover": { bgcolor: "#45EEEE" },
              minWidth: "60%",
              minHeight: "70%",
              maxWidth: "3rem",
              marginTop: "2rem"
            }}
            color="primary"
            variant="contained"
          >
            USAR CONTRATO
          </Button>
        </Box>
      </Box>
      {/* END FIRST SECTION */}
      <Divider color="white" />
      <FormControl component="form" onSubmit={handleSubmit}>
        <Typography style={{ fontWeight: "bold" }}>CAMPOS DEL CERTIFICADO</Typography>
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
                sx={{ minWidth: "20%" }}>Nombre del Curso</Typography>
              <StyledTextField
                label="Ingrese el nombre del curso"
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
                label="Ingrese una descripción del curso"
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
                size="small"
                id="outlined-disabled"
                aria-describedby="my-helper-text"
                sx={{ minWidth: "40%" }}
              />
            </Box>
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
          </Box>
        </Box>
      </FormControl>
      {error && <p>Error: {error.message}</p>}
      {data && <p>Certificate issued successfully!</p>}
      <Modal
      style={styleModal}
      keepMounted
      open={open} onClose={handleClose}
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1029329151.
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
        <Box>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            ¿Desea ver el certificado?
          </Typography>
          {/* Button to open html code store uin const html_certificate in new tab */}
          <Button
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
      </Modal>

      {/* END CREATE CERTIFICATE */}
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
                    {column.label}
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
                        <a style={{color: 'white'}}
                        href={`https://sepolia.etherscan.io/nft/${ContractAddress}/${row.token_id}`} target="_blank" rel="noopener noreferrer">
                          {row[column.id]}
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
          rowsPerPageOptions={[3, 6, 9]}
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
