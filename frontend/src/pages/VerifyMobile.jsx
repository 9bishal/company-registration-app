// VerifyMobile.jsx - Mobile number verification with OTP
import { useState, useEffect } from 'react'
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../api/authAPI'

export default function VerifyMobile() {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [resendDisabled, setResendDisabled] = useState(true)
  const [resendTimer, setResendTimer] = useState(30)

  // Get phone and email from navigation state
  const phone = location.state?.phone || ''
  const email = location.state?.email || ''

  // Countdown timer for resend button
  useEffect(() => {
    if (resendDisabled && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (resendTimer === 0) {
      setResendDisabled(false)
    }
  }, [resendTimer, resendDisabled])

  // Handle OTP submission
  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP')
      return
    }

    setLoading(true)
    try {
      // Verify OTP with backend
      const response = await authAPI.verifyMobile({ otp, mobile_no: phone })
      setMessage('✅ Mobile number verified successfully!')
      
      // Redirect to company setup
      setTimeout(() => {
        navigate('/company-setup')
      }, 1500)

    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    setError('')
    setMessage('')
    setResendDisabled(true)
    
    try {
      const response = await authAPI.resendOtp()
      const emailStatus = response.data.email_status
      
      let successMsg = '✅ OTP resent successfully!'
      if (emailStatus === 'sent' || emailStatus === 'ethereal') {
        successMsg += ' Please check your email and phone.'
      } else if (emailStatus === 'error' || emailStatus === 'failed') {
        successMsg += ' (Note: Email service encountered an issue, but OTP is generated. Check terminal logs if in development.)'
      }
      
      setMessage(successMsg)
      setResendTimer(30)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.')
      setResendDisabled(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 3, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>
        📱 Verify Mobile Number
      </Typography>
      
      <Typography sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
        We've sent an OTP to {phone}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      
      <form onSubmit={handleVerify}>
        {/* OTP Input Field */}
        <TextField
          fullWidth
          label="Enter OTP"
          type="number"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="000000"
          sx={{ mb: 2 }}
          disabled={loading}
          inputProps={{ maxLength: 6 }}
        />
        
        {/* Verify Button */}
        <Button 
          fullWidth 
          variant="contained" 
          type="submit"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
        </Button>
      </form>
      
      {/* Resend OTP Option */}
      <Typography align="center" sx={{ mb: 2 }}>
        Didn't receive OTP?{' '}
        <Button 
          size="small" 
          onClick={handleResendOtp}
          disabled={resendDisabled}
        >
          {resendDisabled ? `Resend in ${resendTimer}s` : 'Resend OTP'}
        </Button>
      </Typography>

      {/* Back to Login */}
      <Typography align="center">
        <Button size="small" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </Typography>
    </Box>
  )
}
