// Register.jsx - User registration page for company account creation
import { useState } from 'react'
import { 
  TextField, Button, Box, Typography, Alert, CircularProgress, 
  RadioGroup, FormControlLabel, Radio 
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerUser } from '../store/slices/authSlice'

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'Male',
    password: '',
    confirm: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Validate form inputs
  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return false
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    return true
  }

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setLoading(true)
    try {
      // Convert gender to M/F format
      const genderMap = { 'Male': 'M', 'Female': 'F', 'Other': 'M' }
      
      // Register user with backend using Redux thunk
      const result = await dispatch(registerUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        gender: genderMap[formData.gender] || 'M',
        mobile_no: formData.phone
      })).unwrap()

      setSuccess('✅ Registration successful! Please verify your mobile number...')
      
      // Redirect to verification page
      setTimeout(() => {
        navigate('/verify-mobile', { 
          state: { 
            email: formData.email, 
            mobile: formData.phone 
          } 
        })
      }, 1500)

    } catch (err) {
      const errorMsg = err || 'Registration failed'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Update form field
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: { xs: 4, sm: 5 }, p: { xs: 2, sm: 3 }, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        JobPilot
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <form onSubmit={handleRegister}>
        {/* Full Name */}
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        
        {/* Mobile Number */}
        <TextField
          fullWidth
          label="Mobile Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        
        {/* Email */}
        <TextField
          fullWidth
          label="Company Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        
        {/* Gender Selection */}
        <Typography sx={{ mb: 1, fontWeight: 500 }}>Gender</Typography>
        <RadioGroup 
          row 
          name="gender"
          value={formData.gender} 
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <FormControlLabel value="Male" control={<Radio />} label="Male" disabled={loading} />
          <FormControlLabel value="Female" control={<Radio />} label="Female" disabled={loading} />
          <FormControlLabel value="Other" control={<Radio />} label="Other" disabled={loading} />
        </RadioGroup>
        
        {/* Password */}
        <TextField
          fullWidth
          type="password"
          label="Password (min 8 characters)"
          name="password"
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={loading}
          error={formData.password.length > 0 && formData.password.length < 8}
          helperText={
            formData.password.length > 0 && formData.password.length < 8
              ? `Password too short (${formData.password.length}/8 characters)`
              : formData.password.length >= 8
              ? '✅ Password meets requirements'
              : ''
          }
        />
        
        {/* Confirm Password */}
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          name="confirm"
          value={formData.confirm}
          onChange={handleChange}
          sx={{ mb: 3 }}
          disabled={loading}
          error={formData.confirm.length > 0 && formData.password !== formData.confirm}
          helperText={
            formData.confirm.length > 0 && formData.password !== formData.confirm
              ? '❌ Passwords do not match'
              : formData.confirm.length > 0 && formData.password === formData.confirm
              ? '✅ Passwords match'
              : ''
          }
        />
        
        {/* Register Button */}
        <Button 
          fullWidth 
          variant="contained" 
          type="submit"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>
      </form>
      
      {/* Login Link */}
      <Typography align="center">
        Already have an account? 
        <Button onClick={() => navigate('/login')} size="small">
          Login
        </Button>
      </Typography>
    </Box>
  )
}
