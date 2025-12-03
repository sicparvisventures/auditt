// Quick fix for localhost white screen issue
// Run this in your browser console or as a script

console.log('🔧 AuditFlow Localhost Fix Starting...');

// Check if we're on localhost
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('📍 Localhost detected');
    
    // Check if Next.js is running
    fetch('/api/health')
        .then(response => {
            if (response.ok) {
                console.log('✅ Next.js server is running');
            } else {
                console.log('❌ Next.js server has issues');
                redirectToFix();
            }
        })
        .catch(error => {
            console.log('❌ Next.js server is not responding');
            redirectToFix();
        });
    
    // Check for common issues
    setTimeout(() => {
        checkForIssues();
    }, 2000);
}

function redirectToFix() {
    console.log('🔄 Redirecting to fix page...');
    window.location.href = '/quick_localhost_fix.html';
}

function checkForIssues() {
    console.log('🔍 Checking for common issues...');
    
    // Check if body has content
    if (document.body.children.length === 0) {
        console.log('❌ Body is empty - likely JavaScript error');
        showError('JavaScript error detected. Check console for details.');
        return;
    }
    
    // Check if CSS is loaded
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    if (stylesheets.length === 0) {
        console.log('❌ No CSS files loaded');
        showError('CSS files not loading properly.');
        return;
    }
    
    // Check for React errors
    const errorElements = document.querySelectorAll('[data-react-error]');
    if (errorElements.length > 0) {
        console.log('❌ React errors detected');
        showError('React component errors detected.');
        return;
    }
    
    console.log('✅ No obvious issues detected');
}

function showError(message) {
    // Create error overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; max-width: 500px; padding: 2rem;">
            <h2 style="color: #ff6b6b; margin-bottom: 1rem;">⚠️ Localhost Issue</h2>
            <p style="margin-bottom: 2rem;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="window.location.href='/quick_localhost_fix.html'" style="background: #F495BD; color: white; border: none; padding: 1rem 2rem; border-radius: 5px; cursor: pointer;">
                    Open Fix Page
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #666; color: white; border: none; padding: 1rem 2rem; border-radius: 5px; cursor: pointer;">
                    Dismiss
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// Auto-run the fix
if (typeof window !== 'undefined') {
    // Run immediately
    console.log('🚀 AuditFlow Localhost Fix loaded');
}


