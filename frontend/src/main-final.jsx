import React from 'react'
import ReactDOM from 'react-dom/client'

const SimpleApp = () => <div style={{padding: '30px'}}><h1>✅ React App Working!</h1><p>The frontend is now operational!</p></div>

ReactDOM.createRoot(document.getElementById('root')).render(<SimpleApp />)
