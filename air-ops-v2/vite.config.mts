import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],

export default defineConfig({
  base: "/test/", // ✅ Ensures assets load from /test/
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
