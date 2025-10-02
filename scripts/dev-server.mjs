#!/usr/bin/env node

import { createServer as createViteServer } from "vite";
import express from "express";
import { spawn } from "child_process";

async function startDevServer() {
  // For now, let's just run the regular Vite dev server
  // The API will be handled separately via a serverless function or build step

  // Create Vite server
  const vite = await createViteServer({
    server: {
      port: 8080,
      host: true,
    },
    appType: "spa",
  });

  await vite.listen();

  console.log(`🚀 Dev server running at http://localhost:8080`);
  console.log(
    `ℹ️  API endpoints will be available after build or via serverless functions`,
  );
}

startDevServer().catch(console.error);
