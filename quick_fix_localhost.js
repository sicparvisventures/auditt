// Quick fix script voor localhost loading issues
// Dit script kan je draaien om snel debugging te doen

console.log('🔧 DEBUGGING LOCALHOST LOADING ISSUES');

// 1. Check URL and current state
console.log('Current URL:', window.location.href);
console.log('Current Page:', window.location.pathname);

// 2. Check localStorage for auth issues
try {
  const authData = localStorage.getItem('audit_user');
  console.log('Stored auth data:', authData ? JSON.parse(authData) : 'None');
} catch (e) {
  console.log('Error reading auth data:', e);
}

// 3. Check for infinite loops or stuck components
console.log('DOM ready state:', document.readyState);

// 4. Force clear any loading states (if accessible)
if (window.clearLocalStorage && typeof window.clearLocalStorage === 'function') {
  console.log('Clearing localStorage and reloading...');
  window.clearLocalStorage();
  setTimeout(() => {
    window.location.reload(true);
  }, 500);
}

// 5. Check for React errors in console
console.log('Checking for React errors - look in browser console');

// 6. Quick auth state reset
try {
  console.log('Resetting auth state...');
  localStorage.removeItem('audit_user');
  localStorage.removeItem('audit_temp_data');
  sessionStorage.clear();
  
  console.log('✅ Auth state cleared');
  console.log('🔄 Reloading page in 2 seconds...');
  
  setTimeout(() => {
    window.location.reload(true);
  }, 2000);
  
} catch (error) {
  console.log('❌ Error clearing auth:', error);
}

console.log('=== DEBUG COMPLETE ===');
console.log('Waited tot page load complete?'); 

// 7. Force navigation if needed
setTimeout(() => {
  if (window.location.pathname === '/') {
    console.log('🌐 On homepage, forcing navigation...');
    // Try to navigate to login or dashboard
    window.location.href = '/login';
  }
}, 5000);

