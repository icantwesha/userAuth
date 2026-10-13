import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        auth: "auth.html",
        home: "home.html"
      }
    }
  }
});
