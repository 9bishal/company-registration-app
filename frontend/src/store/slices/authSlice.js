/**
 * authSlice.js - Authentication State Management
 * 
 * Redux slice for handling user authentication and authorization.
 * 
 * Features:
 * - User registration with mobile verification
 * - Login/Logout
 * - Mobile OTP verification
 * - Session persistence using localStorage
 * - Temporary token storage for verification flow
 * 
 * Authentication Flow:
 * 1. Register → tempToken stored in sessionStorage (not authenticated)
 * 2. Verify OTP → token moved to localStorage (authenticated)
 * 3. Login → token stored in localStorage (authenticated)
 * 
 * State:
 * - user: User object with profile data
 * - token: JWT authentication token
 * - isAuthenticated: Boolean flag for auth status
 * - loading: API call status
 * - error: Error messages
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../api/authAPI'

// Thunk: Check authentication status on app load
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (!token || !user) {
        return rejectWithValue('No authentication data found')
      }
      
      return {
        token,
        user: JSON.parse(user)
      }
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return rejectWithValue('Invalid authentication data')
    }
  }
)

// Thunk: Register new user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData)
      const { user, token, requires_mobile_verification } = response.data.data
      
      // If verification is required, store token temporarily for verification API
      if (requires_mobile_verification) {
        // Store token temporarily (for verify-mobile API call) but don't authenticate user
        sessionStorage.setItem('tempToken', token)
        sessionStorage.setItem('pendingUser', JSON.stringify({ email: user.email, mobile_no: user.mobile_no }))
        return { 
          user: null, 
          token: null, 
          requiresVerification: true,
          pendingEmail: user.email,
          pendingMobile: user.mobile_no
        }
      }
      
      // If no verification required, store normally
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { user, token }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

// Thunk: Verify mobile OTP
export const verifyMobileOTP = createAsyncThunk(
  'auth/verifyMobile',
  async ({ otp }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyMobile({ otp })
      const { user, token } = response.data.data
      
      // Now store token and user in localStorage after successful verification
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Clean up temporary storage
      sessionStorage.removeItem('pendingUser')
      sessionStorage.removeItem('tempToken')
      
      return { user, token }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed')
    }
  }
)

// Thunk: Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials)
      const { user, token } = response.data.data
      
      // Store token and user data in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return { user, token }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

// Thunk: Logout user
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('pendingUser')
    sessionStorage.removeItem('tempToken')
    return null
  }
)

// Initial state - loads from localStorage if available
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token')
}

// Auth slice - defines state, reducers, and extra reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('pendingUser')
      sessionStorage.removeItem('tempToken')
    }
  },
  extraReducers: (builder) => {
    /* -------- Check Auth -------- */
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
    })
    builder.addCase(checkAuth.rejected, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
    })

    /* -------- Register -------- */
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false
      // Only set user and token if verification is NOT required
      if (action.payload.requiresVerification) {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      } else {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      }
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    /* -------- Verify Mobile -------- */
    builder.addCase(verifyMobileOTP.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(verifyMobileOTP.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    })
    builder.addCase(verifyMobileOTP.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    /* -------- Login -------- */
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    /* -------- Logout -------- */
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    })
  }
})

// Export actions
export const { clearError, logout } = authSlice.actions

// Export reducer
export default authSlice.reducer
