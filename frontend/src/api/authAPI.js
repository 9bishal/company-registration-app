import axiosInstance from './axiosInstance'

export const authAPI = {
  // Register new user
  register: (userData) => axiosInstance.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  
  // Verify mobile OTP
  verifyMobile: (data) => axiosInstance.post('/auth/verify-mobile', data),
  
  // Resend OTP
  resendOTP: (data) => axiosInstance.post('/auth/resend-otp', data),
  
  // Get user profile
  getProfile: () => axiosInstance.get('/auth/profile'),
  
  // Password reset - Request reset
  requestPasswordReset: (data) => axiosInstance.post('/auth/forgot-password', data),
  
  // Password reset - Reset password with token
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  
  // Password reset - Verify token
  verifyResetToken: (data) => axiosInstance.post('/auth/verify-reset-token', data),
  
  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return Promise.resolve()
  }
}
