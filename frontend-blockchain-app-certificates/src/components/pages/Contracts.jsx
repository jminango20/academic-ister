import React from "react";
import { Box, Button, Divider, TextField, Typography, useMediaQuery  } from "@mui/material";
import { StyledTextField } from "../../utils/styles";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';


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

const Contracts = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
      <Typography component={'div'} sx={{ fontWeight: "bold" }}>CREAR CONTRATO</Typography>
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
          <Typography component={'div'} label="Input 1">WALLET ADDRESS</Typography>
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`${row.code}-${index}`}>
                      {columns.map((column, index) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={`${column.id}-${index}`} align={column.align} style={{ color: 'white' }}>
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
          rowsPerPageOptions={[5,10,25]}
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

export default Contracts;
