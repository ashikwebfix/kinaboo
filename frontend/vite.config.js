import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['jodit-react', 'jodit', 'leaflet', 'react-leaflet', 'react-quill-new']
  },
  server: {
    port: 6711,
    strictPort: true,
    allowedHosts: [
      '65b6-2406-2d40-2c3f-3308-6d4e-a2a-cf8a-10cd.ngrok-free.app',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:6710',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://127.0.0.1:6710',
        changeOrigin: true
      }
    }
  },
  preview: {
    allowedHosts: true
  }
})
