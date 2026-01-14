import axios from 'axios'
import { toast } from 'react-toastify'

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle specific global errors here to avoid duplicate toasts
    // Let individual components handle their own error messages
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Only redirect if not on login/register pages
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register')) {
            toast.error('Session expired. Please login again.')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
          break
        case 403:
          toast.error('Access denied')
          break
        // Don't show generic toasts for 400, 404, 500 - let components handle them
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout')
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance