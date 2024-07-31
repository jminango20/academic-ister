import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Divider, 
  TextField, 
  Typography,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow 
} from "@mui/material";
import { StyledTextField } from "../../utils/styles";



import useAPIsContract from '@hooks/useAPIsContract';


const columns = [
  { id: 'namecontract', label: 'Nombre del Contrato', minWidth: 170 },
  { id: 'addresscontract', label: 'Contract Address', minWidth: 100 },
  { id: 'addresscontractfactory', label: 'Contract Factory', minWidth: 100 },
];

function createData(name, contractAddress, walletAddress) {
  return { name, contractAddress, walletAddress };
}

const Contracts = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [contracts, setContracts] = useState([]);
  const { dataContract, loadingDataContract, errorDataContract, getContracts } = useAPIsContract();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //USE EFFECT
  useEffect(() => {
    getContracts();
  }, [])
  
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
      <Typography component={'div'} sx={{ fontWeight: "bold" }}>AGREGAR CONTRATO</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2,
        paddingRight: "20%" }}>
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
          <Typography component={'div'} label="Input 1">CONTRACT ADDRESS</Typography>
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
            DEPLOY
          </Button>
        </Box>
      </Box>
      <Divider color="white"/>
      <Typography component={'div'} sx={{ fontWeight: "bold" }}>LISTA DE CONTRATOS</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2,
        paddingRight: "20%", minWidth: '100%' }}>
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
          sx={{ minWidth: "20%" }}>Nombre del contrato</Typography>
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
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{bgcolor: 'white'}}>
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
              {contracts
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`${row.code}-${index}`}>
                      {columns.map((column, index) => {
                        const value = row[column.id];
                        const isContractAddress = column.id === 'addresscontract';
                        const isContractFactoryAddress = column.id === 'addresscontractfactory';
                        const link = isContractAddress ? `https://polygonscan.com/address/${value}` 
                                    : isContractFactoryAddress ? `https://polygonscan.com/address/${value}`
                                    : null;

                        return (
                          <TableCell key={`${column.id}-${index}`} align={column.align} style={{ color: 'white' }}>
                            {link ? (
                              <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                                {value}
                              </a>
                            ) : column.format && typeof value === 'number' ? (
                              column.format(value)
                            ) : (
                              value
                            )}
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
          rowsPerPageOptions={[5,10,25]}
          component="div"
          count={contracts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default Contracts;
