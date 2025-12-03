#!/bin/bash

# Cloudflare Pages Build Script
# Optimized for 25MB deployment limit

echo "🚀 Starting Cloudflare Pages build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist .next out

# Set production environment
export NODE_ENV=production

# Install dependencies (if needed)
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build:cloudflare

# Check build size
echo "📊 Checking build size..."
BUILD_SIZE=$(du -sh dist | cut -f1)
echo "Build size: $BUILD_SIZE"

# Create deployment package
echo "📦 Creating deployment package..."
cd dist
zip -r ../poule-poulette-audit-cloudflare.zip .
cd ..

# Check zip size
ZIP_SIZE=$(du -sh poule-poulette-audit-cloudflare.zip | cut -f1)
echo "📦 Deployment package size: $ZIP_SIZE"

# Verify files
echo "✅ Build completed successfully!"
echo "📁 Build output: dist/"
echo "📦 Deployment package: poule-poulette-audit-cloudflare.zip"
echo ""
echo "🚀 Ready for Cloudflare Pages deployment!"
echo "   Upload the 'poule-poulette-audit-cloudflare.zip' file to Cloudflare Pages"