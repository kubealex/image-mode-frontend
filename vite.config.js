import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'os';

const hostname = os.hostname();
const domain = hostname.split('.').slice(1).join('.');

export default defineConfig({
  plugins: [react()],
  cacheDir: '/var/app/frontend/.vite',
  server: {
    host: true,
    allowedHosts: domain ? [hostname, `.${domain}`] : [hostname],
    proxy: {
      '/bootc-status': {
        target: 'http://localhost:8005',
        rewrite: (path) => path.replace(/^\/bootc-status/, '/api/v1/status'),
      },
      '/api': `http://${process.env.API_HOST || 'localhost'}:3001`,
    },
  },
});
