#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🚀 Starting Express backend server...\n');

const backend = spawn('npx', ['tsx', 'server/index.ts'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

backend.on('error', (error) => {
  console.error(`❌ Failed to start backend: ${error.message}`);
  process.exit(1);
});

backend.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Backend exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Stopping backend server...');
  backend.kill('SIGINT');
  process.exit(0);
});
