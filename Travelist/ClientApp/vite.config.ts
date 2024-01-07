import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: 44405,
    https: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7011',
        secure: false,
      },
    },
  },
});