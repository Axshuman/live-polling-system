#!/usr/bin/env node

/**
 * Development script to run both frontend and backend servers
 * Usage: npm run dev:all
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Live Polling System Development Servers...\n');

// Start backend server
console.log('📡 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..', 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start frontend server after a short delay
setTimeout(() => {
  console.log('🎨 Starting frontend server...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
    process.exit(0);
  });

  frontend.on('close', (code) => {
    console.log(`Frontend server exited with code ${code}`);
    backend.kill('SIGINT');
  });
}, 2000);

backend.on('close', (code) => {
  console.log(`Backend server exited with code ${code}`);
});