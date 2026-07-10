import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite builds the React bundle straight into the tasks app's static dir so
// Django's `runserver` serves it via {% static %}. Filenames are fixed (not
// hashed) so the template can reference them without parsing a manifest.
export default defineConfig({
  plugins: [react()],
  base: "/static/tasks/dist/",
  build: {
    outDir: "../static/tasks/dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "src/main.tsx",
      output: {
        entryFileNames: "assets/index.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/index[extname]",
      },
    },
  },
});
