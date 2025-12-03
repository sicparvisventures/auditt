#!/bin/bash

echo "🔧 Fixing localhost white screen issue..."

# Stop any running processes
echo "🛑 Stopping existing processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Clean up
echo "🧹 Cleaning up..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start development server
echo "🚀 Starting development server..."
npm run dev &

# Wait a moment
sleep 3

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running!"
    echo "🌐 Open http://localhost:3000 in your browser"
else
    echo "❌ Development server failed to start"
    echo "🔍 Check the console for errors"
fi

echo ""
echo "📋 Troubleshooting steps:"
echo "1. Open http://localhost:3000"
echo "2. If still white, press F12 and check console for errors"
echo "3. Try http://localhost:3000/landing directly"
echo "4. If issues persist, run: npm run dev"


