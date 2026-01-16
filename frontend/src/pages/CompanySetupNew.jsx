// CompanySetupNew.jsx - Multi-step company setup with separate step components
import { useState, useEffect } from 'react'
import { 
  Box, Button, Typography, Alert, CircularProgress, 
  LinearProgress, Dialog, DialogTitle, DialogContent, Paper, Stepper, Step, StepLabel
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { companyAPI } from '../api/companyAPI'
import Step1Logo from './company-setup/Step1Logo'
import Step2Social from './company-setup/Step2Social'
import Step3Founding from './company-setup/Step3Founding'
import Step4Contact from './company-setup/Step4Contact'

export default function CompanySetupNew() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [showCongrats, setShowCongrats] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [companyId, setCompanyId] = useState(null)

  // Form data for company information
  const [formData, setFormData] = useState({
    company_name: '',
    description: '',
    industry: '',
    company_size: '',
    organization_type: '',
    year_established: '',
    company_website: '',
    vision: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    company_email: '',
    company_phone: '',
    social_links: [],
    logo: null,
    banner: null
  })

  const steps = [
    'Company Info', 
    'Social Media Profile', 
    'Founding Info', 
    'Contact'
  ]

  // Check if company already exists on mount
  useEffect(() => {
    const checkExistingCompany = async () => {
      try {
        const response = await companyAPI.getCompany()
        if (response.data.success && response.data.data) {
          const company = response.data.data
          setIsEditMode(true)
          setCompanyId(company.id)
          
          // Load existing company data
          setFormData({
            company_name: company.company_name || '',
            description: company.description || '',
            industry: company.industry || '',
            company_size: company.company_size || '',
            organization_type: company.organization_type || '',
            year_established: company.year_established || '',
            company_website: company.company_website || '',
            vision: company.vision || '',
            address: company.address || '',
            city: company.city || '',
            state: company.state || '',
            zip_code: company.zip_code || '',
            country: company.country || '',
            company_email: company.company_email || '',
            company_phone: company.company_phone || '',
            social_links: typeof company.social_links === 'string' 
              ? JSON.parse(company.social_links) 
              : (company.social_links || []),
            logo: null,
            banner: null,
            logo_url: company.logo_url || null,
            banner_url: company.banner_url || null
          })
        }
      } catch (error) {
        // 404 means no company exists, which is fine
        if (error.response?.status !== 404) {
          console.error('Error checking company:', error)
        }
      } finally {
        setInitialLoading(false)
      }
    }

    checkExistingCompany()
  }, [])

  // Calculate completion percentage
  useEffect(() => {
    const requiredFields = [
      'company_name',
      'company_email',
      'company_phone',
      'industry',
      'company_size',
      'organization_type',
      'address',
      'city',
      'state',
      'country'
    ]
    
    const filledFields = requiredFields.filter(field => 
      formData[field] && formData[field].toString().trim() !== ''
    )
    
    const percentage = Math.round((filledFields.length / requiredFields.length) * 100)
    setCompletionPercentage(percentage)
  }, [formData])

  // Update form field
  const handleUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Move to next step
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit()
    } else {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  // Move to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  // Submit company information
  const handleSubmit = async () => {
    setError('')

    // Validation
    if (!formData.company_name || !formData.company_email) {
      setError('Company name and email are required')
      return
    }

    setLoading(true)
    try {
      // Create company data object (excluding files for now)
      const companyData = {
        company_name: formData.company_name,
        description: formData.description,
        industry: formData.industry,
        company_size: formData.company_size,
        organization_type: formData.organization_type,
        year_established: formData.year_established,
        company_website: formData.company_website,
        vision: formData.vision,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        company_email: formData.company_email,
        company_phone: formData.company_phone,
        social_links: JSON.stringify(formData.social_links)
      }

      if (isEditMode) {
        // Update existing company
        await companyAPI.updateCompany(companyData)
      } else {
        // Create new company
        await companyAPI.createCompany(companyData)
      }

      // Upload logo if provided
      if (formData.logo) {
        const logoFormData = new FormData()
        logoFormData.append('logo', formData.logo)
        try {
          const logoResponse = await companyAPI.uploadLogo(logoFormData)
          console.log('Logo uploaded successfully:', logoResponse.data)
        } catch (err) {
          console.error('Logo upload failed:', err)
          setError('Logo upload failed. Please try again.')
        }
      }

      // Upload banner if provided
      if (formData.banner) {
        const bannerFormData = new FormData()
        bannerFormData.append('banner', formData.banner)
        try {
          const bannerResponse = await companyAPI.uploadBanner(bannerFormData)
          console.log('Banner uploaded successfully:', bannerResponse.data)
        } catch (err) {
          console.error('Banner upload failed:', err)
          setError('Banner upload failed. Please try again.')
        }
      }

      // Reload company data to get updated URLs
      try {
        const response = await companyAPI.getCompany()
        if (response.data.success && response.data.data) {
          const company = response.data.data
          setFormData(prev => ({
            ...prev,
            logo_url: company.logo_url || prev.logo_url,
            banner_url: company.banner_url || prev.banner_url
          }))
        }
      } catch (err) {
        console.error('Failed to reload company data:', err)
      }
      
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

  // Render current step component
  const renderStepContent = () => {
    switch(activeStep) {
      case 0:
        return <Step1Logo formData={formData} onUpdate={handleUpdate} />
      case 1:
        return <Step2Social formData={formData} onUpdate={handleUpdate} />
      case 2:
        return <Step3Founding formData={formData} onUpdate={handleUpdate} />
      case 3:
        return <Step4Contact formData={formData} onUpdate={handleUpdate} completionPercentage={completionPercentage} />
      default:
        return null
    }
  }

  // Show loading while checking for existing company
  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: { xs: 2, sm: 3, md: 5 }, p: { xs: 2, sm: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
          🏢 {isEditMode ? 'Edit Company Profile' : 'Company Setup'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          {isEditMode ? 'Update your company information' : 'Complete your company profile to get started'}
        </Typography>

        {/* Completion Percentage */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Profile Completion
            </Typography>
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

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4, display: { xs: 'none', sm: 'flex' } }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Mobile Step Indicator */}
        <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
          </Typography>
        </Box>

        {/* Alerts */}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Form Content */}
        <Box sx={{ mb: 4, minHeight: { xs: 300, sm: 400 } }}>
          {renderStepContent()}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
            sx={{ minWidth: { xs: '100%', sm: 120 }, order: { xs: 2, sm: 1 } }}
          >
            Back
          </Button>

          <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }} />

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            sx={{ minWidth: { xs: '100%', sm: 150 }, order: { xs: 1, sm: 3 } }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              activeStep === steps.length - 1 
                ? (isEditMode ? 'Update Company' : 'Complete Setup')
                : 'Next'
            )}
          </Button>
        </Box>
      </Paper>

      {/* Congratulations Dialog */}
      <Dialog open={showCongrats} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>🎉</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Congratulations!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
            {formData.company_name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#555', lineHeight: 1.6 }}>
            Your company profile is {completionPercentage}% complete!
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
            Redirecting to your dashboard...
          </Typography>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
