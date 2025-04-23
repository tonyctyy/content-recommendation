// main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme/theme'
import AppRoutes from './AppRoutes'


createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <AppRoutes />
  </ThemeProvider>
)
