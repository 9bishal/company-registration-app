// CompanySetup.jsx - Multi-step company registration form
import { useState } from 'react'
import { Box, Button, TextField, Typography, Alert, CircularProgress, Select, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/authAPI'
import { companyAPI } from '../api/companyAPI'

export default function CompanySetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form data for company information
  const [companyData, setCompanyData] = useState({
    company_name: '',
    about_company: '',
    industry_type: 'Technology',
    team_size: '1-50',
    company_website: '',
    founded_year: new Date().getFullYear(),
    headquarters_city: '',
    headquarters_state: '',
    social_media_linkedin: '',
    social_media_twitter: '',
    contact_email: '',
    contact_phone: ''
  })

  const steps = ['Company Info', 'Founding Info', 'Social Media', 'Contact']
  const teamSizes = ['1-50', '50-100', '100-500', '500-1000', '1000+']
  const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Other']

  // Update form field
  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }))
  }

  // Move to next step
  const handleNextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  // Move to previous step
  const handlePrevStep = () => {
    if (step > 0) setStep(step - 1)
  }

  // Submit company information
  const handleSubmit = async () => {
    setError('')

    // Validation
    if (!companyData.company_name) {
      setError('Company name is required')
      return
    }

    setLoading(true)
    try {
      // Submit to backend
      const response = await companyAPI.createCompany(companyData)
      setSuccess('✅ Company registration completed!')

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Render form fields based on current step
  const renderStep = () => {
    switch(step) {
      case 0: // Company Info
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Company Information</Typography>
            
            <TextField
              fullWidth
              label="Company Name"
              value={companyData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="About Company"
              multiline
              rows={3}
              value={companyData.about_company}
              onChange={(e) => handleInputChange('about_company', e.target.value)}
              disabled={loading}
            />
            
            <Select
              value={companyData.industry_type}
              onChange={(e) => handleInputChange('industry_type', e.target.value)}
              disabled={loading}
            >
              {industries.map(ind => <MenuItem key={ind} value={ind}>{ind}</MenuItem>)}
            </Select>
            
            <Select
              value={companyData.team_size}
              onChange={(e) => handleInputChange('team_size', e.target.value)}
              disabled={loading}
            >
              {teamSizes.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
            </Select>
          </Box>
        )

      case 1: // Founding Info
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Founding Information</Typography>
            
            <TextField
              fullWidth
              label="Company Website"
              type="url"
              value={companyData.company_website}
              onChange={(e) => handleInputChange('company_website', e.target.value)}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Founded Year"
              type="number"
              value={companyData.founded_year}
              onChange={(e) => handleInputChange('founded_year', e.target.value)}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Headquarters City"
              value={companyData.headquarters_city}
              onChange={(e) => handleInputChange('headquarters_city', e.target.value)}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Headquarters State/Province"
              value={companyData.headquarters_state}
              onChange={(e) => handleInputChange('headquarters_state', e.target.value)}
              disabled={loading}
            />
          </Box>
        )

      case 2: // Social Media
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Social Media Links</Typography>
            
            <TextField
              fullWidth
              label="LinkedIn Profile"
              value={companyData.social_media_linkedin}
              onChange={(e) => handleInputChange('social_media_linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/..."
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Twitter/X Handle"
              value={companyData.social_media_twitter}
              onChange={(e) => handleInputChange('social_media_twitter', e.target.value)}
              placeholder="@company_handle"
              disabled={loading}
            />
          </Box>
        )

      case 3: // Contact
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
            
            <TextField
              fullWidth
              label="Contact Email"
              type="email"
              value={companyData.contact_email}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Contact Phone"
              value={companyData.contact_phone}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              disabled={loading}
            />
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        🏢 Company Setup
      </Typography>

      {/* Step Progress */}
      <Box sx={{ display: 'flex', mb: 3, gap: 1 }}>
        {steps.map((label, index) => (
          <Box
            key={label}
            sx={{
              flex: 1,
              textAlign: 'center',
              p: 1,
              borderRadius: 1,
              backgroundColor: index <= step ? '#1976d2' : '#e0e0e0',
              color: index <= step ? 'white' : '#666',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {label}
          </Box>
        ))}
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Form Content */}
      <Box sx={{ mb: 3 }}>
        {renderStep()}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handlePrevStep}
          disabled={step === 0 || loading}
        >
          Previous
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={handleNextStep}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            step === steps.length - 1 ? 'Complete' : 'Next'
          )}
        </Button>
      </Box>
    </Box>
  )
}
