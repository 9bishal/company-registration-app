import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function VerifyMobile() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 3 }}>
      <Typography variant="h6" align="center" sx={{ mb: 1, fontWeight: 'bold' }}>
        Great! Almost done!
      </Typography>
      <Typography variant="h6" align="center" sx={{ mb: 3, color: 'primary.main' }}>
        Please verify your mobile number
      </Typography>
      
      <Typography align="center" sx={{ mb: 3 }}>
        A verification link has been sent to your email. Please check your inbox.
      </Typography>
      
      <Typography align="center" sx={{ mb: 2 }}>
        Enter OTP sent to (+91 92222****442)
      </Typography>
      
      <TextField
        fullWidth
        label="Enter Your OTP Here"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Typography align="center" sx={{ mb: 3 }}>
        Didn't receive OTP? <Button>Resend OTP</Button>
      </Typography>
      
      <Typography align="center" sx={{ mb: 3 }}>
        Having Trouble? <Button>Report Issue!</Button>
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          fullWidth 
          variant="outlined" 
          onClick={() => navigate('/register')}
        >
          Close
        </Button>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={() => navigate('/company-setup')}
        >
          Verify Mobile
        </Button>
      </Box>
    </Box>
  )
}