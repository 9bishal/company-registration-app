// DashboardEnhanced.jsx - Enhanced dashboard with company overview
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  Alert
} from '@mui/material'
import { 
  CheckCircle, 
  Business, 
  LocationOn, 
  Phone, 
  Email,
  Language,
  People,
  CalendarToday
} from '@mui/icons-material'
import { companyAPI } from '../api/companyAPI'

const DashboardEnhanced = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const fetchCompanyData = async () => {
    try {
      const response = await companyAPI.getCompany()
      if (response.data.success && response.data.data) {
        setCompany(response.data.data)
      } else {
        setError('No company data found')
      }
    } catch (err) {
      setError('Failed to load company data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    )
  }

  if (!company) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">
          No company profile found. Please complete your company setup.
          <Button onClick={() => navigate('/company-setup')} sx={{ ml: 2 }}>
            Setup Now
          </Button>
        </Alert>
      </Container>
    )
  }

  const completionPercentage = company.completion_percentage || 0

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Congratulations Banner */}
      {completionPercentage === 100 && (
        <Paper elevation={3} sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 2 }}>
            <CheckCircle sx={{ fontSize: { xs: 40, sm: 50 }, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }} />
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                Congratulations, Your profile is 100% complete!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {company.description || 'Your company profile is fully set up and ready to go!'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Action Buttons */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Button 
            fullWidth 
            variant="contained" 
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{ py: 2, fontSize: '1.1rem' }}
          >
            📊 View Dashboard
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button 
            fullWidth 
            variant="outlined" 
            size="large"
            color="primary"
            onClick={() => navigate('/company-setup')}
            sx={{ py: 2, fontSize: '1.1rem' }}
          >
            🏢 Company Setup
          </Button>
        </Grid>
      </Grid>

      {/* Company Overview */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}>
          {company.logo_url ? (
            <Avatar 
              src={company.logo_url} 
              sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }}
            />
          ) : (
            <Avatar sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, bgcolor: 'primary.main' }}>
              <Business sx={{ fontSize: { xs: 30, sm: 40 } }} />
            </Avatar>
          )}
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
              {company.company_name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={company.industry || 'Technology'} color="primary" size="small" />
              <Chip label={company.company_size || '1-50'} variant="outlined" size="small" />
            </Box>
          </Box>
        </Box>

        {/* Banner */}
        {company.banner_url && (
          <Box 
            sx={{ 
              width: '100%', 
              height: 200, 
              borderRadius: 2,
              backgroundImage: `url(${company.banner_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mb: 3
            }}
          />
        )}

        {/* Profile Completion */}
        <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f9f9f9' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Profile Completion
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: '100%', mr: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={completionPercentage} 
                  sx={{ height: 12, borderRadius: 6 }}
                />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {completionPercentage}%
              </Typography>
            </Box>
            {completionPercentage < 100 && (
              <Typography variant="body2" color="text.secondary">
                Complete your profile to increase visibility and credibility
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Company Information Grid */}
        <Grid container spacing={3}>
          {/* Description */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              About Us
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {company.description || 'No description provided yet.'}
            </Typography>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Contact Information
                </Typography>

                {company.company_email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      {company.company_email}
                    </Typography>
                  </Box>
                )}

                {company.company_phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      {company.company_phone}
                    </Typography>
                  </Box>
                )}

                {company.company_website && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Language sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <a href={company.company_website} target="_blank" rel="noopener noreferrer">
                        {company.company_website}
                      </a>
                    </Typography>
                  </Box>
                )}

                {(company.address || company.city || company.state || company.country) && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LocationOn sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                    <Typography variant="body1">
                      {[company.address, company.city, company.state, company.zip_code, company.country]
                        .filter(Boolean)
                        .join(', ')}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Company Details */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Company Details
                </Typography>

                {company.organization_type && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Organization Type
                    </Typography>
                    <Typography variant="body1">
                      {company.organization_type}
                    </Typography>
                  </Box>
                )}

                {company.company_size && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <People sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Company Size
                      </Typography>
                      <Typography variant="body1">
                        {company.company_size} employees
                      </Typography>
                    </Box>
                  </Box>
                )}

                {company.year_established && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Established
                      </Typography>
                      <Typography variant="body1">
                        {company.year_established}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {company.vision && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Vision
                    </Typography>
                    <Typography variant="body2">
                      {company.vision}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default DashboardEnhanced
