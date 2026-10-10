import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Split vendor code so it caches independently and the 3D engine
        // (only needed on desktop) is never in the main bundle.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("/three/") || id.includes("three-stdlib")) return "three";
          if (id.includes("/gsap/")) return "gsap";
          if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler"))
            return "react";
        },
      },
    },
  },
});
