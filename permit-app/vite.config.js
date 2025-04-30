import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/spclpermits/',
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'react-bootstrap',
            'axios'
          ],
          charts: ['xlsx'],
          icons: ['react-bootstrap-icons']
        }
      }
    },
    sourcemap: false,
    /*     minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          mangle: {
            safari10: true
          },
          format: {
            comments: false
          }
        } */
  }
});