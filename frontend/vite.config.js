import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})

//these are the proxy settings for vite, means it will proxy all the requests starting with /api to http://localhost:5000

