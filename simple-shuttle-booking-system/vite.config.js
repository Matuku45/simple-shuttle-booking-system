import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",      // listen on all interfaces
    port: 5173,            // ✅ changed to 8080
    hmr: {
      overlay: true,
      host: "localhost"    // fixes repeated restarts
    },
    allowedHosts: "all"    // allow any ngrok host
  },
});
