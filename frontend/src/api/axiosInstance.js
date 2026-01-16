import axios from 'axios'

// Simple fallback toast function (can be replaced with react-toastify later)
const showNotification = (message, type = 'error') => {
  // Fallback: log to console and optionally show alert
  console.log(`[${type.toUpperCase()}] ${message}`)
  // You can add custom notification logic here later
}

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
    // Try to get token from localStorage first (authenticated users)
    let token = localStorage.getItem('token')
    
    // If not found, try sessionStorage (for pending verification)
    if (!token) {
      token = sessionStorage.getItem('tempToken')
    }
    
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
            showNotification('Session expired. Please login again.')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
          break
        case 403:
          showNotification('Access denied')
          break
        // Don't show generic toasts for 400, 404, 500 - let components handle them
      }
    } else if (error.code === 'ECONNABORTED') {
      showNotification('Request timeout')
    } else if (error.code === 'ERR_NETWORK') {
      showNotification('Network error. Please check your connection.')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance