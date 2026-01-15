import { useState } from 'react'
import { Box, Button, TextField, Alert, CircularProgress, Typography, Link } from '@mui/material'

export default function EmailTest() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSendTest = async () => {
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5001/api/email/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Test Email - Company Registration',
          message: 'This is a test email to verify the email service is working.'
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          message: `✅ Email sent successfully to ${email}`,
          previewUrl: data.previewUrl,
          messageId: data.messageId
        })
      } else {
        setError(data.message || 'Failed to send email')
      }
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        📧 Email Service Test
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {result && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography>{result.message}</Typography>
          {result.previewUrl && (
            <Typography sx={{ mt: 1 }}>
              👀 <Link href={result.previewUrl} target="_blank" rel="noopener">
                Click here to view the email
              </Link>
            </Typography>
          )}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
        disabled={loading}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSendTest}
        disabled={loading || !email}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Test Email'}
      </Button>

      <Typography variant="body2" sx={{ color: '#666' }}>
        ℹ️ This will send a test email and show you a preview link if successful.
      </Typography>
    </Box>
  )
}
