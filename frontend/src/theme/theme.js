// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A more neutral blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#424242', // Dark gray as secondary color
      light: '#757575',
      dark: '#212121',
    },
    background: {
      default: '#f8f9fa', // Slightly off-white for better contrast
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
    },
    action: {
      hover: '#f0f4f8', // Light blue-gray for hover states
      selected: '#e3f2fd',
    },
    divider: '#e0e0e0', // Light gray for dividers
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Slightly reduced border radius for cleaner look
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.1),0px 1px 1px 0px rgba(0,0,0,0.07),0px 1px 3px 0px rgba(0,0,0,0.06)',
    '0px 3px 3px -2px rgba(0,0,0,0.1),0px 2px 6px 0px rgba(0,0,0,0.07),0px 1px 8px 0px rgba(0,0,0,0.06)',
    // ... keep other shadow levels as default
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          border: '1px solid #eaeaea', // Very subtle border
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#f0f4f8', // Light blue-gray background
          '&.MuiChip-outlined': {
            borderColor: '#e0e0e0',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents all-caps buttons
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Removes default gradient
        },
      },
    },
  },
});

export default theme;