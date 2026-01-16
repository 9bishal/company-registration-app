import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material'
import { LocationOn, Phone, Email } from '@mui/icons-material'

const Step4Contact = ({ formData, onUpdate, completionPercentage }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Contact Information
      </Typography>

      {/* Location Note */}
      <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn color="primary" />
            <Typography variant="body2" color="text.secondary">
              Map Location Integration (Coming Soon)
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Phone */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Phone fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Phone *
              </Typography>
            </Box>
            <TextField
              fullWidth
              placeholder="+1 (555) 123-4567"
              value={formData.company_phone || ''}
              onChange={(e) => onUpdate('company_phone', e.target.value)}
              required
            />
            <Typography variant="caption" color="text.secondary">
              Primary contact phone number
            </Typography>
          </Box>
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Email fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Email *
              </Typography>
            </Box>
            <TextField
              fullWidth
              type="email"
              placeholder="contact@company.com"
              value={formData.company_email || ''}
              onChange={(e) => onUpdate('company_email', e.target.value)}
              required
            />
            <Typography variant="caption" color="text.secondary">
              Primary contact email address
            </Typography>
          </Box>
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address *"
            margin="normal"
            value={formData.address || ''}
            onChange={(e) => onUpdate('address', e.target.value)}
            required
          />
        </Grid>

        {/* City & State */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City *"
            margin="normal"
            value={formData.city || ''}
            onChange={(e) => onUpdate('city', e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State/Province *"
            margin="normal"
            value={formData.state || ''}
            onChange={(e) => onUpdate('state', e.target.value)}
            required
          />
        </Grid>

        {/* Zip & Country */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Postal/Zip Code"
            margin="normal"
            value={formData.zip_code || ''}
            onChange={(e) => onUpdate('zip_code', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Country *"
            margin="normal"
            value={formData.country || ''}
            onChange={(e) => onUpdate('country', e.target.value)}
            required
          />
        </Grid>
      </Grid>

      {/* Progress Indicator */}
      <Card sx={{ mt: 4, textAlign: 'center', bgcolor: '#f9f9f9' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Setup Progress
          </Typography>
          <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
            {completionPercentage}%
          </Typography>
          <Box sx={{ px: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={completionPercentage}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Complete all required fields to finish your setup
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Step4Contact
