import { useState } from 'react'
import { Box, Typography, TextField, Button, Paper } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

export default function Settings() {
  const [logo, setLogo] = useState(null)
  const [banner, setBanner] = useState(null)

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>Company Info</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography sx={{ mb: 2 }}>Logo & Banner Image</Typography>
        
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 1 }}>Upload Logo</Typography>
            <Box 
              sx={{ 
                border: '2px dashed gray', 
                p: 3, 
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('logo-upload').click()}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: 'gray' }} />
              <Typography>Browse photo or drop here</Typography>
              <Typography variant="caption">Max 5 MB</Typography>
            </Box>
            <input 
              type="file" 
              id="logo-upload" 
              hidden 
              onChange={(e) => setLogo(e.target.files[0])} 
            />
            {logo && <Typography sx={{ mt: 1 }}>{logo.name}</Typography>}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 1 }}>Banner Image</Typography>
            <Box 
              sx={{ 
                border: '2px dashed gray', 
                p: 3, 
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('banner-upload').click()}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: 'gray' }} />
              <Typography>Browse photo or drop here</Typography>
              <Typography variant="caption">1500×400 pixels</Typography>
            </Box>
            <input 
              type="file" 
              id="banner-upload" 
              hidden 
              onChange={(e) => setBanner(e.target.files[0])} 
            />
            {banner && <Typography sx={{ mt: 1 }}>{banner.name}</Typography>}
          </Box>
        </Box>
        
        <TextField
          fullWidth
          label="Company name"
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="About us"
          placeholder="Write about your company..."
          sx={{ mb: 3 }}
        />
        
        <Button variant="contained">Save Changes</Button>
      </Paper>
      
      <Typography align="center" variant="caption">
        © 2021 Jobpilot - Job Board, All rights Reserved
      </Typography>
    </Box>
  )
}