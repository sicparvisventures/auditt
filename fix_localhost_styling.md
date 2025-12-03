# Fix voor Localhost Styling Probleem

## Probleem
Localhost toont "laden" zonder opmaak/styling, wat betekent dat CSS niet wordt geladen of de development server niet correct draait.

## Mogelijke Oorzaken

### 1. Development Server Issues
- Next.js dev server draait niet correct
- Poort conflicten (3000 is al in gebruik)
- Build cache problemen

### 2. CSS Loading Issues
- Tailwind CSS wordt niet gecompileerd
- Globals.css wordt niet geladen
- PostCSS configuratie problemen

### 3. Browser Cache Issues
- Oude cached bestanden
- Service worker problemen

## Oplossingen

### Stap 1: Development Server Opnieuw Starten

```bash
# Stop alle lopende processen
pkill -f "next"

# Ga naar project directory
cd "/Users/dietmar/Desktop/pp ops -- intern audit"

# Clear Next.js cache
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies (als nodig)
npm install

# Start development server
npm run dev
```

### Stap 2: Browser Cache Legen

1. **Chrome/Safari:**
   - Druk `Cmd+Shift+R` (hard refresh)
   - Of ga naar Developer Tools → Network → "Disable cache"
   - Of `Cmd+Option+I` → Application → Storage → "Clear site data"

2. **Firefox:**
   - Druk `Cmd+Shift+R`
   - Of ga naar Developer Tools → Network → "Disable cache"

### Stap 3: Controleer of Server Draait

1. Open terminal en voer uit:
```bash
lsof -i :3000
```

2. Als er geen output is, start de server:
```bash
npm run dev
```

3. Ga naar `http://localhost:3000` in browser

### Stap 4: CSS Debug

Als styling nog steeds niet werkt, controleer in browser Developer Tools:

1. **Network tab:**
   - Zoek naar `globals.css` of `*.css` bestanden
   - Controleer of ze 200 status hebben
   - Rood = niet geladen

2. **Console tab:**
   - Zoek naar CSS/styling gerelateerde errors
   - MIME type warnings
   - 404 errors voor CSS bestanden

### Stap 5: Handmatige Fix

Als automatische oplossing niet werkt:

```bash
# 1. Stop alle Next.js processen
pkill -f "next"

# 2. Verwijder build artifacts
rm -rf .next
rm -rf dist
rm -rf node_modules/.cache

# 3. Herinstalleer dependencies
rm -rf node_modules
npm install

# 4. Rebuild Tailwind CSS
npx tailwindcss build -i ./app/globals.css -o ./public/styles.css

# 5. Start development server
npm run dev -- --port 3001  # Gebruik andere poort als 3000 bezet is
```

## Debug Script

Kopieer dit in browser console om styling problemen te debuggen:

```javascript
// Check if CSS is loaded
console.log('=== CSS DEBUG ===');
console.log('Stylesheets loaded:', document.styleSheets.length);

// List all loaded stylesheets
for (let i = 0; i < document.styleSheets.length; i++) {
  console.log(`Stylesheet ${i}:`, document.styleSheets[i].href);
}

// Check if Tailwind classes exist
const testElement = document.createElement('div');
testElement.className = 'bg-ppwhite text-olive';
document.body.appendChild(testElement);

const computedStyle = window.getComputedStyle(testElement);
console.log('Background color:', computedStyle.backgroundColor);
console.log('Text color:', computedStyle.color);

document.body.removeChild(testElement);

// Check if custom CSS variables are loaded
console.log('CSS Variables:');
console.log('--ppwhite:', getComputedStyle(document.documentElement).getPropertyValue('--ppwhite'));
console.log('--olive:', getComputedStyle(document.documentElement).getPropertyValue('--olive'));
```

## Verwachte Resultaten

Na de fix zou je moeten zien:
- ✅ Mooie styling met Poule & Poulette kleuren
- ✅ Correct geladen fonts (Lino Stamp, BentonSans)
- ✅ Werkende Tailwind CSS classes
- ✅ Geen "laden" tekst meer zonder styling

## Als Probleem Blijft Bestaan

### Optie 1: Gebruik andere poort
```bash
npm run dev -- --port 3001
```
Dan ga naar `http://localhost:3001`

### Optie 2: Production build lokaal draaien
```bash
npm run build
npm start
```
Dan ga naar `http://localhost:3000`

### Optie 3: Static export gebruiken
```bash
npm run build:static
# Open dist/index.html in browser
```

## Preventie

Om dit probleem te voorkomen:
1. Stop altijd dev server correct met `Ctrl+C`
2. Clear cache regelmatig: `rm -rf .next`
3. Gebruik consistente poorten
4. Check of andere Next.js projecten draaien op poort 3000

## Snelle Test

Voer dit uit om snel te testen:
```bash
curl -I http://localhost:3000
```

Verwachte output:
```
HTTP/1.1 200 OK
Content-Type: text/html
```

Als je `Connection refused` krijgt, draait de server niet.

