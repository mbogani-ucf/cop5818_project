import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000", // The backend server URL
        changeOrigin: true,
        secure: false, // If using HTTPS on the backend, set to true
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: Removes '/api' prefix before sending the request to the backend
      },
    },
  },
});
