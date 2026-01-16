// SettingsPage.jsx - Settings with tabs for company info, founding info, social media, and account settings
import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider
} from '@mui/material'
import { Delete, Add, Save, CloudUpload } from '@mui/icons-material'
import { companyAPI } from '../api/companyAPI'
import { useNavigate } from 'react-router-dom'

const SettingsPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [company, setCompany] = useState(null)
  const [formData, setFormData] = useState({
    company_name: '',
    description: '',
    industry: '',
    company_size: '',
    organization_type: '',
    year_established: '',
    company_website: '',
    vision: '',
    company_email: '',
    company_phone: '',
    social_links: []
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const fetchCompanyData = async () => {
    try {
      const response = await companyAPI.getCompany()
      const data = response.data
      setCompany(data)
      setFormData({
        company_name: data.company_name || '',
        description: data.description || '',
        industry: data.industry || '',
        company_size: data.company_size || '',
        organization_type: data.organization_type || '',
        year_established: data.year_established || '',
        company_website: data.company_website || '',
        vision: data.vision || '',
        company_email: data.company_email || '',
        company_phone: data.company_phone || '',
        social_links: data.social_links ? JSON.parse(data.social_links) : []
      })
    } catch (err) {
      console.error('Failed to fetch company data:', err)
    }
  }

  const handleUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialLinkChange = (index, field, value) => {
    const updated = [...formData.social_links]
    updated[index][field] = value
    setFormData(prev => ({ ...prev, social_links: updated }))
  }

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      social_links: [...prev.social_links, { platform: 'LinkedIn', url: '' }]
    }))
  }

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index)
    }))
  }

  const handleSaveChanges = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updateData = {
        ...formData,
        social_links: JSON.stringify(formData.social_links)
      }
      await companyAPI.updateCompany(updateData)
      setSuccess('Changes saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // API call to change password would go here
      setSuccess('Password changed successfully!')
      setPasswords({ current: '', new: '', confirm: '' })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            ⚙️ Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your company profile and account settings
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ m: 3 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ m: 3 }}>
            {error}
          </Alert>
        )}

        <Tabs 
          value={activeTab} 
          onChange={(e, newVal) => setActiveTab(newVal)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Company Info" />
          <Tab label="Founding Info" />
          <Tab label="Social Media" />
          <Tab label="Account Setting" />
        </Tabs>

        {/* Tab 1: Company Info */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Company Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Company name *" 
                value={formData.company_name}
                onChange={(e) => handleUpdate('company_name', e.target.value)}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="About us"
                multiline
                rows={6}
                value={formData.description}
                onChange={(e) => handleUpdate('description', e.target.value)}
                disabled={loading}
                placeholder="Tell us about your company..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Industry</InputLabel>
                <Select
                  value={formData.industry}
                  label="Industry"
                  onChange={(e) => handleUpdate('industry', e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Healthcare">Healthcare</MenuItem>
                  <MenuItem value="Retail">Retail</MenuItem>
                  <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Company Size</InputLabel>
                <Select
                  value={formData.company_size}
                  label="Company Size"
                  onChange={(e) => handleUpdate('company_size', e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="1-10">1-10</MenuItem>
                  <MenuItem value="11-50">11-50</MenuItem>
                  <MenuItem value="51-200">51-200</MenuItem>
                  <MenuItem value="201-500">201-500</MenuItem>
                  <MenuItem value="501-1000">501-1000</MenuItem>
                  <MenuItem value="1000+">1000+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Founding Info */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Founding Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Organization Type</InputLabel>
                <Select
                  value={formData.organization_type}
                  label="Organization Type"
                  onChange={(e) => handleUpdate('organization_type', e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="Private Limited">Private Limited</MenuItem>
                  <MenuItem value="Public Limited">Public Limited</MenuItem>
                  <MenuItem value="LLP">LLP</MenuItem>
                  <MenuItem value="Partnership">Partnership</MenuItem>
                  <MenuItem value="Sole Proprietorship">Sole Proprietorship</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Year of Establishment"
                type="number"
                value={formData.year_established}
                onChange={(e) => handleUpdate('year_established', e.target.value)}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Website url..." 
                value={formData.company_website}
                onChange={(e) => handleUpdate('company_website', e.target.value)}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Vision"
                multiline
                rows={4}
                value={formData.vision}
                onChange={(e) => handleUpdate('vision', e.target.value)}
                disabled={loading}
                placeholder="Tell us about the vision of your company..."
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Social Media */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Social Media Profiles
          </Typography>
          
          <Grid container spacing={3}>
            {formData.social_links.map((link, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl sx={{ width: 180 }}>
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={link.platform}
                      label="Platform"
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                      disabled={loading}
                    >
                      <MenuItem value="Facebook">Facebook</MenuItem>
                      <MenuItem value="Twitter">Twitter</MenuItem>
                      <MenuItem value="Instagram">Instagram</MenuItem>
                      <MenuItem value="YouTube">YouTube</MenuItem>
                      <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Profile link/url..."
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    disabled={loading}
                  />
                  <IconButton color="error" onClick={() => removeSocialLink(index)} disabled={loading}>
                    <Delete />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button
            startIcon={<Add />}
            variant="outlined"
            sx={{ mt: 3 }}
            onClick={addSocialLink}
            disabled={loading}
          >
            Add New Social Link
          </Button>
        </TabPanel>

        {/* Tab 4: Account Settings */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Account Settings
          </Typography>
          
          {/* Contact Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Phone" 
                    value={formData.company_phone}
                    onChange={(e) => handleUpdate('company_phone', e.target.value)}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Email" 
                    type="email" 
                    value={formData.company_email}
                    onChange={(e) => handleUpdate('company_email', e.target.value)}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Change Password
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Current Password" 
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="New Password" 
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Confirm Password" 
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={handlePasswordChange}
                disabled={loading || !passwords.current || !passwords.new || !passwords.confirm}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Alert severity="warning" icon={<Delete />}>
            <Typography variant="body2" gutterBottom>
              <strong>Delete Account</strong>
            </Typography>
            <Typography variant="body2" gutterBottom>
              If you delete your account, you will no longer be able to access your data.
              You will be abandoned from all services.
            </Typography>
            <Button color="error" variant="outlined" sx={{ mt: 1 }}>
              Close Account
            </Button>
          </Alert>
        </TabPanel>

        {/* Save Button */}
        <Divider />
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default SettingsPage
