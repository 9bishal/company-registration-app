import { createSlice, createAsyncThunk } from '@reduxjs/toolkit' //createAsyncThunk → for API calls
import { authAPI } from '../../api/authAPI' //authAPI → for API calls

// Async thunks for API calls
// createAsyncThunk helps you do API calls in Redux in a clean way.
export const registerUser = createAsyncThunk(
  'auth/register', //-> this is just label, later it will be called as auth/register/pending, auth/register/fulfilled, auth/register/rejected
  async (userData, { rejectWithValue }) => {
    try { 
        // Send user data to backend /register API
      const response = await authAPI.register(userData) //userData → form data from user (email, password, etc.)
      // On success, return data (goes to Redux state)
      // API returns { success, data: { user, token } }
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

// Login 
export const loginUser = createAsyncThunk(
  'auth/login', //-> this is just label, later it will be called as auth/login/pending, auth/login/fulfilled, auth/login/rejected
  async (credentials, { rejectWithValue }) => {
    try { 
      console.log('Login credentials:', credentials) // Debug log
      const response = await authAPI.login(credentials) //credentials → form data from user (email, password, etc.)
      console.log('Login response:', response.data) // Debug log
      
      // Store token and user data in localStorage
      // API returns { success, data: { user, token } }
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    //       This means:
    // User stays logged in even after page refresh
    // Token can be used for protected API calls
    // 📌 localStorage = browser memory (persists after reload)


      return response.data.data
    } catch (error) {
      console.log('Login error:', error.response?.data) // Debug log
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout', //-> this is just label, later it will be called as auth/logout/pending, auth/logout/fulfilled, auth/logout/rejected   
  async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return null
  }
)
// initialstate mean -> When my app starts, what should my app already know?”
const initialState = {
    // JSON.parse converts string back to object
  user: JSON.parse(localStorage.getItem('user')) || null,//Get user from browser storage 
  token: localStorage.getItem('token') || null, //Gets JWT token from storage amd Used for authenticated API calls


  loading: false,
  // Stores error messages (if any)
  error: null,
  isAuthenticated: !!localStorage.getItem('token') //if token exist -> true, else false
}






const authSlice = createSlice({
  // Name of this slice
  name: 'auth',

  // Initial authentication state
  initialState,

  // Simple (sync) reducers
  reducers: { 
    // Clear error message
    clearError: (state) => {
      state.error = null
    }
  },

  // Handle async actions (login, register, logout)
  extraReducers: (builder) => {

    /* -------- Register -------- */

    // When registration starts
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true
      state.error = null
    })

    // When registration succeeds
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    })

    // When registration fails
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    /* -------- Login -------- */

    // When login starts
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })

    // When login succeeds
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    })

    // When login fails
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    /* -------- Logout -------- */

    // When logout succeeds
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    })
  }
})

// Export clearError action
export const { clearError } = authSlice.actions

// Export reducer to store
export default authSlice.reducer
