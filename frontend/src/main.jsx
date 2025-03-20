// main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material'
import AppRoutes from './AppRoutes' // Import your routing component

const theme = createTheme({})

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <AppRoutes />
  </ThemeProvider>
)
