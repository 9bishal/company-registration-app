// main.jsx - Application entry point
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { ToastContainer } from 'react-toastify'
// NOTE: Removed 'react-toastify/dist/ReactToastify.css' import as it causes module load issues
// CSS will be added manually later if needed
import './index.css'

// Error Boundary component to catch React errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px', fontFamily: 'monospace' }}>
          <h1>❌ Application Error</h1>
          <p>{this.state.error?.message}</p>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>{this.state.error?.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global JavaScript Error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason)
})

try {
  const root = document.getElementById('root')
  if (!root) {
    throw new Error('Root DOM element not found!')
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <ErrorBoundary>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </ErrorBoundary>
      </Provider>
    </React.StrictMode>
  )
} catch (error) {
  console.error('Failed to initialize app:', error)
  document.getElementById('root').innerHTML = `
    <div style="color: red; padding: 20px; font-family: monospace;">
      <h1>Failed to load application</h1>
      <p>${error.message}</p>
    </div>
  `
}