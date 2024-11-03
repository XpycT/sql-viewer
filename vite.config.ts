import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import tsconfigPaths from "vite-tsconfig-paths";
import dynamicImport from "vite-plugin-dynamic-import";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/main.tsx"],
      refresh: true,
    }),
    compression(),
    react(),
    tsconfigPaths(),
    dynamicImport(),
  ],
  build: {
    outDir: resolve(__dirname, "public"),
    manifest: "manifest.json",
    rollupOptions: {
      output: {
        // entryFileNames: '[name].js',
        // chunkFileNames: '[name].js',
        // assetFileNames: '[name].[ext]'
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./resources/js"),
    },
  },
});
