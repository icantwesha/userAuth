import { defineConfig } from "vite";

export default defineConfig({
  preview: {
    allowedHosts: ["userauth-kjsi.onrender.com"]
  },
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
