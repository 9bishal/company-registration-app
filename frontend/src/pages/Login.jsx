// Login.jsx - User login page
import { useState } from 'react'
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUser } from '../store/slices/authSlice'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const result = await dispatch(loginUser(credentials)).unwrap()
      
      // Navigate to dashboard on success
      navigate('/dashboard')
    } catch (err) {
      setError(err || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: { xs: 4, sm: 8, md: 10 }, p: { xs: 2, sm: 3 }, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        🏢 Company Login
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        
        <Typography align="right" sx={{ mb: 3 }}>
          <Button size="small" onClick={() => navigate('/forgot-password')}>
            Forgot Password?
          </Button>
        </Typography>
        
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
      
      <Typography align="center">
        Don't have an account? 
        <Button onClick={() => navigate('/register')} size="small">
          Sign Up
        </Button>
      </Typography>
    </Box>
  )
}
