import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/teams': 'http://localhost:3000',
      '/tasks': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
      '/reminders': 'http://localhost:3000'
    }
  }
})
