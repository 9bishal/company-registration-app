import { useState } from 'react'
import { Box, Button, TextField, Typography, Select, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function CompanySetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  
  const steps = ['Company Info', 'Founding Info', 'Social Media', 'Contact']

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      navigate('/dashboard')
    }
  }

  const prevStep = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Company Setup</Typography>
      
      {/* Step indicator */}
      <Box sx={{ display: 'flex', mb: 3 }}>
        {steps.map((label, index) => (
          <Box key={label} sx={{ flex: 1, textAlign: 'center', p: 1, 
            bgcolor: index <= step ? 'blue' : 'lightgray', color: 'white' }}>
            {label}
          </Box>
        ))}
      </Box>
      
      {/* Form content based on step */}
      {step === 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Company Information</Typography>
          <TextField fullWidth label="Company name" sx={{ mb: 2 }} />
          <TextField fullWidth multiline rows={4} label="About us" sx={{ mb: 2 }} />
        </Box>
      )}
      
      {step === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Founding Information</Typography>
          <Select fullWidth sx={{ mb: 2 }} defaultValue="">
            <MenuItem value="">Select...</MenuItem>
            <MenuItem value="Private">Private</MenuItem>
            <MenuItem value="Public">Public</MenuItem>
          </Select>
          <TextField fullWidth label="Year of Establishment" sx={{ mb: 2 }} />
          <TextField fullWidth label="Website url..." sx={{ mb: 2 }} />
        </Box>
      )}
      
      {step === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Social Media</Typography>
          <TextField fullWidth label="Facebook" sx={{ mb: 2 }} />
          <TextField fullWidth label="Twitter" sx={{ mb: 2 }} />
          <TextField fullWidth label="Instagram" sx={{ mb: 2 }} />
          <TextField fullWidth label="YouTube" sx={{ mb: 2 }} />
        </Box>
      )}
      
      {step === 3 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
          <Typography>Map Location</Typography>
          <TextField fullWidth label="Phone" sx={{ mb: 2 }} />
          <TextField fullWidth label="Email" sx={{ mb: 2 }} />
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={prevStep} disabled={step === 0}>
          Previous
        </Button>
        <Button variant="contained" onClick={nextStep}>
          {step === 3 ? 'Finish Setup' : 'Next'}
        </Button>
      </Box>
    </Box>
  )
}