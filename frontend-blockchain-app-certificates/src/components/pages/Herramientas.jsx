import React, { useState, useEffect } from "react";
import { Box, Button, Divider, TextField, Typography, useMediaQuery } from "@mui/material";
import { StyledTextField } from "../../utils/styles";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
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

const Herramientas = () => {
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
                    <Typography component={'div'} label="Input 1">Hash del certificado</Typography>
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
                    {/* <Typography component={'div'} label="Input 1">INSTITUCIÓN</Typography> */}
                    <StyledTextField
                        label="Certificate hash"
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
                        }}
                        color="primary"
                        variant="contained"
                    >
                        BUSCAR CERTIFICADO
                    </Button>
                </Box>
            </Box>
            <Divider color="white" />
            <Typography component={'div'} sx={{ fontWeight: "bold" }}>LISTA DE CONTRATOS</Typography>
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
                <h1>Box</h1>
            </Box>
        </Box>
    );
};

export default Herramientas;