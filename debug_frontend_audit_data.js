// Debug script voor frontend audit data verwerking
// Dit script kan worden uitgevoerd in de browser console om te controleren
// hoe audit data wordt verwerkt en waarom opmerkingen mogelijk niet worden getoond

console.log('=== AUDIT DATA DEBUG SCRIPT ===');

// Functie om audit data te debuggen
function debugAuditData(auditData) {
    console.log('🔍 Debugging audit data...');
    console.log('Audit ID:', auditData?.id);
    console.log('Aantal resultaten:', auditData?.resultaten?.length || 0);
    
    if (!auditData?.resultaten || auditData.resultaten.length === 0) {
        console.warn('⚠️ Geen resultaten gevonden in audit data');
        return;
    }
    
    // Controleer elke resultaat
    auditData.resultaten.forEach((result, index) => {
        console.log(`\n📋 Resultaat ${index + 1}:`);
        console.log('  ID:', result.id);
        console.log('  Checklist item:', result.checklist_item?.titel || 'ONTBREEKT');
        console.log('  Categorie:', result.checklist_item?.categorie || 'ONTBREEKT');
        console.log('  Resultaat:', result.resultaat);
        console.log('  Score:', result.score);
        
        // Check opmerkingen
        if (result.opmerkingen) {
            console.log('  ✅ Opmerkingen:', result.opmerkingen);
        } else {
            console.log('  ❌ Opmerkingen: LEEG/NULL');
        }
        
        // Check verbeterpunt
        if (result.verbeterpunt) {
            console.log('  ✅ Verbeterpunt:', result.verbeterpunt);
        } else {
            console.log('  ❌ Verbeterpunt: LEEG/NULL');
        }
        
        // Check foto's
        if (result.foto_urls && result.foto_urls.length > 0) {
            console.log('  📸 Foto\'s:', result.foto_urls.length);
        } else {
            console.log('  📸 Foto\'s: GEEN');
        }
    });
    
    // Groepeer per categorie zoals de component doet
    console.log('\n🗂️ Groepering per categorie:');
    const grouped = auditData.resultaten.reduce((acc, result) => {
        if (!result.checklist_item) {
            console.warn('⚠️ Resultaat zonder checklist_item gevonden:', result.id);
            return acc;
        }
        
        const category = result.checklist_item.categorie;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(result);
        return acc;
    }, {});
    
    Object.entries(grouped).forEach(([category, results]) => {
        console.log(`\n📁 ${category}:`);
        console.log(`   Aantal items: ${results.length}`);
        
        const withComments = results.filter(r => r.opmerkingen).length;
        const withImprovements = results.filter(r => r.verbeterpunt).length;
        
        console.log(`   Met opmerkingen: ${withComments}`);
        console.log(`   Met verbeterpunten: ${withImprovements}`);
        
        // Toon eerste paar items voor details
        results.slice(0, 3).forEach((result, idx) => {
            console.log(`   ${idx + 1}. ${result.checklist_item.titel}`);
            console.log(`      Opmerkingen: ${result.opmerkingen || '[GEEN]'}`);
            console.log(`      Verbeterpunt: ${result.verbeterpunt || '[GEEN]'}`);
        });
        
        if (results.length > 3) {
            console.log(`   ... en ${results.length - 3} meer`);
        }
    });
}

// Functie om de huidige audit data te debuggen (als deze beschikbaar is)
function debugCurrentAudit() {
    // Probeer audit data te vinden in verschillende mogelijke locaties
    const possibleSources = [
        () => window.auditData,
        () => window.__NEXT_DATA__?.props?.pageProps?.audit,
        () => document.querySelector('[data-audit]')?.dataset.audit,
    ];
    
    let auditData = null;
    
    for (const source of possibleSources) {
        try {
            const data = source();
            if (data) {
                auditData = typeof data === 'string' ? JSON.parse(data) : data;
                break;
            }
        } catch (e) {
            // Negeer fouten en probeer volgende bron
        }
    }
    
    if (auditData) {
        console.log('✅ Audit data gevonden!');
        debugAuditData(auditData);
    } else {
        console.log('❌ Geen audit data gevonden in bekende locaties');
        console.log('💡 Tip: Roep debugAuditData(yourAuditObject) aan met je audit object');
    }
}

// Functie om network requests te monitoren
function monitorAuditRequests() {
    console.log('🌐 Monitoring network requests voor audit data...');
    
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        
        if (typeof url === 'string' && (url.includes('audit') || url.includes('resultaten'))) {
            console.log('🔍 Audit-gerelateerde request gedetecteerd:', url);
            
            return originalFetch.apply(this, args).then(response => {
                const clonedResponse = response.clone();
                clonedResponse.json().then(data => {
                    console.log('📥 Response data voor', url, ':', data);
                    
                    if (data && Array.isArray(data)) {
                        console.log('📊 Aantal items in response:', data.length);
                        data.forEach((item, idx) => {
                            if (item.opmerkingen || item.verbeterpunt) {
                                console.log(`   Item ${idx}: Opmerkingen=${!!item.opmerkingen}, Verbeterpunt=${!!item.verbeterpunt}`);
                            }
                        });
                    }
                }).catch(() => {
                    console.log('⚠️ Kon response niet als JSON parsen');
                });
                
                return response;
            });
        }
        
        return originalFetch.apply(this, args);
    };
    
    console.log('✅ Network monitoring actief');
}

// Auto-run functies
debugCurrentAudit();

// Export functies voor handmatig gebruik
window.debugAuditData = debugAuditData;
window.debugCurrentAudit = debugCurrentAudit;
window.monitorAuditRequests = monitorAuditRequests;

console.log('\n🛠️ Beschikbare debug functies:');
console.log('- debugAuditData(auditObject): Debug specifieke audit data');
console.log('- debugCurrentAudit(): Zoek en debug huidige audit data');
console.log('- monitorAuditRequests(): Monitor network requests');
console.log('\n💡 Kopieer en plak dit script in de browser console op de audit detail pagina');

