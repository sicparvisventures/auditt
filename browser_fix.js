// BROWSER FIX: Verwijder test opmerkingen direct in de browser
// Kopieer deze code en plak het in je browser console (F12)

console.log('🧹 Starting test opmerkingen cleanup...');

// Functie om test tekst te verwijderen
function cleanTestText(text) {
    if (!text) return '';
    
    // Verwijder verschillende varianten van test opmerkingen
    return text
        .replace(/\s*Opmerkingen:\s*test.*$/gi, '')  // "Opmerkingen: test..."
        .replace(/\s*-?\s*test opmerkingen.*$/gi, '') // "- test opmerkingen"
        .replace(/\s*test.*$/gi, '')                  // "test..."
        .replace(/^\s*test\s*$/gi, 'Actie vereist')   // Alleen "test"
        .trim();
}

// Functie om DOM elementen te updateren
function updateActionDescriptions() {
    const descriptions = document.querySelectorAll('[class*="beschrijving"], p');
    let updatedCount = 0;
    
    descriptions.forEach(element => {
        if (element.textContent && element.textContent.includes('test')) {
            const originalText = element.textContent;
            const cleanedText = cleanTestText(element.textContent);
            
            if (cleanedText !== originalText) {
                element.textContent = cleanedText;
                updatedCount++;
                console.log(`✅ Cleaned: "${originalText}" → "${cleanedText}"`);
            }
        }
    });
    
    console.log(`🎯 Updated ${updatedCount} descriptions`);
    return updatedCount;
}

// Functie om alle acties op te schonen
function cleanupAllActions() {
    console.log('🔄 Scanning for test text...');
    
    // Update zichtbare beschrijvingen
    const visibleUpdates = updateActionDescriptions();
    
    // Force page reload om database data te krijgen (als nodig)
    if (visibleUpdates > 0) {
        console.log('✨ Browser cleanup done!');
        console.log('💡 For permanent fix, run the SQL script in Supabase');
    } else {
        console.log('🔄 No visible test text found. Refreshing page...');
        setTimeout(() => {
            window.location.reload(true);
        }, 1000);
    }
}

// Run cleanup
cleanupAllActions();

// Ook beschikbaar als globale functie voor later gebruik
window.fixTestOpmerkingen = cleanupAllActions;

console.log('✅ Test cleanup loaded! Run cleanupAllActions() or call window.fixTestOpmerkingen()');

// Extra functie voor cache clear
window.clearCacheAndReload = function() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload(true);
    console.log('🧹 Cache cleared and page reloaded');
};

