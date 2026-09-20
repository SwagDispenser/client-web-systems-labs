import { defineConfig } from 'vite';

export default defineConfig({
  base: '/client-web-systems-labs/lab-02/',
  server: {
    host: '0.0.0.0',
    open: false,
    port: 9000,
  },
  preview: {
    host: '0.0.0.0',
    port: 9000,
  },
});
