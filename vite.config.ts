import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: "./client",
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["../client", "../shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "../server/**"],
    },
    cors: {
      origin: "*",
      credentials: true,
    },
    // Enable SPA routing support - redirects all requests to index.html
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  appType: "spa", // This tells Vite to handle SPA routing properly
  build: {
    outDir: "../dist",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Copy _redirects and .htaccess to dist
    copyPublicDir: true,
  },
  publicDir: "../public",
  plugins: [react()], // expressPlugin() disabled temporarily
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // Dynamically import the server to avoid module resolution issues
      import("./server/index.js")
        .then(({ createServer }) => {
          const app = createServer();
          // Add Express app as middleware to Vite dev server
          server.middlewares.use(app);
        })
        .catch(() => {
          // Fallback if server module is not found
          console.log("Server module not found, API routes disabled");
        });
    },
  };
}
