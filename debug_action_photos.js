// Debug script voor actie foto problemen
// Kopieer en plak dit in browser console (F12) op de acties detail pagina

console.log('🔍 ACTION PHOTOS DEBUG SCRIPT STARTED');

// Functie om alle afbeeldingen op de pagina te controleren
function checkAllImages() {
    console.log('=== CHECKING ALL IMAGES ON PAGE ===');
    
    const images = document.querySelectorAll('img');
    console.log(`Found ${images.length} images on page`);
    
    images.forEach((img, index) => {
        const src = img.src;
        const alt = img.alt;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        
        console.log(`Image ${index + 1}:`, {
            src: src.substring(0, 100) + (src.length > 100 ? '...' : ''),
            alt: alt,
            loaded: naturalWidth > 0 && naturalHeight > 0,
            dimensions: `${naturalWidth}x${naturalHeight}`,
            complete: img.complete
        });
        
        // Check if image failed to load
        if (img.complete && naturalWidth === 0) {
            console.warn(`❌ Image ${index + 1} failed to load:`, src);
        }
    });
}

// Functie om actie data te controleren
function checkActionData() {
    console.log('=== CHECKING ACTION DATA ===');
    
    // Probeer actie data te vinden
    const actionData = window.actionData || 
                      window.__NEXT_DATA__?.props?.pageProps?.action ||
                      null;
    
    if (actionData) {
        console.log('✅ Action data found:', {
            id: actionData.id,
            titel: actionData.titel,
            foto_urls: actionData.foto_urls,
            foto_count: actionData.foto_urls?.length || 0
        });
        
        if (actionData.foto_urls && actionData.foto_urls.length > 0) {
            console.log('📸 Photo URLs:');
            actionData.foto_urls.forEach((url, index) => {
                console.log(`  ${index + 1}. ${url.substring(0, 100)}${url.length > 100 ? '...' : ''}`);
                
                // Test if URL is accessible
                testImageUrl(url, index + 1);
            });
        } else {
            console.log('📷 No photos found in action data');
        }
    } else {
        console.log('❌ No action data found');
    }
}

// Functie om een specifieke image URL te testen
function testImageUrl(url, index) {
    const img = new Image();
    img.onload = () => {
        console.log(`✅ Photo ${index} loaded successfully:`, {
            url: url.substring(0, 50) + '...',
            dimensions: `${img.width}x${img.height}`
        });
    };
    img.onerror = () => {
        console.error(`❌ Photo ${index} failed to load:`, {
            url: url.substring(0, 50) + '...',
            error: 'Image load error'
        });
    };
    img.src = url;
}

// Functie om foto upload te simuleren (voor testing)
function simulatePhotoUpload() {
    console.log('=== SIMULATING PHOTO UPLOAD ===');
    
    // Create a test data URL
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple test image
    ctx.fillStyle = '#4F46E5';
    ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Test Actie Foto', 200, 150);
    
    const dataUrl = canvas.toDataURL('image/png');
    console.log('📸 Generated test photo data URL:', dataUrl.substring(0, 100) + '...');
    
    return dataUrl;
}

// Functie om foto weergave problemen op te lossen
function fixPhotoDisplay() {
    console.log('=== ATTEMPTING TO FIX PHOTO DISPLAY ===');
    
    const images = document.querySelectorAll('img[alt*="Actie foto"]');
    console.log(`Found ${images.length} action photos to fix`);
    
    images.forEach((img, index) => {
        if (img.naturalWidth === 0 && img.complete) {
            console.log(`🔧 Fixing broken image ${index + 1}`);
            
            // Replace with a working fallback
            const fallbackSvg = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGNpcmNsZSBjeD0iNTAlIiBjeT0iNDAlIiByPSIyMCIgZmlsbD0iIzk3YTNiMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2OTczODMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFjdGllIEZvdG8gJHtpbmRleCArIDF9PC90ZXh0Pjwvc3ZnPg==`;
            img.src = fallbackSvg;
        }
    });
}

// Functie om localStorage te controleren voor foto data
function checkLocalStorage() {
    console.log('=== CHECKING LOCALSTORAGE FOR PHOTO DATA ===');
    
    const keys = Object.keys(localStorage);
    const photoKeys = keys.filter(key => 
        key.includes('photo') || 
        key.includes('image') || 
        key.includes('actie') ||
        key.includes('foto')
    );
    
    console.log('Photo-related localStorage keys:', photoKeys);
    
    photoKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value?.substring(0, 100) + (value && value.length > 100 ? '...' : ''));
    });
}

// Auto-run functies
checkAllImages();
checkActionData();
checkLocalStorage();

// Export functies voor handmatig gebruik
window.checkAllImages = checkAllImages;
window.checkActionData = checkActionData;
window.testImageUrl = testImageUrl;
window.simulatePhotoUpload = simulatePhotoUpload;
window.fixPhotoDisplay = fixPhotoDisplay;
window.checkLocalStorage = checkLocalStorage;

console.log('\n🛠️ Beschikbare debug functies:');
console.log('- checkAllImages(): Controleer alle afbeeldingen op de pagina');
console.log('- checkActionData(): Controleer actie data en foto URLs');
console.log('- testImageUrl(url, index): Test een specifieke foto URL');
console.log('- simulatePhotoUpload(): Genereer een test foto');
console.log('- fixPhotoDisplay(): Probeer gebroken foto\'s te repareren');
console.log('- checkLocalStorage(): Controleer localStorage voor foto data');
console.log('\n💡 Als je blauwe vraagtekens ziet:');
console.log('1. Voer fixPhotoDisplay() uit');
console.log('2. Controleer de console voor error messages');
console.log('3. Test foto upload met simulatePhotoUpload()');

