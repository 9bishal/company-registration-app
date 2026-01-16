import { useState, useEffect } from 'react'
import { 
  TextField, Button, Box, Typography, Alert, CircularProgress, Paper 
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { verifyMobileOTP } from '../store/slices/authSlice'
import { authAPI } from '../api/authAPI'

export default function VerifyMobile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const email = location.state?.email || ''
  const mobile = location.state?.mobile || ''

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  // Redirect if no email/mobile provided
  useEffect(() => {
    if (!email && !mobile) {
      navigate('/register')
    }
  }, [email, mobile, navigate])

  // Handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      // Use Redux thunk to verify OTP
      await dispatch(verifyMobileOTP({ otp })).unwrap()
      
      setSuccess('✅ Mobile verified successfully! Redirecting...')
      
      // Redirect to company setup after 2 seconds
      setTimeout(() => {
        navigate('/company-setup')
      }, 2000)
    } catch (err) {
      const errorMsg = err || 'Verification failed. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Handle resend OTP
  const handleResend = async () => {
    setError('')
    setSuccess('')
    setResendLoading(true)

    try {
      const response = await authAPI.resendOTP({ email, mobile_no: mobile })
      
      if (response.data.success) {
        setSuccess('✅ New OTP sent successfully!')
        setCountdown(60)
        setCanResend(false)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to resend OTP. Please try again.'
      setError(errorMsg)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Box sx={{ 
      maxWidth: 450, 
      mx: 'auto', 
      mt: { xs: 4, sm: 8, md: 10 }, 
      p: { xs: 2, sm: 3 } 
    }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            📱 Verify Mobile Number
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We've sent a 6-digit verification code to
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 1, 
              fontWeight: 600, 
              color: 'primary.main' 
            }}
          >
            {email && email}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600, 
              color: 'primary.main' 
            }}
          >
            {mobile && mobile}
          </Typography>
        </Box>

        {/* Alerts */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* OTP Form */}
        <form onSubmit={handleVerify}>
          <TextField
            fullWidth
            label="Enter 6-Digit OTP"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
              setOtp(value)
            }}
            placeholder="000000"
            inputProps={{ 
              maxLength: 6,
              style: { 
                fontSize: '1.5rem', 
                textAlign: 'center', 
                letterSpacing: '0.5rem' 
              }
            }}
            sx={{ mb: 3 }}
            disabled={loading || !!success}
            autoFocus
          />

          {/* Verify Button */}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading || otp.length !== 6 || !!success}
            sx={{ mb: 2, py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Verify & Continue'
            )}
          </Button>
        </form>

        {/* Resend OTP */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Didn't receive the code?
          </Typography>
          {canResend ? (
            <Button
              onClick={handleResend}
              disabled={resendLoading}
              size="small"
              sx={{ mt: 1 }}
            >
              {resendLoading ? (
                <CircularProgress size={20} />
              ) : (
                'Resend OTP'
              )}
            </Button>
          ) : (
            <Typography 
              variant="body2" 
              sx={{ mt: 1, color: 'text.secondary' }}
            >
              Resend available in {countdown}s
            </Typography>
          )}
        </Box>

        {/* Back to Register */}
        <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Wrong email or mobile?
          </Typography>
          <Button
            onClick={() => navigate('/register')}
            size="small"
            sx={{ mt: 0.5 }}
          >
            Back to Register
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
