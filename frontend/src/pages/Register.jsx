import { useState } from 'react'
import { TextField, Button, Box, Typography, Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'Male',
    password: '',
    confirm: ''
  })

  const handleSubmit = () => {
    navigate('/verify-mobile')
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Register as a Company
      </Typography>
      
      <TextField
        fullWidth
        label="Full Name"
        value={form.name}
        onChange={(e) => setForm({...form, name: e.target.value})}
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        label="Mobile No"
        value={form.phone}
        onChange={(e) => setForm({...form, phone: e.target.value})}
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        label="Organization Email"
        value={form.email}
        onChange={(e) => setForm({...form, email: e.target.value})}
        sx={{ mb: 2 }}
      />
      
      <Typography sx={{ mb: 1 }}>Gender</Typography>
      <RadioGroup row value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})}>
        <FormControlLabel value="Male" control={<Radio />} label="Male" />
        <FormControlLabel value="Female" control={<Radio />} label="Female" />
        <FormControlLabel value="Other" control={<Radio />} label="Other" />
      </RadioGroup>
      
      <TextField
        fullWidth
        type="password"
        label="Password"
        value={form.password}
        onChange={(e) => setForm({...form, password: e.target.value})}
        sx={{ mb: 2, mt: 2 }}
      />
      
      <TextField
        fullWidth
        type="password"
        label="Confirm Password"
        value={form.confirm}
        onChange={(e) => setForm({...form, confirm: e.target.value})}
        sx={{ mb: 3 }}
      />
      
      <Button 
        fullWidth 
        variant="contained" 
        onClick={handleSubmit}
        sx={{ mb: 2 }}
      >
        Register
      </Button>
      
      <Typography align="center">
        Already have an account? <Button onClick={() => navigate('/login')}>Login</Button>
      </Typography>
    </Box>
  )
}