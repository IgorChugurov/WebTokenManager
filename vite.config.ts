import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5008,
    proxy: {
      // with options if you need to use change origin
      "/api": {
        target: "http://localhost:8009",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
