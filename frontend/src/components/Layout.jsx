import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Box, IconButton, AppBar, Toolbar, Typography, Drawer, useMediaQuery, useTheme } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'

export default function Layout() {
  const { user } = useSelector((state) => state.auth)
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile App Bar */}
      {user && isMobile && (
        <AppBar 
          position="fixed" 
          sx={{ 
            background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
            zIndex: theme.zIndex.drawer + 1 
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              🚀 Job<span style={{ color: '#60a5fa' }}>Pilot</span>
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar - Desktop permanent, Mobile drawer */}
      {user && (
        <>
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile
              }}
              sx={{
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: 260,
                  border: 'none'
                },
              }}
            >
              <Sidebar />
            </Drawer>
          ) : (
            <Sidebar />
          )}
        </>
      )}
      
      {/* Main content area */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          width: { xs: '100%', md: 'calc(100% - 260px)' },
          mt: { xs: user ? '64px' : 0, md: 0 }
        }}
      >
        <Box 
          sx={{ 
            flex: 1, 
            p: { xs: 2, sm: 3 }, 
            overflow: 'auto', 
            backgroundColor: '#f8fafc' 
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}