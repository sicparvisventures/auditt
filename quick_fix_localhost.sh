#!/bin/bash

# Quick Fix Script voor Localhost Styling Probleem
# Voer uit met: bash quick_fix_localhost.sh

echo "🔧 LOCALHOST STYLING FIX GESTART"
echo "================================"

# Ga naar project directory
cd "/Users/dietmar/Desktop/pp ops -- intern audit"

echo "📍 Huidige directory: $(pwd)"

# Stop alle Next.js processen
echo "🛑 Stoppen van alle Next.js processen..."
pkill -f "next" 2>/dev/null || echo "   Geen Next.js processen gevonden"

# Wacht even
sleep 2

# Clear Next.js cache
echo "🧹 Opschonen van cache..."
rm -rf .next 2>/dev/null || echo "   .next directory niet gevonden"
rm -rf node_modules/.cache 2>/dev/null || echo "   node_modules/.cache niet gevonden"
rm -rf dist 2>/dev/null || echo "   dist directory niet gevonden"

# Controleer of node_modules bestaat
if [ ! -d "node_modules" ]; then
    echo "📦 Installeren van dependencies..."
    npm install
else
    echo "✅ node_modules bestaat al"
fi

# Controleer of poort 3000 vrij is
echo "🔍 Controleren van poort 3000..."
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  Poort 3000 is in gebruik, gebruik poort 3001"
    PORT=3001
else
    echo "✅ Poort 3000 is beschikbaar"
    PORT=3000
fi

# Start development server
echo "🚀 Starten van development server op poort $PORT..."
echo "   URL: http://localhost:$PORT"
echo "   Druk Ctrl+C om te stoppen"
echo ""

# Start server met juiste poort
if [ $PORT -eq 3001 ]; then
    npm run dev -- --port 3001
else
    npm run dev
fi

