// EMERGENCY FIX voor "Laden..." loop
// Kopieer en plak dit in browser console (F12)

console.log('🚨 EMERGENCY LOADING FIX STARTED');

// Force stop loading state
if (window.localStorage) {
    // Clear any problematic data
    localStorage.removeItem('audit_user');
    console.log('🧹 Cleared localStorage');
}

// Add a test user to skip the loading
const testUser = {
    id: '00000000-0000-0000-0000-000000000001',
    user_id: 'ADMIN',
    naam: 'Admin User',
    rol: 'admin',
    telefoon: '+32 123 456 789',
    actief: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

localStorage.setItem('audit_user', JSON.stringify(testUser));
console.log('👤 Set test user in localStorage');

// Force refresh the page
console.log('🔄 Refreshing page in 2 seconds...');
setTimeout(() => {
    window.location.reload();
}, 2000);

console.log('✅ Fix applied! Page will refresh automatically.');

