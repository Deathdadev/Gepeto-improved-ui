import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173, // Frontend dev server port
    strictPort: true,
    // Proxy configuration
    proxy: {
      // Proxy requests starting with /api to the backend server
      '/api': {
        target: 'http://localhost:3000', // Backend server address (matches backend/server.js)
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false, // Often needed when proxying to localhost HTTP from HTTPS dev server
        // Optional: rewrite path if needed, but not necessary here
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));