/**
 * routes.jsx - Application Routing Configuration
 * 
 * Defines all application routes and their access controls:
 * 
 * Public Routes (no authentication required):
 * - /login - User login
 * - /register - New user registration
 * - /verify-mobile - OTP verification (requires temp token)
 * - /forgot-password - Password reset
 * 
 * Protected Routes (authentication required):
 * - /company-setup - Create/edit company profile
 * - /dashboard - View company dashboard (requires company profile)
 * 
 * Route Guards:
 * - ProtectedRoute: Checks if user is authenticated
 * - CompanyCheck: Ensures company profile exists before accessing dashboard
 * - RootRedirect: Smart redirect based on auth and company status
 */

import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import RootRedirect from './components/RootRedirect'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyMobile from './pages/VerifyMobile'
import ForgetPassword from './pages/ForgetPassword'
import CompanySetupNew from './pages/CompanySetupNew'
import DashboardEnhanced from './pages/DashboardEnhanced'
import ProtectedRoute from './components/ProtectedRoute'
import CompanyCheck from './components/CompanyCheck'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RootRedirect />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'verify-mobile',
        element: <VerifyMobile />
      },
      {
        path: 'forgot-password',
        element: <ForgetPassword />
      },
      {
        path: 'company-setup',
        element: (
          <ProtectedRoute>
            <CompanySetupNew />
          </ProtectedRoute>
        )
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <CompanyCheck requireCompany={true}>
              <DashboardEnhanced />
            </CompanyCheck>
          </ProtectedRoute>
        )
      },
      {
        path: '*',
        element: <Navigate to="/login" replace />
      }
    ]
  }
])