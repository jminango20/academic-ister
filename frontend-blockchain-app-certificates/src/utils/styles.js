// StyledTextField.js
import { InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: 'white', // Color de la etiqueta
  },
  '& .MuiOutlinedInput-root': {
    color: 'white', // Color del texto
    '& fieldset': {
      borderColor: 'white', // Color del borde
    },
    '&:hover fieldset': {
      borderColor: 'white', // Color del borde al pasar el mouse
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white', // Color del borde al enfocar
    },
  },
}));

export const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    // backgroundColor: theme.palette.background.default,
    color: 'white',
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(252, 255, 255,.25)',
    },
  },
}));

