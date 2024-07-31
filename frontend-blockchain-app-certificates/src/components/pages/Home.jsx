// import * as React from "react";
import { useEffect, useState } from "react";
import { useTheme, ThemeProvider } from "@mui/material/styles";

import { Button, Stack, Box, Toolbar, CssBaseline, 
  Typography, Divider, IconButton } 
  from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';

import {theme_personal, DrawerHeader, AppBar, Drawer} from '@utils/styles'
import "@assets/styles/main-style.css";
import RU from "@assets/img/RU.png";
import Polygon_Logo from "@assets/img/PoweredbyPolygon.svg"
import Polygon_Icon from "@assets/img/iconPolygon.svg"

//Component
import TabbarNavigation from "../Tabbar";
import {APP_NAME} from "../../config"


//Context
// import { useUserHash } from "../../contexts/UserHashContext";
import { useAuthUser } from "../../contexts/AuthUserContext";


const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
    } catch (error) {
      setIsCopied(false);
    }
  };

  return { isCopied, copyToClipboard };
};

export default function Home() {

  // const { userHash, disconnectMetaMask } = useUserHash();
  const { authenticated, userAcc, mmLogout  } = useAuthUser();

  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth < 920
  );
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 920);
  };

  return (
    <ThemeProvider theme={theme_personal}>
      <Box sx={{ display: "flex", minWidth: '100vw', minHeight: '100vh' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar sx={{ bgcolor: "#005F7D", justifyContent: "space-between" }}>
            <IconButton
              className="btn-base"
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
            {!isSmallScreen ? (
              <Button
                className="btn-logout"
                sx={{bgcolor: 'rgba(214, 97, 97,0.85)', ":hover" : {bgcolor: 'rgba(214, 97, 97,0.95)' }}}
                onClick={mmLogout}
                variant="contained"
                startIcon={<ExitToAppIcon />}
              >
                Desconectar billetera
              </Button>
            ) : (
              <IconButton
                onClick={mmLogout}
                color="inherit"
                aria-label="disconnect-wallet"
                size="small"
                className="btn-base"
              >
                <ExitToAppIcon fontSize="small" />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader sx={{ bgcolor: "#005F7D" }}>
            <IconButton className="btn-base" onClick={handleDrawerClose} sx={{ color: "white" }}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider color="white" />

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
                className="btn-base"
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
                {userAcc ? `${userAcc.slice(0, 7)}...${userAcc.slice(-7, -1)}` : ""}
              </h5>
              <IconButton
                onClick={() => copyToClipboard(userAcc)}
                sx={{ color: "white", ...(!open && { display: "none" }) }}
                color="inherit"
                aria-label="address-wallet"
                size="medium"
                className="btn-base"
              >
                <ContentCopyIcon fontSize="medium" />
              </IconButton>
            </Box>
            {/* <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            > */}
              <a style={{display: "flex", flexDirection: "row", justifyContent: "center",
                marginTop: open ? "0%" : "25%",
                padding: 0
              }} 
              href="https://polygon.technology/" target="_blank" rel="noopener noreferrer">
                <img
                    className="btn-polygon"
                    src={open ? Polygon_Logo : Polygon_Icon}
                    alt="polygon-chain-picture"
                    style={{
                      width: open ? "100%" : "70%",
                      height: open ? "100%" : "100%",
                    }}
                  />
              </a>
            {/* </Box> */}
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
