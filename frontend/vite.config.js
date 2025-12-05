import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ksnu-portfolio/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@tensorflow/tfjs')) {
              return 'tensorflow';
            }
            if (id.includes('gsap')) {
              return 'gsap';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
