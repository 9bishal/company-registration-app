import { Outlet } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'

export default function Layout() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Jobpilot</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}