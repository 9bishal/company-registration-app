import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { companyAPI } from '../api/companyAPI'
import { CircularProgress, Box } from '@mui/material'

export default function CompanyCheck({ children, requireCompany = false }) {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [hasCompany, setHasCompany] = useState(false)

  useEffect(() => {
    const checkCompany = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const response = await companyAPI.getCompany()
        if (response.data.success && response.data.data) {
          setHasCompany(true)
        } else {
          setHasCompany(false)
        }
      } catch (error) {
        // 404 means no company found
        if (error.response?.status === 404) {
          setHasCompany(false)
        } else {
          console.error('Error checking company:', error)
          setHasCompany(false)
        }
      } finally {
        setLoading(false)
      }
    }

    checkCompany()
  }, [isAuthenticated])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If on dashboard and no company exists, redirect to setup
  if (requireCompany && !hasCompany) {
    return <Navigate to="/company-setup" replace />
  }

  return children
}
