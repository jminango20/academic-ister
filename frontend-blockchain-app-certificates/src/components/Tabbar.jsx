import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Contracts from './pages/Contracts';
import { CssBaseline, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {COLORS} from '../config'

const theme_modif = createTheme({
  palette: {
    primary: {
      main: COLORS.primary, // Tu color primary
    },
    secondary: {
      main: COLORS.secondary, // Tu color secondary
    },
    background: {
      default: "rgba(45, 164, 202, 0.65)",
    },
  },
});

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function TabbarNavigation() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme_modif}>
      <Box sx={{ minWidth: '100%', minHeight: '100%', bgcolor: 'None' }}>
        <CssBaseline/>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', 
            display: 'flex', flexDirection: 'row', 
            justifyContent: 'start', bgcolor: 'rgb(212, 218, 219)' }}>
          <Tabs textColor="secondary"
              indicatorColor="primary" 
              value={value} onChange={handleChange} 
              aria-label="basic tabs example"
              variant="fullWidth">
            <Tab label="Contratos" {...a11yProps(0)} />
            <Tab label="Certificados" {...a11yProps(1)} />
            <Tab label="Herramientas" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Contracts/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>
    </ThemeProvider>
  );
}
