// ForgetPassword.jsx - Forget Password flow with email verification
import { useState } from 'react'
import { Box, Button, TextField, Typography, Alert, CircularProgress, Stepper, Step, StepLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/authAPI'

export default function ForgetPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0: Request, 1: Verify OTP, 2: Reset Password
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const steps = ['Request OTP', 'Enter OTP', 'New Password']

  // Step 0: Request password reset OTP
  const handleRequestReset = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Please enter your email')
      return
    }

    setLoading(true)
    try {
      await authAPI.requestPasswordReset({ email })
      setSuccess('✅ 6-digit OTP sent to your email! Check your inbox.')
      setStep(1)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 1: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!otp) {
      setError('Please enter the 6-digit OTP')
      return
    }

    if (otp.length !== 6) {
      setError('OTP must be exactly 6 digits')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.verifyResetToken({ token: otp })
      if (response.data.valid) {
        setSuccess('✅ OTP verified! Now set your new password.')
        setStep(2)
      } else {
        setError('Invalid or expired OTP')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await authAPI.resetPassword({ token: otp, newPassword })
      setSuccess('✅ Password reset successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        🔐 Reset Password
      </Typography>

      {/* Stepper */}
      <Stepper activeStep={step} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form>
        {/* Step 0: Request OTP */}
        {step === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              Enter your email address to receive a 6-digit OTP
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              onClick={handleRequestReset}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
            </Button>
          </Box>
        )}

        {/* Step 1: Verify OTP */}
        {step === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              Check your email for the 6-digit OTP and enter it below
            </Typography>

            <TextField
              fullWidth
              label="6-Digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={loading}
              placeholder="123456"
              inputProps={{ 
                maxLength: 6,
                style: { 
                  fontSize: '24px', 
                  letterSpacing: '8px', 
                  textAlign: 'center',
                  fontWeight: 'bold'
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              onClick={handleVerifyOTP}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => {
                setStep(0)
                setOtp('')
                setError('')
                setSuccess('')
              }}
              disabled={loading}
            >
              Resend OTP
            </Button>
          </Box>
        )}

        {/* Step 2: Reset Password */}
        {step === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              Enter your new password
            </Typography>

            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              onClick={handleResetPassword}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back
            </Button>
          </Box>
        )}
      </form>

      {/* Back to Login Link */}
      <Typography align="center" sx={{ mt: 3 }}>
        <Button size="small" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </Typography>
    </Box>
  )
}
