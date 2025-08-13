#!/usr/bin/env pwsh
# Production deployment script for Windows

Write-Host "🚀 Starting Sustainovate production deployment..." -ForegroundColor Green

# Check if PM2 is installed
if (-not (Get-Command pm2 -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing PM2 globally..." -ForegroundColor Yellow
    npm install -g pm2
}

# Build all packages
Write-Host "🔨 Building all packages..." -ForegroundColor Yellow
npm run build

# Start PM2 processes
Write-Host "🚀 Starting PM2 processes..." -ForegroundColor Yellow
npm run pm2:start:prod

Write-Host "✅ Production deployment complete!" -ForegroundColor Green
Write-Host "📊 View status: npm run pm2:status" -ForegroundColor Cyan
Write-Host "📋 View logs: npm run pm2:logs" -ForegroundColor Cyan
Write-Host "🖥️  Monitor: npm run pm2:monit" -ForegroundColor Cyan
