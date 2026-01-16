// CompanySetup.jsx - Multi-step company registration with completion tracking
import { useState, useEffect } from 'react'
import { 
  Box, Button, TextField, Typography, Alert, CircularProgress, Select, MenuItem, 
  LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Card 
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { companyAPI } from '../api/companyAPI'

export default function CompanySetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [showCongrats, setShowCongrats] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)

  // Form data for company information
  const [companyData, setCompanyData] = useState({
    company_name: '',
    description: '',
    industry: 'Technology',
    company_size: '1-50',
    company_website: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    company_email: '',
    company_phone: ''
  })

  const steps = ['Basic Info', 'Location', 'Contact Details', 'Media']
  const companySizes = ['1-50', '50-100', '100-500', '500-1000', '1000+']
  const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Other']

  // Calculate completion percentage
  useEffect(() => {
    const requiredFields = [
      'company_name',
      'company_email',
      'company_phone',
      'industry',
      'company_size',
      'company_website',
      'address',
      'city',
      'state',
      'country'
    ]
    
    const filledFields = requiredFields.filter(field => 
      companyData[field] && companyData[field].toString().trim() !== ''
    )
    
    const percentage = Math.round((filledFields.length / requiredFields.length) * 100)
    setCompletionPercentage(percentage)
  }, [companyData])

  // Update form field
  const handleInputChange = (field, value) => {
    setCompanyData(prev => ({ ...prev, [field]: value }))
  }

  // Handle file selection
  const handleLogoSelect = (e) => {
    setLogoFile(e.target.files[0])
  }

  const handleBannerSelect = (e) => {
    setBannerFile(e.target.files[0])
  }

  // Upload logo
  const handleUploadLogo = async () => {
    if (!logoFile) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('logo', logoFile)
      
      await companyAPI.uploadLogo(formData)
      setLogoFile(null)
      alert('✅ Logo uploaded successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload logo')
    } finally {
      setLoading(false)
    }
  }

  // Upload banner
  const handleUploadBanner = async () => {
    if (!bannerFile) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('banner', bannerFile)
      
      await companyAPI.uploadBanner(formData)
      setBannerFile(null)
      alert('✅ Banner uploaded successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload banner')
    } finally {
      setLoading(false)
    }
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
    if (!companyData.company_name || !companyData.company_email) {
      setError('Company name and email are required')
      return
    }

    setLoading(true)
    try {
      // Submit to backend
      await companyAPI.createCompany(companyData)
      
      // Show congratulations dialog
      setShowCongrats(true)

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        setShowCongrats(false)
        navigate('/dashboard')
      }, 3000)

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Render form fields based on current step
  const renderStep = () => {
    switch(step) {
      case 0: // Basic Info
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Basic Company Information</Typography>
            
            <TextField
              fullWidth
              label="Company Name *"
              value={companyData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              disabled={loading}
              required
            />
            
            <TextField
              fullWidth
              label="Company Description"
              multiline
              rows={3}
              value={companyData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={loading}
            />
            
            <Select
              value={companyData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              disabled={loading}
            >
              {industries.map(ind => <MenuItem key={ind} value={ind}>{ind}</MenuItem>)}
            </Select>
            
            <Select
              value={companyData.company_size}
              onChange={(e) => handleInputChange('company_size', e.target.value)}
              disabled={loading}
            >
              {companySizes.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
            </Select>

            <TextField
              fullWidth
              label="Company Website"
              type="url"
              value={companyData.company_website}
              onChange={(e) => handleInputChange('company_website', e.target.value)}
              disabled={loading}
              placeholder="https://example.com"
            />
          </Box>
        )

      case 1: // Location
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Location Information</Typography>
            
            <TextField
              fullWidth
              label="Street Address *"
              value={companyData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={loading}
              required
            />
            
            <TextField
              fullWidth
              label="City *"
              value={companyData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              disabled={loading}
              required
            />
            
            <TextField
              fullWidth
              label="State/Province *"
              value={companyData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              disabled={loading}
              required
            />

            <TextField
              fullWidth
              label="Postal/Zip Code"
              value={companyData.zip_code}
              onChange={(e) => handleInputChange('zip_code', e.target.value)}
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Country *"
              value={companyData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              disabled={loading}
              required
            />
          </Box>
        )

      case 2: // Contact Details
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
            
            <TextField
              fullWidth
              label="Contact Email *"
              type="email"
              value={companyData.company_email}
              onChange={(e) => handleInputChange('company_email', e.target.value)}
              disabled={loading}
              required
            />
            
            <TextField
              fullWidth
              label="Contact Phone *"
              value={companyData.company_phone}
              onChange={(e) => handleInputChange('company_phone', e.target.value)}
              disabled={loading}
              required
              placeholder="+1 (555) 123-4567"
            />
          </Box>
        )

      case 3: // Media
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Company Media</Typography>
            
            <Card sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>Company Logo</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  disabled={loading}
                  style={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleUploadLogo}
                  disabled={!logoFile || loading}
                >
                  Upload Logo
                </Button>
              </Box>
            </Card>

            <Card sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>Company Banner</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerSelect}
                  disabled={loading}
                  style={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleUploadBanner}
                  disabled={!bannerFile || loading}
                >
                  Upload Banner
                </Button>
              </Box>
            </Card>

            <Alert severity="info">
              You can upload your company logo and banner now, or do it later in your dashboard.
            </Alert>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5, p: 3, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        🏢 Company Setup
      </Typography>

      {/* Completion Percentage */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Profile Completion</Typography>
          <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            {completionPercentage}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={completionPercentage}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

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
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': { opacity: 0.8 }
            }}
            onClick={() => index <= step && setStep(index)}
          >
            {label}
          </Box>
        ))}
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
            step === steps.length - 1 ? 'Complete Setup' : 'Next'
          )}
        </Button>
      </Box>

      {/* Congratulations Dialog */}
      <Dialog open={showCongrats} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>🎉 Congratulations!</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
            {companyData.company_name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#555', lineHeight: 1.6 }}>
            Your company has been successfully registered! 
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            You will be redirected to your dashboard shortly...
          </Typography>
          <CircularProgress sx={{ mt: 3 }} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
