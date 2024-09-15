import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Friendly green tone
    },
    secondary: {
      main: '#FF9800', // Bright and fun orange
    },
    background: {
      default: '#f9f9f9', // Light neutral background
    },
    text: {
      primary: '#333', // Dark text for readability
      secondary: '#666', // Softer secondary text
    },
  },
  typography: {
    fontFamily: "'Proxima Nova', 'Roboto', 'Open Sans', sans-serif", // Modern, friendly fonts
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#333',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#333',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#333',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#666',
    },
  },
  shape: {
    borderRadius: 8, // Softer rounded corners for a friendly UI
  },
});


export default theme;
