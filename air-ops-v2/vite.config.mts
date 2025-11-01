/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],

export default defineConfig({
  base: "/", // ✅ Root path for production
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/interfaces": path.resolve(__dirname, "./src/interfaces"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker"],
  },
});
