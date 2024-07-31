import React, { useState, useEffect } from 'react';
// import {us}
// import { useMetaMask } from '../../hooks/useMetaMask';
import '@assets/styles/connect-style.css';

import logo from '@assets/img/SVG_MetaMask_Icon_Color.svg';
import logoIster from '@assets/img/logo-blanco.png';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import Progress_loading from '@utils/Progress_loading';

// Context
import { useAuthUser } from '@contexts/AuthUserContext';
// import { useUserHash } from '../../contexts/UserHashContext';
// import { useContext } from 'react';
// Context
// import { AuthContext } from "@src/App";

const ConnectMetaMask = () => {
  // const { account } = useMetaMask();
  // const { userHash, setUserHash } = useUserHash();
  const [open, setOpen] = useState(false);

  const { mmLogin, connectionErr, ethWallet } = useAuthUser();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

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


  const connectWallet = async () => {
    handleOpen();
    
    if (window.ethereum) {
      try {
        const result = await mmLogin();
        if (!result.success) {
          handleClose();
        }
        
      } catch (error) {
        console.error("Error:", error);
        handleClose();
      }
    } else {
      console.error('MetaMask is not installed.');
      handleClose();
    }
  };

  return (
    <Container maxWidth="sm" 
    sx={{
      p: 2,
      bgcolor: '#374F64',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      minWidth: '100vw'
    }} >
      <Paper
        sx={{
          p: 2,
          bgcolor: '#0091BE',
          borderRadius: 4,
          maxWidth: 400,
          minWidth: 400,
          minHeight: 500,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
        elevation={6}
      >
        <img src={logoIster} alt="IsterLogo" style={{  maxWidth: '100%', marginBottom: '17%', filter: 'drop-shadow(2px 1px 1px rgba(0, 0, 0, 0.7))'}} />
        <h2 style={{ color: 'white', marginBottom: '20%', textAlign: 'center' }}>CERTIFICADOS EDUCACIONALES ISTER</h2>
        <Button disabled={!ethWallet} className='btn-connect-meta' variant="contained" onClick={connectWallet} >
          <p className='btn-text'>Conectar Billetera MetaMask</p>
          <img src={logo} alt="MetaMask" style={{  maxHeight: '40px' }} />
        </Button>
        {ethWallet ? (
          <p className='text-hint'>Para acceder por favor conecta tu billetera Metamask</p>
        ) : (
          <p className='text-hint'>
            Para acceder por favor instala <a style={{
          color: 'inherit',
          fontWeight: 'bold',
          textDecoration: 'none',
          borderRadius: '0.2em',
          display: 'inline-block', 
        }} target='_blank' rel='noopener noreferrer' href="https://metamask.io/download/">Metamask</a> en tu navegador</p>
        )
          }
      </Paper>
      <Progress_loading open={open} handleClose={handleClose} message="Conectando billetera Metamask ..." />
    </Container>
  );
};

export default ConnectMetaMask;
