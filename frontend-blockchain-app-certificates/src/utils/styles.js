// StyledTextField.js
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

