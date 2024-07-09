import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CancelTransactionDialogSlide = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{"Transacción Cancelada"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          La transacción fue cancelada por el usuario.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleClose}>Disagree</Button> */}
        <Button onClick={handleClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

const SucessfullyTransactionDialogSlide = ({ open, handleClose, openCertificate }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{"Transacción Exitosa - Certificado NFT creado"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          La transacción fue aprobada por el usuario.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleClose}>Disagree</Button> */}
        <Button onClick={openCertificate}>Imprimir certificado</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelTransactionDialogSlide;
