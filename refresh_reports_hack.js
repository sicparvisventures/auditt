// Console script om rapporten te refreshen zonder pagina reload
// Voer dit uit in de browser console (F12 -> Console)

console.log('🔄 Refreshing reports data...');

// 1. Clear any cached data
if (window.location.reload) {
    console.log('💾 Clearing browser cache...');
    // Force reload without cache
    window.location.reload(true);
} else {
    // Alternative method for newer browsers
    console.log('🔃 Reloading page...');
    window.location.href = window.location.href;
}

// Alternative: If we're on the reports page, try to refresh just the data
if (window.location.pathname.includes('/rapporten')) {
    console.log('📊 On reports page - attempting smart refresh...');
    
    // Try to find refresh buttons and click them
    const refreshButtons = document.querySelectorAll('[class*="button"], [class*="refresh"], button');
    refreshButtons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes('refresh') || 
            btn.textContent.toLowerCase().includes('vernieuw')) {
            console.log('🎯 Found refresh button, clicking...', btn);
            btn.click();
        }
    });
    
    // Also try to refresh after a short delay
    setTimeout(() => {
        console.log('⏰ Second attempt - full page reload');
        window.location.reload();
    }, 2000);
}

console.log('✅ Refresh commands executed');

