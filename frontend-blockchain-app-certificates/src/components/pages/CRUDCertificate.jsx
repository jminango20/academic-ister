import {React, useState} from "react";
import { Box, Button, Divider, Typography, FormControl, Modal } from "@mui/material";
import { StyledTextField } from "../../utils/styles";
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import useIssueCertificate from '../../hooks/useIssueCertificate';
import html_template_certificate from "../../utils/certificate-template/html_template"

const columns = [
  { id: 'name', label: 'Nombre del Contrato', minWidth: 170 },
  { id: 'contractAddress', label: 'Contract Address', minWidth: 100 },
  {
    id: 'walletAddress',
    label: 'Wallet Address',
    minWidth: 170,
    align: 'right',
  }
];

function createData(name, contractAddress, walletAddress) {
  return { name, contractAddress, walletAddress };
}

const rows = [
  createData('India', 1324171354, 1324171354),
  createData('China', 1324171354, 1403500365),
  createData('Italy', 1324171354, 60483973),
  createData('United States', 1324171354, 327167434),
  createData('Canada', 1324171354, 37602103),
  createData('Australia', 1324171354, 25475400),
  createData('Germany', 1324171354, 83019200),
  createData('Ireland', 1324171354, 4857000),
  createData('Mexico', 1324171354, 126577691),
  createData('Japan', 1324171354, 126317000),
  createData('France', 1324171354, 67022000),
  createData('United Kingdom', 1324171354, 67545757),
  createData('Russia', 1324171354, 1467937446),
  createData('Nigeria', 1324171354, 200962417),
  createData('Brazil', 1324171354, 210147125),
];

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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  let html_template = html_template_certificate;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // API REST variables
  const { data, loading, error, submitCertificate } = useIssueCertificate();
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
          <Typography component={'span'} label="Input 1">WALLET ADDRESS</Typography>
          <StyledTextField
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
          />
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
                {columns.map((column, index) => (
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`${row.code}-${index}`}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{ color: 'white' }}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}

                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          style={{ color: 'white' }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
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
