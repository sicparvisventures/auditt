#!/bin/bash

# Simple Cloudflare Pages Build Script
# This script creates a minimal working build

echo "🚀 Starting simple Cloudflare Pages build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist .next out

# Set production environment
export NODE_ENV=production

# Create a simple static build
echo "🔨 Creating simple static build..."

# Create dist directory
mkdir -p dist

# Copy public files
echo "📁 Copying public files..."
cp -r public/* dist/

# Create a simple index.html
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuditFlow - Interne Audit Tool</title>
    <meta name="description" content="Interne audit tool voor district managers van Poule & Poulette filialen">
    <link rel="icon" href="/kipje.png">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1C3834 0%, #93231F 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .container {
            text-align: center;
            max-width: 600px;
            padding: 2rem;
        }
        
        .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 2rem;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .logo img {
            width: 80px;
            height: auto;
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 1.5rem;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        
        .feature h3 {
            margin-bottom: 0.5rem;
            color: #F495BD;
        }
        
        .cta {
            margin-top: 2rem;
        }
        
        .btn {
            display: inline-block;
            background: #F495BD;
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .status {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        
        .status.success {
            border-left: 4px solid #4CAF50;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .container {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="/kipje.png" alt="AuditFlow Logo">
        </div>
        
        <h1>AuditFlow</h1>
        <p class="subtitle">Interne Audit Tool voor Poule & Poulette</p>
        
        <div class="features">
            <div class="feature">
                <h3>📊 Audits</h3>
                <p>Voer uitgebreide audits uit van filialen</p>
            </div>
            <div class="feature">
                <h3>📋 Checklist</h3>
                <p>Gebruik gestandaardiseerde checklists</p>
            </div>
            <div class="feature">
                <h3>📈 Rapporten</h3>
                <p>Genereer gedetailleerde rapporten</p>
            </div>
            <div class="feature">
                <h3>🎯 Acties</h3>
                <p>Beheer verbeteracties en follow-ups</p>
            </div>
        </div>
        
        <div class="cta">
            <a href="/landing" class="btn">Start AuditFlow</a>
        </div>
        
        <div class="status success">
            <strong>✅ Deployment Status:</strong> Cloudflare Pages Ready
            <br>
            <small>Build optimized for 25MB limit</small>
        </div>
    </div>
    
    <script>
        // Simple analytics
        console.log('AuditFlow loaded successfully');
        
        // Add some interactivity
        document.querySelector('.btn').addEventListener('click', function(e) {
            // Add loading state
            this.textContent = 'Laden...';
            this.style.opacity = '0.7';
        });
    </script>
</body>
</html>
EOF

# Create landing page
mkdir -p dist/landing
cat > dist/landing/index.html << 'EOF'
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuditFlow - Landing</title>
    <link rel="icon" href="/kipje.png">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #FBFBF1;
            min-height: 100vh;
            color: #060709;
        }
        
        .header {
            background: #1C3834;
            color: white;
            padding: 1rem 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .logo img {
            width: 40px;
            height: auto;
        }
        
        .main {
            padding: 4rem 0;
            text-align: center;
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #1C3834;
        }
        
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 3rem;
            color: #666;
        }
        
        .actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        
        .btn-primary {
            background: #1C3834;
            color: white;
        }
        
        .btn-secondary {
            background: #F495BD;
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .features {
            margin-top: 4rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .feature-card h3 {
            color: #1C3834;
            margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .actions {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <div class="logo">
                    <img src="/kipje.png" alt="AuditFlow">
                    <span>AuditFlow</span>
                </div>
            </nav>
        </div>
    </header>
    
    <main class="main">
        <div class="container">
            <h1>Welkom bij AuditFlow</h1>
            <p class="subtitle">De complete audit oplossing voor Poule & Poulette</p>
            
            <div class="actions">
                <a href="/pp-login" class="btn btn-primary">Inloggen</a>
                <a href="/organization-login" class="btn btn-secondary">Organisatie Login</a>
            </div>
            
            <div class="features">
                <div class="feature-card">
                    <h3>🔍 Uitgebreide Audits</h3>
                    <p>Voer gedetailleerde audits uit met gestandaardiseerde checklists en scoren systemen.</p>
                </div>
                <div class="feature-card">
                    <h3>📊 Real-time Rapportage</h3>
                    <p>Genereer automatisch rapporten en krijg inzicht in prestaties en verbeterpunten.</p>
                </div>
                <div class="feature-card">
                    <h3>🎯 Actie Management</h3>
                    <p>Beheer verbeteracties, stel deadlines in en volg de voortgang van implementaties.</p>
                </div>
            </div>
        </div>
    </main>
    
    <script>
        console.log('AuditFlow Landing Page loaded');
    </script>
</body>
</html>
EOF

# Create other essential pages
mkdir -p dist/pp-login
cat > dist/pp-login/index.html << 'EOF'
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuditFlow - Login</title>
    <link rel="icon" href="/kipje.png">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #FBFBF1;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            background: white;
            padding: 3rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 100%;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .logo img {
            width: 80px;
            height: auto;
        }
        
        h1 {
            text-align: center;
            color: #1C3834;
            margin-bottom: 2rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 500;
        }
        
        input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e1e5e9;
            border-radius: 5px;
            font-size: 1rem;
        }
        
        input:focus {
            outline: none;
            border-color: #1C3834;
        }
        
        .btn {
            width: 100%;
            background: #1C3834;
            color: white;
            padding: 0.75rem;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .btn:hover {
            background: #2a4f4a;
        }
        
        .demo-users {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #e1e5e9;
        }
        
        .demo-users h3 {
            margin-bottom: 1rem;
            color: #666;
            font-size: 0.9rem;
        }
        
        .demo-user {
            display: block;
            width: 100%;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            background: #f8f9fa;
            border: 1px solid #e1e5e9;
            border-radius: 5px;
            text-decoration: none;
            color: #333;
            font-size: 0.9rem;
            transition: background 0.2s;
        }
        
        .demo-user:hover {
            background: #e9ecef;
        }
        
        .back-link {
            text-align: center;
            margin-top: 1rem;
        }
        
        .back-link a {
            color: #666;
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .back-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <img src="/kipje.png" alt="AuditFlow">
        </div>
        
        <h1>Inloggen</h1>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="userId">Gebruikers ID</label>
                <input type="text" id="userId" name="userId" required>
            </div>
            
            <button type="submit" class="btn">Inloggen</button>
        </form>
        
        <div class="demo-users">
            <h3>Demo gebruikers:</h3>
            <a href="#" class="demo-user" onclick="setUserId('ADMIN')">ADMIN - Admin User</a>
            <a href="#" class="demo-user" onclick="setUserId('MAN01')">MAN01 - Manager</a>
            <a href="#" class="demo-user" onclick="setUserId('MAN02')">MAN02 - Inspector</a>
        </div>
        
        <div class="back-link">
            <a href="/landing">← Terug naar homepage</a>
        </div>
    </div>
    
    <script>
        function setUserId(userId) {
            document.getElementById('userId').value = userId;
        }
        
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const userId = document.getElementById('userId').value;
            
            if (userId) {
                // Simulate login
                alert('Login functionaliteit wordt geladen...');
                // In a real app, this would redirect to the dashboard
                window.location.href = '/pp-dashboard';
            }
        });
    </script>
</body>
</html>
EOF

# Create dashboard page
mkdir -p dist/pp-dashboard
cat > dist/pp-dashboard/index.html << 'EOF'
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuditFlow - Dashboard</title>
    <link rel="icon" href="/kipje.png">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #FBFBF1;
            color: #060709;
        }
        
        .header {
            background: #1C3834;
            color: white;
            padding: 1rem 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .logo img {
            width: 40px;
            height: auto;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .main {
            padding: 2rem 0;
        }
        
        .welcome {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .welcome h1 {
            color: #1C3834;
            margin-bottom: 0.5rem;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .stat-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1C3834;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }
        
        .actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .action-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .action-card h3 {
            color: #1C3834;
            margin-bottom: 1rem;
        }
        
        .btn {
            display: inline-block;
            background: #1C3834;
            color: white;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            transition: background 0.2s;
            margin-top: 1rem;
        }
        
        .btn:hover {
            background: #2a4f4a;
        }
        
        .btn-secondary {
            background: #F495BD;
        }
        
        .btn-secondary:hover {
            background: #e884a8;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 0 1rem;
            }
            
            .stats {
                grid-template-columns: 1fr;
            }
            
            .actions {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <div class="logo">
                    <img src="/kipje.png" alt="AuditFlow">
                    <span>AuditFlow</span>
                </div>
                <div class="user-info">
                    <span>Welkom, Gebruiker</span>
                    <a href="/landing" style="color: white; text-decoration: none;">Uitloggen</a>
                </div>
            </nav>
        </div>
    </header>
    
    <main class="main">
        <div class="container">
            <div class="welcome">
                <h1>Dashboard</h1>
                <p>Overzicht van je audit activiteiten</p>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">24</div>
                    <div class="stat-label">Totaal Audits</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">8</div>
                    <div class="stat-label">Actieve Filialen</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">12</div>
                    <div class="stat-label">Openstaande Acties</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">87%</div>
                    <div class="stat-label">Gemiddelde Score</div>
                </div>
            </div>
            
            <div class="actions">
                <div class="action-card">
                    <h3>🔍 Nieuwe Audit</h3>
                    <p>Start een nieuwe audit voor een filiaal</p>
                    <a href="#" class="btn">Start Audit</a>
                </div>
                <div class="action-card">
                    <h3>📋 Checklist</h3>
                    <p>Bekijk en beheer audit checklists</p>
                    <a href="#" class="btn">Bekijk Checklist</a>
                </div>
                <div class="action-card">
                    <h3>📊 Rapporten</h3>
                    <p>Genereer en bekijk audit rapporten</p>
                    <a href="#" class="btn btn-secondary">Bekijk Rapporten</a>
                </div>
                <div class="action-card">
                    <h3>🎯 Acties</h3>
                    <p>Beheer verbeteracties en follow-ups</p>
                    <a href="#" class="btn btn-secondary">Beheer Acties</a>
                </div>
            </div>
        </div>
    </main>
    
    <script>
        console.log('AuditFlow Dashboard loaded');
        
        // Add some interactivity
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Functionaliteit wordt geladen...');
            });
        });
    </script>
</body>
</html>
EOF

# Create organization login page
mkdir -p dist/organization-login
cat > dist/organization-login/index.html << 'EOF'
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuditFlow - Organisatie Login</title>
    <link rel="icon" href="/kipje.png">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #FBFBF1;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            background: white;
            padding: 3rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .logo img {
            width: 80px;
            height: auto;
        }
        
        h1 {
            text-align: center;
            color: #1C3834;
            margin-bottom: 1rem;
        }
        
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 2rem;
        }
        
        .org-list {
            display: grid;
            gap: 1rem;
        }
        
        .org-item {
            display: block;
            padding: 1.5rem;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            text-decoration: none;
            color: #333;
            transition: all 0.2s;
        }
        
        .org-item:hover {
            border-color: #1C3834;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .org-name {
            font-weight: 600;
            color: #1C3834;
            margin-bottom: 0.5rem;
        }
        
        .org-desc {
            color: #666;
            font-size: 0.9rem;
        }
        
        .back-link {
            text-align: center;
            margin-top: 2rem;
        }
        
        .back-link a {
            color: #666;
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .back-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <img src="/kipje.png" alt="AuditFlow">
        </div>
        
        <h1>Organisatie Login</h1>
        <p class="subtitle">Selecteer je organisatie om in te loggen</p>
        
        <div class="org-list">
            <a href="/pp/login" class="org-item">
                <div class="org-name">Poule & Poulette</div>
                <div class="org-desc">Hoofdorganisatie - Volledige toegang</div>
            </a>
            <a href="/demo/login" class="org-item">
                <div class="org-name">Demo Organisatie</div>
                <div class="org-desc">Demo omgeving - Test functionaliteiten</div>
            </a>
            <a href="/test/login" class="org-item">
                <div class="org-name">Test Organisatie</div>
                <div class="org-desc">Test omgeving - Ontwikkeling</div>
            </a>
        </div>
        
        <div class="back-link">
            <a href="/landing">← Terug naar homepage</a>
        </div>
    </div>
    
    <script>
        console.log('AuditFlow Organization Login loaded');
    </script>
</body>
</html>
EOF

# Copy _redirects and _headers
cp public/_redirects dist/
cp _headers dist/

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

echo "✅ Simple build completed successfully!"
echo "📁 Build output: dist/"
echo "📦 Deployment package: poule-poulette-audit-cloudflare.zip"
echo ""
echo "🚀 Ready for Cloudflare Pages deployment!"
echo "   Upload the 'poule-poulette-audit-cloudflare.zip' file to Cloudflare Pages"


