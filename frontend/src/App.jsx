/**
 * App.jsx - Main Application Component
 * 
 * This component:
 * - Initializes authentication state on app load
 * - Provides Material-UI theming
 * - Sets up React Router for navigation
 * - Shows loading spinner during authentication check
 */

import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme, Box, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/slices/authSlice'
import { router } from './routes'

// Material-UI theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#dc004e', // Red
    },
  },
})

function App() {
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)

  // Check authentication status on app load
  useEffect(() => {
    const initAuth = async () => {
      // Verify if user is logged in by checking localStorage
      await dispatch(checkAuth())
      setIsInitialized(true)
    }
    initAuth()
  }, [dispatch])

  // Show loading spinner while checking authentication
  if (!isInitialized) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh' 
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    )
  }

  // Render main app with routing
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
