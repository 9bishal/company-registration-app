// Login.jsx - User login page with email and password authentication
import { useState } from 'react'
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/authAPI'

export default function Login() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.login(credentials)
      const { token, user } = response.data.data

      // Store token and user info in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 3, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        🏢 Company Login
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        
        {/* Password Input */}
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        
        {/* Forgot Password Link */}
        <Typography align="right" sx={{ mb: 3 }}>
          <Button size="small" onClick={() => navigate('/register')}>
            Forgot Password?
          </Button>
        </Typography>
        
        {/* Login Button */}
        <Button 
          fullWidth 
          variant="contained" 
          type="submit"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
      </form>
      
      {/* Sign Up Link */}
      <Typography align="center">
        Don't have an account? 
        <Button onClick={() => navigate('/register')} size="small">
          Sign Up
        </Button>
      </Typography>
    </Box>
  )
}
