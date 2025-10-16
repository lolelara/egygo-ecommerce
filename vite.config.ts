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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // UI libraries
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            // Animation libraries
            if (id.includes('gsap') || id.includes('three') || id.includes('swiper')) {
              return 'vendor-animations';
            }
            // Appwrite
            if (id.includes('appwrite')) {
              return 'vendor-appwrite';
            }
            // Query & Forms
            if (id.includes('@tanstack') || id.includes('react-hook-form')) {
              return 'vendor-query';
            }
            // Other vendors
            return 'vendor-other';
          }
        },
      },
    },
    // Copy _redirects and .htaccess to dist
    copyPublicDir: true,
  },
  publicDir: "../public", // Relative to root (./client), points to project root public folder
  plugins: [
    react()
  ],
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
