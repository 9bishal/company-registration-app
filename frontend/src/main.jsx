/**
 * main.jsx - Application Entry Point
 * 
 * This is the root file that initializes the React application.
 * It sets up:
 * - React DOM rendering
 * - Redux store provider for state management
 * - Main App component with routing
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import './index.css'

console.log('🚀 Starting Company Registration App...')

// Render the app with Redux store and React strict mode
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)