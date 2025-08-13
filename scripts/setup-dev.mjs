#!/usr/bin/env node

/**
 * Development setup script
 * Run with: npm run setup
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Setting up Sustainovate development environment...\n');

// Check if .env exists
if (!existsSync('.env')) {
  console.log('📋 Creating .env file from template...');
  execSync('cp .env.example .env', { stdio: 'inherit' });
  console.log('✅ .env file created!\n');
  
  console.log('⚠️  IMPORTANT: Please update your .env file with:');
  console.log('   - Discord OAuth credentials (DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET)');
  console.log('   - Database URLs if using external services');
  console.log('   - JWT secrets for production\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Build shared package
console.log('\n🔨 Building shared package...');
execSync('npm run build:shared', { stdio: 'inherit' });

// Build all packages
console.log('\n🏗️  Building all packages...');
execSync('npm run build', { stdio: 'inherit' });

console.log('\n🎉 Setup complete! You can now run:');
console.log('');
console.log('  npm start           - Start API server');
console.log('  npm run dev:api     - Start API in development mode');
console.log('  npm run dev:all     - Start all services in development');
console.log('  npm run docker:up   - Start with Docker (includes databases)');
console.log('');
console.log('🔗 API will be available at: http://localhost:4000');
console.log('🔐 Discord Auth: http://localhost:4000/auth/discord');
console.log('');
