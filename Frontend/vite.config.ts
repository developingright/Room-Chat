import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig,loadEnv } from "vite"

export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': env,
    },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
}})