import { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    navigate('/dashboard')
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Login as a Company
      </Typography>
      
      <TextField
        fullWidth
        label="Email ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        type="password"
        label="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Typography align="right" sx={{ mb: 3 }}>
        <Button size="small">Forget Password ?</Button>
      </Typography>
      
      <Button 
        fullWidth 
        variant="contained" 
        onClick={handleLogin}
        sx={{ mb: 2 }}
      >
        Login
      </Button>
      
      <Typography align="center">
        Don't have an account? <Button onClick={() => navigate('/register')}>Sign up</Button>
      </Typography>
    </Box>
  )
}