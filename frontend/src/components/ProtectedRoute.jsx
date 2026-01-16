import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth)
  
  // Check if user is authenticated (must have token and user data)
  if (!isAuthenticated || !token || !user) {
    console.log('🚫 Protected route - Not authenticated, redirecting to login')
    return <Navigate to="/login" replace />
  }
  
  console.log('✅ Protected route - Authenticated user:', user?.email)
  return children
}