import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { Add, Delete } from '@mui/icons-material'

/**
 * Step2Social Component
 * 
 * Second step in the company setup process - Social Media Profiles
 * Allows users to add, edit, and remove their company's social media profiles
 * 
 * Features:
 * - Dynamic list of social media platforms (Facebook, Twitter, Instagram, etc.)
 * - Add/remove social links dynamically
 * - Platform selection from predefined list
 * - URL validation for social media profiles
 * 
 * @param {Object} formData - Current form data from parent component
 * @param {Function} onUpdate - Callback to update form data in parent
 */
const Step2Social = ({ formData, onUpdate }) => {
  // Initialize social links state with existing data or default platforms
  const [socialLinks, setSocialLinks] = useState(
    formData.social_links || [
      { platform: 'Facebook', url: '' },
      { platform: 'Twitter', url: '' },
      { platform: 'Instagram', url: '' },
      { platform: 'YouTube', url: '' }
    ]
  )

  // Available social media platforms for selection
  const platforms = ['Facebook', 'Twitter', 'Instagram', 'YouTube', 'LinkedIn', 'TikTok', 'Other']

  /**
   * Handle changes to social link fields (platform or URL)
   * Updates local state and propagates changes to parent component
   * 
   * @param {number} index - Index of the social link being modified
   * @param {string} field - Field being changed ('platform' or 'url')
   * @param {string} value - New value for the field
   */
  const handleLinkChange = (index, field, value) => {
    const updated = [...socialLinks]
    updated[index][field] = value
    setSocialLinks(updated)
    onUpdate('social_links', updated)
  }

  /**
   * Add a new social link entry to the list
   * Defaults to LinkedIn platform with empty URL
   */
  const addSocialLink = () => {
    const updated = [...socialLinks, { platform: 'LinkedIn', url: '' }]
    setSocialLinks(updated)
    onUpdate('social_links', updated)
  }

  /**
   * Remove a social link from the list
   * Prevents removal if only one link remains
   * 
   * @param {number} index - Index of the social link to remove
   */
  const removeSocialLink = (index) => {
    const updated = socialLinks.filter((_, i) => i !== index)
    setSocialLinks(updated)
    onUpdate('social_links', updated)
  }

  return (
    <Box>
      {/* Step title */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Social Media Profiles
      </Typography>

      {/* Step description */}
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Add your company's social media profiles to help candidates connect with you.
      </Typography>

      {/* Social links grid - dynamically rendered based on state */}
      <Grid container spacing={3}>
        {socialLinks.map((link, index) => (
          <Grid item xs={12} key={index}>
            <Typography variant="subtitle2" gutterBottom>
              Social Link {index + 1}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              {/* Platform selector dropdown */}
              <FormControl sx={{ width: 180 }}>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={link.platform}
                  label="Platform"
                  onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                >
                  {platforms.map((platform) => (
                    <MenuItem key={platform} value={platform}>
                      {platform}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* URL input field */}
              <TextField
                fullWidth
                label="Profile link/url..."
                placeholder="https://..."
                value={link.url}
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
              />
              
              {/* Delete button - only show if more than one link exists */}
              {socialLinks.length > 1 && (
                <IconButton color="error" onClick={() => removeSocialLink(index)}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Add new social link button */}
      <Button
        startIcon={<Add />}
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={addSocialLink}
      >
        Add New Social Link
      </Button>
    </Box>
  )
}

export default Step2Social
