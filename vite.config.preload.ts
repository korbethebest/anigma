import { defineConfig } from "vite";

export default defineConfig({
  root: "src/main",
  build: {
    outDir: "../../dist",
    emptyOutDir: false,
    ssr: "./preload.ts",
  },
});
