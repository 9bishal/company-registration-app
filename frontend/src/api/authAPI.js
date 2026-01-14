import axiosInstance from './axiosInstance'

export const authAPI = {
  // Register new user
  register: (userData) => axiosInstance.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  
  // Verify mobile OTP
  verifyMobile: (data) => axiosInstance.post('/auth/verify-mobile', data),
  
  // Get user profile
  getProfile: () => axiosInstance.get('/auth/profile'),
  
  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return Promise.resolve()
  }
}