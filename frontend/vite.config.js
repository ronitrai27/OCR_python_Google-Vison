import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    // Define global constants that can be replaced at build time
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    
    // Server configuration for development
    server: {
      port: 5173,
      proxy: {
        // Proxy API requests to backend in development
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    
    // Build configuration for production
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'leaflet-vendor': ['leaflet', 'react-leaflet'],
          }
        }
      }
    }
  }
})
