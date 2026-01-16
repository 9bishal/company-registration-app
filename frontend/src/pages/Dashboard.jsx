// Dashboard.jsx - Main dashboard showing company information
import { useState, useEffect } from 'react'
import { Box, Button, Typography, Card, CardContent, Grid, Alert, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/authAPI'
import { companyAPI } from '../api/companyAPI'

export default function Dashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch user profile and company data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userResponse = await authAPI.getProfile()
        setUserData(userResponse.data.data)

        // Check if company exists
        try {
          const companyResponse = await companyAPI.getCompany()
          setCompanyData(companyResponse.data.data)
        } catch (companyErr) {
          // No company found - redirect to company setup
          if (companyErr.response?.status === 404) {
            console.log('No company found, redirecting to setup...')
            navigate('/company-setup', { replace: true })
            return
          }
        }
      } catch (err) {
        setError('Failed to load profile')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

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
            📊 Company Information
          </Typography>
          {companyData ? (
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>{companyData.company_name}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Industry:</strong> {companyData.industry}</Typography>
                  <Typography><strong>Size:</strong> {companyData.company_size}</Typography>
                  <Typography><strong>Email:</strong> {companyData.company_email}</Typography>
                  <Typography><strong>Phone:</strong> {companyData.company_phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Location:</strong> {companyData.city}, {companyData.state}, {companyData.country}</Typography>
                  <Typography><strong>Website:</strong> {companyData.company_website || 'N/A'}</Typography>
                  <Typography><strong>Profile Completion:</strong> {companyData.completion_percentage}%</Typography>
                </Grid>
              </Grid>
            </>
          ) : (
            <Alert severity="info">No company data available</Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
