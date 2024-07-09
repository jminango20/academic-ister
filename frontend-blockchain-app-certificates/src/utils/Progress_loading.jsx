import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const LoadingBackdrop = ({ open, handleClose, message }) => {
  return (
    <Backdrop
      sx={{ display: 'flex', flexDirection: 'column', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <Typography variant="h6">{message}</Typography>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingBackdrop;
