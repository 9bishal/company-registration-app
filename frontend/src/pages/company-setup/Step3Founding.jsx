import React from 'react'
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material'

const Step3Founding = ({ formData, onUpdate }) => {
  const organizationTypes = [
    'Private Limited',
    'Public Limited',
    'LLP (Limited Liability Partnership)',
    'Partnership',
    'Sole Proprietorship',
    'Non-Profit',
    'Other'
  ]

  const industrySectors = [
    'Technology',
    'Finance',
    'Healthcare',
    'Retail',
    'Manufacturing',
    'Education',
    'Real Estate',
    'Entertainment',
    'Transportation',
    'Other'
  ]

  const companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5000+'
  ]

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Founding Information
      </Typography>

      <Grid container spacing={3}>
        {/* Organization Type */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Organization Type *</InputLabel>
            <Select
              label="Organization Type *"
              value={formData.organization_type || ''}
              onChange={(e) => onUpdate('organization_type', e.target.value)}
              required
            >
              <MenuItem value="">Select...</MenuItem>
              {organizationTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Industry */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Industry Sector *</InputLabel>
            <Select
              label="Industry Sector *"
              value={formData.industry || ''}
              onChange={(e) => onUpdate('industry', e.target.value)}
              required
            >
              <MenuItem value="">Select...</MenuItem>
              {industrySectors.map((industry) => (
                <MenuItem key={industry} value={industry}>{industry}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Company Size */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Company Size *</InputLabel>
            <Select
              label="Company Size *"
              value={formData.company_size || ''}
              onChange={(e) => onUpdate('company_size', e.target.value)}
              required
            >
              <MenuItem value="">Select...</MenuItem>
              {companySizes.map((size) => (
                <MenuItem key={size} value={size}>{size} employees</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Year of Establishment */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Year of Establishment *"
            type="number"
            margin="normal"
            placeholder="2020"
            value={formData.year_established || ''}
            onChange={(e) => onUpdate('year_established', e.target.value)}
            inputProps={{ min: 1800, max: new Date().getFullYear() }}
            required
          />
        </Grid>

        {/* Website */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company Website"
            margin="normal"
            placeholder="https://www.example.com"
            value={formData.company_website || ''}
            onChange={(e) => onUpdate('company_website', e.target.value)}
          />
        </Grid>

        {/* Company Vision */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company Vision"
            multiline
            rows={4}
            margin="normal"
            placeholder="Tell us about the vision of your company..."
            value={formData.vision || ''}
            onChange={(e) => onUpdate('vision', e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Step3Founding
