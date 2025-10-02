import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",   // <--- bind to all interfaces
    port: process.env.PORT || 3000,  // <--- Fly sets PORT dynamically
    hmr: { overlay: true },
  },
});
