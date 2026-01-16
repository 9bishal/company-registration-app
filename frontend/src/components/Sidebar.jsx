import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Backdrop,
  Paper,
  Avatar,
  Divider
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  BusinessCenter as BusinessCenterIcon,
  Work as WorkIcon,
  Bookmark as BookmarkIcon,
  CreditCard as CreditCardIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { logout } from '../store/slices/authSlice'
import { companyAPI } from '../api/companyAPI'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [company, setCompany] = useState(null)

  // Fetch company data for profile display
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await companyAPI.getCompany()
        if (response.data.success && response.data.data) {
          setCompany(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching company:', error)
      }
    }
    
    if (user) {
      fetchCompany()
    }
  }, [user])

  const menuItems = [
    {
      section: 'Main Menu',
      items: [
        { label: 'Dashboard', icon: DashboardIcon, page: 'dashboard', href: '/dashboard' },
        { label: 'Company Setup', icon: BusinessCenterIcon, page: 'company-setup', href: '/company-setup' }
      ]
    },
    {
      section: 'Account',
      items: [
        { label: 'Logout', icon: LogoutIcon, page: 'logout', action: 'logout' }
      ]
    }
  ]

  const comingSoonFeatures = {
    'post-job': {
      title: 'Post a Job',
      description: 'The job posting feature is currently under development. Soon you\'ll be able to create and publish job listings here.',
      icon: WorkIcon
    },
    'my-jobs': {
      title: 'My Jobs',
      description: 'The job management feature is coming soon. You\'ll be able to track and manage all your job postings here.',
      icon: WorkIcon
    },
    'saved-candidate': {
      title: 'Saved Candidates',
      description: 'The candidate management feature is under development. Soon you\'ll be able to save and organize potential candidates here.',
      icon: BookmarkIcon
    },
    'plans-billing': {
      title: 'Plans & Billing',
      description: 'The billing management feature is coming soon. You\'ll be able to manage your subscription and payment methods here.',
      icon: CreditCardIcon
    },
    'all-companies': {
      title: 'All Companies',
      description: 'The company directory is currently under development. Soon you\'ll be able to browse and connect with other companies here.',
      icon: BusinessIcon
    }
  }

  const handleMenuClick = (item) => {
    if (item.action === 'logout') {
      dispatch(logout())
      navigate('/login')
    } else if (item.href) {
      navigate(item.href)
    } else if (comingSoonFeatures[item.page]) {
      setSelectedFeature(comingSoonFeatures[item.page])
      setOpenDialog(true)
    }
  }

  const isActive = (href) => location.pathname === href

  if (!user) {
    return null
  }

  return (
    <>
      <Box
        sx={{
          width: { xs: '100%', md: 260 },
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          color: '#e2e8f0',
          height: { xs: 'auto', md: '100vh' },
          position: { xs: 'relative', md: 'sticky' },
          top: 0,
          boxShadow: '4px 0 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            p: '20px 24px',
            borderBottom: '1px solid #334155',
            mb: 3,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/dashboard')}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#60a5fa',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            🚀 Job<span style={{ color: '#f8fafc' }}>Pilot</span>
          </Typography>
        </Box>

        {/* Menu Sections */}
        <Box sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
          {menuItems.map((section) => (
          <Box key={section.section} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#94a3b8',
                px: 3,
                pb: 1,
                display: 'block'
              }}
            >
              {section.section}
            </Typography>
            <List sx={{ p: 0 }}>
              {section.items.map((item) => {
                const IconComponent = item.icon
                const active = item.href && isActive(item.href)

                return (
                  <ListItem
                    key={item.label}
                    onClick={() => handleMenuClick(item)}
                    sx={{
                      p: 0,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#334155'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        width: '100%',
                        px: 3,
                        py: 1.75,
                        color: active ? '#f8fafc' : '#cbd5e1',
                        backgroundColor: active ? '#1e293b' : 'transparent',
                        borderLeft: active ? '3px solid #60a5fa' : '3px solid transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#f1f5f9',
                          borderLeft: '3px solid #60a5fa'
                        }
                      }}
                    >
                      <IconComponent sx={{ fontSize: '1.3rem', width: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </ListItem>
                )
              })}
            </List>
          </Box>
        ))}
        </Box>
      </Box>

      {/* Coming Soon Dialog */}
      <Backdrop
        open={openDialog}
        onClick={() => setOpenDialog(false)}
        sx={{ zIndex: 999, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <Paper
          onClick={(e) => e.stopPropagation()}
          sx={{
            p: 4,
            borderRadius: 2,
            maxWidth: 400,
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {selectedFeature && (
            <>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  borderRadius: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}
              >
                {selectedFeature.icon && (
                  <selectedFeature.icon sx={{ fontSize: '2.5rem', color: '#3b82f6' }} />
                )}
              </Box>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: '#1e293b' }}>
                {selectedFeature.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3, lineHeight: 1.6 }}>
                {selectedFeature.description}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenDialog(false)}
                sx={{ backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
              >
                Close
              </Button>
            </>
          )}
        </Paper>
      </Backdrop>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}

export default Sidebar
