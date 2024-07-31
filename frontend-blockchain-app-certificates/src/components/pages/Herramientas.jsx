import React, { useState, useEffect } from "react";
import { Box, Button, Divider, TextField, Typography, useMediaQuery, Radio, RadioGroup, 
    FormControl, FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
 } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { StyledTextField } from "../../utils/styles";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useAuthUser } from "@contexts/AuthUserContext";

const contractAddress = "0x9F70E57deDABfC7b156ddD0AF4bE777CF5b72cD4";


const Herramientas = () => {
    
    const columnsTable = [
        { id: 'documentIdentification', label: 'Identificación', minWidth: 70, align: 'center' },
        { id: 'name', label: 'Nombre del Participante', minWidth: 170, align: 'center' },
        { id: 'course', label: 'Curso/Proyecto', minWidth: 170, align: 'center' },
        { id: 'token', label: 'Token ID', minWidth: 80, align: 'center' },
        { id: 'btns-section', label: 'Acciones', minWidth: 100, align: 'center' },
      ]
    const theme = useTheme();
    const [certifType, setCertifType] = useState('proyecto');
    const [token_id, setToken_id] = useState("");
    const [typeCertificate, setTypeCertificate] = useState('Nombre del Proyecto');
    const { userAcc, ethWallet, connectionErr, callContractMethod } = useAuthUser();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [getDataSection, setGetDataSection] = useState(false)
    const [id_document, setId_document] = useState('')
    const [certifList, setCertifList] = useState([]);

    const [resData, setResData] = useState({
        name: '',
        documentIdentification: '',
        title: '',
        description: '',
        tokenId: '',
        transactionHash: '',
        contract_address: '',
      });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setResData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleTokenIdChange = (e) => {
        const value = e.target.value;
        if (Number.isInteger(Number(value)) || value === "") {
            setToken_id(value);
          }
      };
    
    const handleIdDocumentChange = (e) => {
        const value = e.target.value;
        if (Number.isInteger(Number(value)) || value === "") {
            setId_document(value);
          }
    };

    const handleGetCertificateData = async (tokenId) => {
        const methodName = 'getCertificateMetadata';
        const params = [tokenId];
        // const contractAddress="0x9F70E57deDABfC7b156ddD0AF4bE777CF5b72cD4";
        
        try {
          const certificate = await callContractMethod(contractAddress, methodName, params, true);
          return certificate;
        } catch (error) {
          console.error('Error creating certificate:', error);
          return null;
        }
      };

      const searchByID = async (documentID="0") => {

        const methodName = 'getCertificateIdsByDocumentId';
        const params = [documentID];
        // const contractAddress="0x9F70E57deDABfC7b156ddD0AF4bE777CF5b72cD4";
        console.log(documentID);
        console.log("PARAMS:", params);
        try {
          const certificates_lst = await callContractMethod(contractAddress, methodName, params, true);
          const formattedIds = certificates_lst.map(id => id.toString());
          console.log("Form IDS:", formattedIds);
          return certificates_lst;
        } catch (error) {
          console.error('Error creating certificate:', error);
          return null;
        }
      };

      const handleSearchByID = async (e) => {

        e.preventDefault();
        if (id_document.length < 10 || id_document === null) {
          alert("Debe especificar un número de identificación válido.");
          return;
        }
    
        try {
            console.log("TOKEN:", id_document)
            const certificatesDataLst = await searchByID(id_document);
            if (certificatesDataLst.length === 0 || certificatesDataLst === null) {
                // setGetDataSection(false);
                alert("Certificados no encontrados.");
                return;
            } else {
                const allCertificatesData = await Promise.all(certificatesDataLst.map(tokenId => handleGetCertificateData(tokenId)));
                setCertifList(allCertificatesData.filter(data => data !== null)); // Filtra los resultados nulos
                console.log(allCertificatesData);
                // setGetDataSection(true);
                // Llenar certifList
                // setCertifList((prevData) => ({
                //     ...prevData,
                //     ...
                // }))
            }
        } catch (error) {
          if (error.message.includes('contract method')) {
            setModalMessage("Transacción rechazada por el usuario 2.");
          } else {
            setModalMessage(`Error al crear el certificado: ${error.message}`);
          }
          // setModalMessage(`Error al crear el certificado: ${error.message}`);
          console.log("Error encontrado:", error);
        //   handleOpenDialog();
        //   setOpen(false);
        } finally {
        //   setModalOpen(true);
        //   handleOpenDialog();
        //   setOpen(false);
        }
      };

      const handleSubmit = async (e) => {

        e.preventDefault();
        if (token_id.length < 1 || token_id === null) {
          alert("Especifique el token ID.");
          return;
        }
    
        try {
            const certificateData = await handleGetCertificateData(token_id);
            if (certificateData[0] === "" || certificateData[1] === "") {
                setGetDataSection(false);
                alert("Certificado no encontrado.");
                return;
            } else {
                setGetDataSection(true);
                const sanitizeString = (str) => str.replace(/[\r\n]+/g, ' '); //evitar saltos de linea
                setResData((prevData) => ({
                    ...prevData,
                    name: certificateData[0],
                    documentIdentification: certificateData[1],
                    title: sanitizeString(certificateData[2]),
                    description: sanitizeString(certificateData[3]),
                }))
            }
        } catch (error) {
          if (error.message.includes('contract method')) {
            setModalMessage("Transacción rechazada por el usuario 2.");
          } else {
            setModalMessage(`Error al crear el certificado: ${error.message}`);
          }
          // setModalMessage(`Error al crear el certificado: ${error.message}`);
          console.log("CATCH:", error);
        //   handleOpenDialog();
        //   setOpen(false);
        } finally {
        //   setModalOpen(true);
        //   handleOpenDialog();
        //   setOpen(false);
        }
      };

    useEffect(() => {
        if (certifType == "proyecto") {
          setTypeCertificate("Nombre del Proyecto");
        } else {
          setTypeCertificate("Nombre del Curso");
        }
      }, [certifType])




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
            <Typography component={'div'} sx={{ fontWeight: "bold" }}>CONSULTA DE CERTIFICADOS</Typography>
            <Typography component={'div'} sx={{ fontWeight: "bold" }}>BUSCAR CERTIFICADOS POR TOKEN ID</Typography>
            <FormControl component="form" onSubmit={handleSubmit} required sx={{ minWidth: "90%" }}>

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
                            alignItems: "left",
                            minWidth: "30%",

                        }}
                    >
                        <Typography component={'div'} label="Input 1">Token ID del certificado</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: 2,
                            alignItems: "center",
                            minWidth: "40%",
                        }}
                    >
                        <StyledTextField
                            label="Certificate Token ID"
                            InputLabelProps={{
                                style: { color: "white" },
                            }}
                            InputProps={{
                                style: { color: "white" },
                            }}
                            defaultValue=""
                            size="small"
                            required
                            onChange={handleTokenIdChange}
                            value={token_id}
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
                            }}
                            color="primary"
                            variant="contained"
                            type="submit"
                        >
                            BUSCAR
                        </Button>
                    </Box>
                    </Box>
              </FormControl>
            {getDataSection && (
                <>
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
                                label="Nombre del beneficiario"
                                InputLabelProps={{
                                    style: { color: "white" },
                                }}
                                InputProps={{
                                    readOnly: false,
                                    style: { color: "white" },
                                }}
                                name="name"
                                defaultValue=""
                                value={resData.name}
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
                                label="Identificación"
                                InputLabelProps={{
                                    style: { color: "white" },
                                }}
                                InputProps={{
                                    style: { color: "white" },
                                }}
                                name="documentIdentification"
                                defaultValue=""
                                value={resData.documentIdentification}
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
                                sx={{ minWidth: "20%" }}>Título del certificado</Typography>
                                <StyledTextField
                                label={`Título del certificado`}
                                InputLabelProps={{
                                    style: { color: "white" },
                                }}
                                InputProps={{
                                    style: { color: "white" },
                                }}
                                defaultValue=""
                                // disabled
                                name="title"
                                value={resData.title}
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
                                value={resData.description}
                                multiline
                                maxRows={6}
                                size="small"
                                id="outlined-disabled"
                                aria-describedby="my-helper-text"
                                sx={{ minWidth: "40%" }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
            <Divider color="white" />
            <Typography component={'div'} sx={{ fontWeight: "bold" }}>BUSCAR CERTIFICADOS POR DOCUMENTO DE IDENTIDAD</Typography>
            <Box sx={{
                display: "flex", flexDirection: "row", gap: 2,
                paddingRight: "20%", minWidth: '100%'
            }}>
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
                        sx={{ minWidth: "20%" }}>DOCUMENTO DE IDENTIDAD</Typography>
                    <StyledTextField
                        label="ID"
                        InputLabelProps={{
                            style: { color: "white" },
                        }}
                        InputProps={{
                            style: { color: "white" },
                        }}
                        defaultValue=""
                        value={id_document}
                        required
                        onChange={handleIdDocumentChange}
                        size="small"
                        id="outlined-disabled"
                        sx={{ minWidth: "40%" }}
                    />
                    <Button
                        sx={{
                            bgcolor: "#39C8C8",
                            "&:hover": { bgcolor: "#45EEEE" },
                            minWidth: "20%",
                            minHeight: "70%",
                            maxWidth: "45",
                            // marginTop: "2rem"
                        }}
                        color="primary"
                        variant="contained"
                        onClick={handleSearchByID}
                    >
                        BUSCAR
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    justifyContent: "center",
                    maxWidth: "75%",
                    alignItems: "end",
                }}>
                {/* {certifList.map((certificate, index) => (
                    <div key={index}>
                        <h3>{certificate.name}</h3>
                        <p>{certificate.documentIdentification}</p>
                        <p>{certificate.title}</p>
                        <p>{certificate.description}</p>
                    </div>
                ))} */}
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead sx={{ bgcolor: 'white' }}>
                        <TableRow sx={{ color: "white" }}>
                            {columnsTable.map((column, index) => (
                            <TableCell
                                key={`${column.documentIdentification}-${index}`}
                                align={column.align}
                                style={{ minWidth: column.minWidth, color: 'white' }}
                            // sx={{ bgcolor: "white" }}
                            >
                                {column.label === 'Título' ?
                                dataCertificatesType.charAt(0).toUpperCase() + dataCertificatesType.slice(1) : column.label}
                            </TableCell>
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {certifList.map((row, index) => (
                            <TableRow hover key={row.id}>
                            {columnsTable.map((column) => (
                                <TableCell key={`${row.id}-${column.id}`} align={column.align} style={{ color: 'white' }}>
                                {column.id === 'btns-section' ? (
                                    <IconButton onClick={() => openCertificateHTML(row)} color="inherit">
                                    {theme.direction === 'rtl' ? <PrintIcon color="inherit" /> : <PrintIcon />}
                                    </IconButton>
                                ) : (
                                    column.id === 'issued_at' ? formatDate(row.issued_at) :
                                    column.id === '     ' ? (
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
                    {/* <TablePagination
                    style={{ color: 'white' }}
                    rowsPerPageOptions={[4, 8, 15]}
                    component="div"
                    count={certificatesDataLst.lenght}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}
            </Box>
        </Box>
    );
};

export default Herramientas;