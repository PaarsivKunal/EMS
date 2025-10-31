import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../server/public', // build frontend into backend/public
    emptyOutDir: true,          // cleans folder before build
  },
  base: './',                   // use relative paths
  optimizeDeps: {
    exclude: [
      'html2canvas',
      'qrcode',
      'bootstrap-icons'
    ],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      '@reduxjs/toolkit',
      'react-redux',
      'redux-persist'
    ]
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
