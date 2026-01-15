// Dashboard.jsx - Main dashboard showing company information
import { useState, useEffect } from 'react'
import { Box, Button, Typography, Card, CardContent, Grid, Alert, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/authAPI'

export default function Dashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile()
        setUserData(response.data.data)
      } catch (err) {
        setError('Failed to load profile')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          🏢 Dashboard
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* User Info Card */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Welcome, {user.full_name}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                👤 User Profile
              </Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Typography><strong>Mobile:</strong> {user.mobile_no}</Typography>
              <Typography><strong>Gender:</strong> {user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : 'Other'}</Typography>
              <Typography><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ⚙️ Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" fullWidth onClick={() => navigate('/company-setup')}>
                  Edit Company Info
                </Button>
                <Button variant="contained" fullWidth onClick={() => navigate('/settings')}>
                  Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            📊 Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h5">1</Typography>
                <Typography color="textSecondary">Companies Registered</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h5">100%</Typography>
                <Typography color="textSecondary">Profile Completion</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h5">Active</Typography>
                <Typography color="textSecondary">Account Status</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
