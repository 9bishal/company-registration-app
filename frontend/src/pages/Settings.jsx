// Settings.jsx - User account settings and preferences
import { useState } from 'react'
import { Box, Button, TextField, Typography, Card, CardContent, Alert, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // User settings state
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: false,
    two_factor_enabled: false
  })

  // Password change state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  // Update password
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwords.new !== passwords.confirm) {
      setError('Passwords do not match')
      return
    }

    if (passwords.new.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSuccess('✅ Password changed successfully')
      setPasswords({ current: '', new: '', confirm: '' })
      setLoading(false)
    }, 1000)
  }

  // Save settings
  const handleSaveSettings = async () => {
    setError('')
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSuccess('✅ Settings saved successfully')
      setLoading(false)
    }, 1000)
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          ⚙️ Settings
        </Typography>
        <Button size="small" onClick={() => navigate('/dashboard')}>
          Back
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Change Password Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🔐 Change Password
          </Typography>

          <form onSubmit={handleChangePassword}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <TextField
              fullWidth
              type="password"
              label="New Password (min 8 characters)"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🔔 Notification Preferences
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>Email Notifications</Typography>
              <Button
                variant={settings.email_notifications ? 'contained' : 'outlined'}
                onClick={() => setSettings({ ...settings, email_notifications: !settings.email_notifications })}
                disabled={loading}
              >
                {settings.email_notifications ? 'ON' : 'OFF'}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>SMS Notifications</Typography>
              <Button
                variant={settings.sms_notifications ? 'contained' : 'outlined'}
                onClick={() => setSettings({ ...settings, sms_notifications: !settings.sms_notifications })}
                disabled={loading}
              >
                {settings.sms_notifications ? 'ON' : 'OFF'}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>Marketing Emails</Typography>
              <Button
                variant={settings.marketing_emails ? 'contained' : 'outlined'}
                onClick={() => setSettings({ ...settings, marketing_emails: !settings.marketing_emails })}
                disabled={loading}
              >
                {settings.marketing_emails ? 'ON' : 'OFF'}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>Two-Factor Authentication</Typography>
              <Button
                variant={settings.two_factor_enabled ? 'contained' : 'outlined'}
                onClick={() => setSettings({ ...settings, two_factor_enabled: !settings.two_factor_enabled })}
                disabled={loading}
              >
                {settings.two_factor_enabled ? 'ON' : 'OFF'}
              </Button>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
