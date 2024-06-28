import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, Stack } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useUserHash } from '../../contexts/UserHashContext';
import '../../assets/styles/main-style.css'
import TabbarNavigation from '../Tabbar';
import RU from '../../assets/img/RU.png'


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  overflowX: 'hidden',
  justifyContent: 'flex-end',
  // padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    // marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    bgcolor: '#00526C',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      console.log('Copied to clipboard:', content);
    } catch (error) {
      setIsCopied(false);
      console.error('Unable to copy to clipboard:', error);
    }
  };

  return { isCopied, copyToClipboard };
};

export default function Main() {

  const { userHash, disconnectMetaMask } = useUserHash();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth < 520);
  //Method to copy to clipboard
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 520);
  };

  return (
    <Container sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{bgcolor: '#005F7D', justifyContent: 'space-between',}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            WebPage Name
          </Typography>
          {!open && !isSmallScreen ? (
            <Button className='btn-logout' onClick={disconnectMetaMask} variant="contained" 
            startIcon={<ExitToAppIcon />}
            // sx={{...(open && { text: 'none' })}}
            >
              Desconectar billetera
            </Button>
          ) : (
          <IconButton onClick={disconnectMetaMask} color="inherit" aria-label="disconnect-wallet" size="small">
            <ExitToAppIcon fontSize="small" />
          </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer 
      className='sidebar-drawer' 
      variant="permanent" 
      anchor="left" 
      open={open}
      sx={{minWidth: '100%', 
          display: 'flex', 
          justifyContent: 'top', 
          alignItems: 'top'}}
      >
        <DrawerHeader sx={{bgcolor: '#005F7D'}}>
          <IconButton onClick={handleDrawerClose} sx={{color: 'white'}}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider color='white'/>

        {/* Sidebar section */}

        <Stack sx={{
                  bgcolor: '#00526C',
                  height: '100%', flexGrow: 1
                }}>
          <Box sx={{
                  // minHeight: 48,
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBlock: 2
                }}>
            <img src={RU} alt='profile-picture' className='img-profile' 
            style={{border: '1px solid white',
                    borderRadius: '50%',
                    width: (open ? '80%' : '80%'),
                    height: (open ? '100%' : '100%'),
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)',
                    background: 'white',
                  }}
            />
          </Box>
          {/* <Divider color='black' /> */}
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
            marginTop: '40%'}}>
            <IconButton onClick={handleDrawerOpen} sx={{color: 'white'}} color="inherit" aria-label="address-wallet" size="medium">
              <AccountBalanceWalletIcon fontSize="medium"/>
            </IconButton>
            <h3 style={{color: 'white', textAlign: 'center', 
            ... (!open && { display: 'none' })}}>
              Mi dirección:
            </h3>
          </Box>
          <Box 
          sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
              ...( open && {bgcolor:'#24304E', marginInlineStart: '15px', marginInlineEnd: '15px',
            borderRadius: '5px'})
            }}
          >
            <h5 style={{color: 'white', textAlign: 'center', marginTop: '%20', 
            ... (!open && { display: 'none' })}}>
              {userHash ? `${userHash.slice(0, 18)}...` : ''}
            </h5>
            <IconButton onClick={() => copyToClipboard(userHash)} sx={{color: 'white', ...( !open && {display: 'none'})}} color="inherit" aria-label="address-wallet" size="medium">
              <ContentCopyIcon fontSize="medium"/>
            </IconButton>
          </Box>

        </Stack>
        
      </Drawer>
      {/* <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
         <h1>Hello World</h1>
      </Box> */}
      <Box
        component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <TabbarNavigation sx={{ flexGrow: 1 }}/>

      </Box>
    </Container>
  );
}
