import * as React from "react";
import { styled, useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import { Button, Stack } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useUserHash } from "../../contexts/UserHashContext";
import "../../assets/styles/main-style.css";
import TabbarNavigation from "../Tabbar";
import RU from "../../assets/img/RU.png";
import {APP_NAME} from "../../config"

const drawerWidth = 240;

const theme_personal = createTheme({
  palette: {
    background: {
      default: "rgba(45, 164, 202, 0.7)",
    },
  },
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  bgcolor: "#00526C",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      console.log("Copied to clipboard:", content);
    } catch (error) {
      setIsCopied(false);
      console.error("Unable to copy to clipboard:", error);
    }
  };

  return { isCopied, copyToClipboard };
};

export default function Home() {
  const { userHash, disconnectMetaMask } = useUserHash();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [isSmallScreen, setIsSmallScreen] = React.useState(
    window.innerWidth < 520
  );
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 520);
  };

  return (
    <ThemeProvider theme={theme_personal}>
      <Box sx={{ display: "flex", minWidth: '100vw', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar sx={{ bgcolor: "#005F7D", justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {APP_NAME}
            </Typography>
            {!open && !isSmallScreen ? (
              <Button
                className="btn-logout"
                sx={{bgcolor: 'rgba(214, 97, 97,0.85)', ":hover" : {bgcolor: 'rgba(214, 97, 97,0.95)' }}}
                onClick={disconnectMetaMask}
                variant="contained"
                startIcon={<ExitToAppIcon />}
              >
                Desconectar billetera
              </Button>
            ) : (
              <IconButton
                onClick={disconnectMetaMask}
                color="inherit"
                aria-label="disconnect-wallet"
                size="small"
              >
                <ExitToAppIcon fontSize="small" />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader sx={{ bgcolor: "#005F7D" }}>
            <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider color="white" />
          {/* <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                    sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    }}
                >
                    <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                    >
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
                </ListItem>
            ))}
            </List>
            <Divider />
            <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                    sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    }}
                >
                    <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                    >
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
                </ListItem>
            ))}
            </List> */}
          {/* Sidebar section */}

          <Stack
            sx={{
              bgcolor: "#00526C",
              height: "100%",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                // minHeight: 48,
                display: "flex",
                justifyContent: "center",
                paddingBlock: 2,
              }}
            >
              <img
                src={RU}
                alt="profile-picture"
                className="img-profile"
                style={{
                  border: "1px solid white",
                  borderRadius: "50%",
                  width: open ? "80%" : "80%",
                  height: open ? "100%" : "100%",
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.8)",
                  background: "white",
                }}
              />
            </Box>
            {/* <Divider color='black' /> */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "40%",
              }}
            >
              <IconButton
                onClick={handleDrawerOpen}
                sx={{ color: "white" }}
                color="inherit"
                aria-label="address-wallet"
                size="medium"
              >
                <AccountBalanceWalletIcon fontSize="medium" />
              </IconButton>
              <h3
                style={{
                  color: "white",
                  textAlign: "center",
                  ...(!open && { display: "none" }),
                }}
              >
                Mi dirección:
              </h3>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                ...(open && {
                  bgcolor: "#24304E",
                  marginInlineStart: "15px",
                  marginInlineEnd: "15px",
                  borderRadius: "5px",
                }),
              }}
            >
              <h5
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: "%20",
                  ...(!open && { display: "none" }),
                }}
              >
                {userHash ? `${userHash.slice(0, 18)}...` : ""}
              </h5>
              <IconButton
                onClick={() => copyToClipboard(userHash)}
                sx={{ color: "white", ...(!open && { display: "none" }) }}
                color="inherit"
                aria-label="address-wallet"
                size="medium"
              >
                <ContentCopyIcon fontSize="medium" />
              </IconButton>
            </Box>
          </Stack>
        </Drawer>
        <Box component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 0,
            y: 0,
            minHeight: '100%',
            width: '100%',
          }}>
          <DrawerHeader />
          <TabbarNavigation sx={{ flexGrow: 1 }} />

        </Box>
      </Box>
    </ThemeProvider>
  );
}
