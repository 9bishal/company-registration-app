import React from 'react'
import ReactDOM from 'react-dom/client'

const App = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial', fontSize: '18px' }}>
    <h1>✅ React is Working!</h1>
    <p>This is the simplest possible test component.</p>
  </div>
)

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(<App />)
  console.log('✅ App mounted successfully')
} else {
  console.error('❌ Root element not found')
}
