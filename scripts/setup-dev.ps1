#!/usr/bin/env pwsh
# Development setup script for Windows

Write-Host "🚀 Setting up Sustainovate development environment..." -ForegroundColor Green

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$nodeVersion = node --version
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build shared package first
Write-Host "🔨 Building shared package..." -ForegroundColor Yellow
npm run build --workspace=packages/shared

Write-Host "✅ Setup complete! Run 'npm run dev' to start development." -ForegroundColor Green
