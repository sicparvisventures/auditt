#!/bin/bash

echo "🚀 GitHub Push Script"
echo "===================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Check remote
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote already configured"
    git remote set-url origin https://github.com/dielemar/audittool.git
else
    echo "🔗 Adding remote..."
    git remote add origin https://github.com/dielemar/audittool.git
fi

echo ""
echo "📝 Adding all files..."
git add .

echo ""
echo "💾 Creating commit..."
git commit -m "Initial commit: Poule & Poulette Audit Tool with backend upgrades"

echo ""
echo "🌿 Setting main branch..."
git branch -M main

echo ""
echo "📤 Ready to push to GitHub!"
echo ""
echo "⚠️  IMPORTANT: You will be asked to authenticate"
echo ""
echo "Next steps:"
echo "1. Run: git push -u origin main"
echo "2. When asked for username: enter your GitHub username"
echo "3. When asked for password: use a Personal Access Token (not your password!)"
echo ""
echo "To create a Personal Access Token:"
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Click 'Generate new token (classic)'"
echo "3. Select 'repo' scope"
echo "4. Copy the token and use it as password"
echo ""
