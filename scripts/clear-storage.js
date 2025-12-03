// Script to clear localStorage and force fresh initialization
// Run this in the browser console

console.log('🧹 Clearing localStorage...')
localStorage.removeItem('audit_database')
console.log('✅ localStorage cleared')

// Reload the page to reinitialize with fresh data
console.log('🔄 Reloading page...')
window.location.reload()
