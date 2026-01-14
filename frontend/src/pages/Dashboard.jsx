import { Box, Typography, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, mb: 3, bgcolor: '#f0f9ff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 40, color: 'green' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Congratulations, Your profile is 100% complete!
            </Typography>
            <Typography sx={{ color: 'gray', mb: 2 }}>
              Donec hendrerit, ante mattis pellentesque eleifendi...
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained">View Dashboard</Button>
              <Button variant="outlined">View Profile</Button>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Company Information</Typography>
          {/* Add company info here */}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2 }}>
            <Typography sx={{ mb: 2 }}>Setup Progress</Typography>
            <Typography align="right">75% Completed</Typography>
            <Box sx={{ height: 8, bgcolor: '#e0e0e0', borderRadius: 4, mt: 1 }}>
              <Box sx={{ width: '75%', height: '100%', bgcolor: 'blue', borderRadius: 4 }} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}