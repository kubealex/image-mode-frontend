import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'os';

const hostname = os.hostname();
const domain = hostname.split('.').slice(1).join('.');

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: domain ? [hostname, `.${domain}`] : [hostname],
    proxy: {
      '/api': `http://${process.env.API_HOST || 'localhost'}:3001`,
    },
  },
});
