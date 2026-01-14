import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = true // Change this with real auth check
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return children
}