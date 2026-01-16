import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { companyAPI } from '../api/companyAPI'
import { CircularProgress, Box } from '@mui/material'

export default function RootRedirect() {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [hasCompany, setHasCompany] = useState(false)
  
  useEffect(() => {
    const checkCompany = async () => {
      if (!isAuthenticated || !token || !user) {
        setLoading(false)
        return
      }

      try {
        const response = await companyAPI.getCompany()
        if (response.data.success && response.data.data) {
          setHasCompany(true)
          console.log('✅ User has company')
        }
      } catch (error) {
        // 404 means no company
        if (error.response?.status === 404) {
          setHasCompany(false)
          console.log('⚠️ No company found')
        }
      } finally {
        setLoading(false)
      }
    }

    checkCompany()
  }, [isAuthenticated, token, user])

  console.log('🔀 RootRedirect - isAuthenticated:', isAuthenticated, 'user:', user?.email, 'token:', !!token, 'loading:', loading, 'hasCompany:', hasCompany)

  if (loading && isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }
  
  // If not logged in, go to login
  if (!isAuthenticated || !token || !user) {
    console.log('🔐 Redirecting to /login')
    return <Navigate to="/login" replace />
  }
  
  // If logged in but no company, go to company setup
  if (!hasCompany) {
    console.log('🏢 Redirecting to /company-setup')
    return <Navigate to="/company-setup" replace />
  }
  
  // If logged in and has company, go to dashboard
  console.log('✅ Redirecting to /dashboard')
  return <Navigate to="/dashboard" replace />
}
