import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  IconButton
} from '@mui/material'
import { CloudUpload, Close } from '@mui/icons-material'

const Step1Logo = ({ formData, onUpdate }) => {
  const [logoPreview, setLogoPreview] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)

  // Load existing images on mount
  useEffect(() => {
    if (formData.logo_url) {
      setLogoPreview(formData.logo_url)
    }
    if (formData.banner_url) {
      setBannerPreview(formData.banner_url)
    }
  }, [formData.logo_url, formData.banner_url])

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      onUpdate('logo', file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      onUpdate('banner', file)
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveLogo = () => {
    onUpdate('logo', null)
    setLogoPreview(null)
  }

  const handleRemoveBanner = () => {
    onUpdate('banner', null)
    setBannerPreview(null)
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Logo & Banner Image
      </Typography>

      {/* Upload Logo */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Upload Logo
        </Typography>
        {logoPreview && (
          <Card sx={{ mb: 2, p: 2, textAlign: 'center', position: 'relative' }}>
            <IconButton
              onClick={handleRemoveLogo}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
              }}
              size="small"
            >
              <Close />
            </IconButton>
            <img 
              src={logoPreview} 
              alt="Logo preview" 
              style={{ 
                maxHeight: 200, 
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: 8
              }} 
            />
          </Card>
        )}
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUpload />}
          fullWidth
          sx={{ py: 3, mb: 1, borderStyle: 'dashed', borderWidth: 2 }}
        >
          {logoPreview ? 'Change Logo' : 'Browse photo or drop here'}
          <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
        </Button>
        <Typography variant="caption" color="text.secondary">
          A photo larger than 400 pixels work best. Max photo size 5 MB.
        </Typography>
      </Box>

      {/* Upload Banner */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Banner Image
        </Typography>
        {bannerPreview && (
          <Card sx={{ mb: 2, p: 2, textAlign: 'center', position: 'relative' }}>
            <IconButton
              onClick={handleRemoveBanner}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
              }}
              size="small"
            >
              <Close />
            </IconButton>
            <img 
              src={bannerPreview} 
              alt="Banner preview" 
              style={{ 
                maxHeight: 200, 
                width: '100%', 
                objectFit: 'cover',
                borderRadius: 8
              }} 
            />
          </Card>
        )}
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUpload />}
          fullWidth
          sx={{ py: 3, mb: 1, borderStyle: 'dashed', borderWidth: 2 }}
        >
          {bannerPreview ? 'Change Banner' : 'Browse photo or drop here'}
          <input type="file" hidden accept="image/*" onChange={handleBannerChange} />
        </Button>
        <Typography variant="caption" color="text.secondary">
          Banner images optimal dimension: 1500x400. Supported format: JPG, PNG.
        </Typography>
      </Box>

      {/* Company Name */}
      <TextField
        fullWidth
        label="Company name *"
        margin="normal"
        value={formData.company_name || ''}
        onChange={(e) => onUpdate('company_name', e.target.value)}
        required
      />

      {/* About Us */}
      <TextField
        fullWidth
        label="About us"
        multiline
        rows={4}
        margin="normal"
        placeholder="Write down about your company here. Let the candidate know who we are..."
        value={formData.description || ''}
        onChange={(e) => onUpdate('description', e.target.value)}
      />
    </Box>
  )
}

export default Step1Logo
