// Debug script voor loading issues in localhost
// Kopieer en plak dit in de browser console om loading problemen te debuggen

console.log('🔧 LOADING DEBUG SCRIPT GESTART');

// Functie om de huidige auth state te controleren
function checkAuthState() {
    console.log('=== AUTH STATE CHECK ===');
    
    // Check localStorage
    const savedUser = localStorage.getItem('audit_user');
    console.log('📦 LocalStorage audit_user:', savedUser ? 'AANWEZIG' : 'NIET AANWEZIG');
    
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            console.log('👤 User data:', {
                naam: user.naam,
                rol: user.rol,
                actief: user.actief
            });
        } catch (e) {
            console.error('❌ Fout bij parsen localStorage user:', e);
        }
    }
    
    // Check if we're on the right page
    console.log('🌍 Current URL:', window.location.href);
    console.log('📍 Current pathname:', window.location.pathname);
    
    // Check for React components in DOM
    const loadingElements = document.querySelectorAll('[class*="animate-spin"], [class*="loading"]');
    console.log('⏳ Loading elements found:', loadingElements.length);
    
    loadingElements.forEach((el, index) => {
        console.log(`  ${index + 1}. Element:`, el.className, el.textContent?.trim());
    });
}

// Functie om loading states te monitoren
function monitorLoadingStates() {
    console.log('👀 MONITORING LOADING STATES...');
    
    let loadingCount = 0;
    const interval = setInterval(() => {
        const loadingElements = document.querySelectorAll('[class*="animate-spin"]');
        const loadingText = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent?.includes('Laden...') || 
            el.textContent?.includes('Loading...') ||
            el.textContent?.includes('Doorverwijzen...')
        );
        
        if (loadingElements.length > 0 || loadingText) {
            loadingCount++;
            console.log(`⏳ Loading state detected (${loadingCount}x):`, {
                spinners: loadingElements.length,
                text: loadingText?.textContent?.trim()
            });
            
            if (loadingCount > 10) {
                console.warn('⚠️ Loading state lijkt vast te zitten! Probeer de pagina te verversen.');
                clearInterval(interval);
            }
        } else {
            console.log('✅ Geen loading states meer gedetecteerd');
            clearInterval(interval);
        }
    }, 1000);
    
    // Stop monitoring na 30 seconden
    setTimeout(() => {
        clearInterval(interval);
        console.log('🛑 Loading monitoring gestopt na 30 seconden');
    }, 30000);
    
    return interval;
}

// Functie om localStorage te resetten
function resetAuth() {
    console.log('🔄 RESETTING AUTH STATE...');
    localStorage.removeItem('audit_user');
    console.log('✅ localStorage gereset');
    console.log('💡 Ververs de pagina om opnieuw in te loggen');
}

// Functie om naar login te gaan
function forceLogin() {
    console.log('🚪 FORCING LOGIN REDIRECT...');
    window.location.href = '/login';
}

// Functie om direct in te loggen (voor testing)
function quickLogin(userId = 'ADMIN') {
    console.log('⚡ QUICK LOGIN:', userId);
    
    const hardcodedUsers = {
        'ADMIN': {
            id: '00000000-0000-0000-0000-000000000001',
            user_id: 'ADMIN',
            naam: 'Admin User',
            rol: 'admin',
            telefoon: '+32 123 456 789',
            actief: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        'MAN01': {
            id: '00000000-0000-0000-0000-000000000002',
            user_id: 'MAN01',
            naam: 'COO Manager',
            rol: 'coo',
            telefoon: '+32 123 456 790',
            actief: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        'MAN02': {
            id: '00000000-0000-0000-0000-000000000003',
            user_id: 'MAN02',
            naam: 'Inspector',
            rol: 'inspector',
            telefoon: '+32 123 456 791',
            actief: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        'USER1': {
            id: '00000000-0000-0000-0000-000000000004',
            user_id: 'USER1',
            naam: 'Store Manager',
            rol: 'storemanager',
            telefoon: '+32 123 456 792',
            actief: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        'DIET': {
            id: '00000000-0000-0000-0000-000000000005',
            user_id: 'DIET',
            naam: 'Dietmar Lattré',
            rol: 'developer',
            telefoon: '+32 123 456 793',
            actief: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    };
    
    const user = hardcodedUsers[userId];
    if (user) {
        localStorage.setItem('audit_user', JSON.stringify(user));
        console.log('✅ User opgeslagen in localStorage');
        console.log('🔄 Ververs de pagina om door te gaan');
    } else {
        console.error('❌ Onbekende user ID:', userId);
        console.log('📝 Beschikbare IDs:', Object.keys(hardcodedUsers));
    }
}

// Auto-run initial check
checkAuthState();

// Export functies naar window voor handmatig gebruik
window.checkAuthState = checkAuthState;
window.monitorLoadingStates = monitorLoadingStates;
window.resetAuth = resetAuth;
window.forceLogin = forceLogin;
window.quickLogin = quickLogin;

console.log('\n🛠️ Beschikbare debug functies:');
console.log('- checkAuthState(): Controleer huidige auth status');
console.log('- monitorLoadingStates(): Monitor loading states voor 30 seconden');
console.log('- resetAuth(): Reset localStorage en auth state');
console.log('- forceLogin(): Ga direct naar login pagina');
console.log('- quickLogin(userId): Log direct in met user ID (bijv. quickLogin("ADMIN"))');
console.log('\n💡 Als je vast zit in een loading loop:');
console.log('1. Probeer: resetAuth()');
console.log('2. Ververs de pagina');
console.log('3. Of gebruik: quickLogin("ADMIN") en ververs daarna');

