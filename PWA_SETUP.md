# PWA Setup voor iPhone Homescreen Icoon

## 🎯 Doel
Zorgen dat wanneer de gebruiker de app aan hun iPhone homescreen toevoegt:
- ✅ **Icoon:** `kipje.png` in plaats van de grote letter "P"
- ✅ **Naam:** "P&P Audit" 
- ✅ **Appeling:** Zoals een native app

## 📁 Bestanden Geconfigureerd

### **1. `/public/manifest.json`**
```json
{
  "name": "P&P Audit",
  "short_name": "P&P Audit", 
  "description": "Poule Poulette Audit Tool",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4F46E5",
  "icons": [
    {
      "src": "/kipje.png",
      "sizes": "192x192", 
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### **2. `/app/layout.tsx`**
```typescript
export const metadata: Metadata = {
  title: 'P&P Audit',
  description: 'Interne audit tool voor district managers van Poule & Poulette filialen',
  manifest: '/manifest.json',
  icons: {
    icon: '/kipje.png',
    apple: '/kipje.png', 
    shortcut: '/kipje.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'P&P Audit',
  },
  formatDetection: {
    telephone: false,
  },
}
```

## 🚀 Werking

### **Voor iOS Safari:**
1. **Web App Manifest** → Vertelt browser wat de app naam en icon is
2. **Apple meta tags** → Specifiek voor iOS Safari
3. **Touch icons** → Voor thuis scherm koppeling

### **Voor Android:**
1. **Manifest icons** → Voor Android home screen
2. **Theme colors** → Status bar en splash screen matching

## 📱 Testen

### **Op iPhone:**
1. Open app in **Safari**
2. Tik **Share** knop (vierkant met pijl)
3. Selecteer **"Toevoegen aan beginscherm"**
4. Kies naam (standaard "P&P Audit")
5. Tik **"Toevoegen"**

### **Verwacht Resultaat:**
- 🎯 **Icoon:** kipje.png (niet grote "P")
- 🎯 **Naam:** P&P Audit
- 🎯 **Standalone:** Opens zonder browser UI
- 🎯 **App-like:** Voelt als native app

### **Op Android:**
1. Open app in **Chrome**
2. Menu → **"Toevoegen aan beginscherm"**
3. Same result als iPhone

## 🔧 Technische Details

### **Icon Requirements:**
- **Bestandsnaam:** `/public/kipje.png`
- **Formaat:** PNG
- **Formaten:** 
  - 192x192px (standard)
  - 512x512px (high-res)
- **Purpose:** `any maskable` (aanpasbaar voor verschillende vormen)

### **Apple Specific Meta Tags:**
- **`apple-touch-icon`** → Voor safari bookmark
- **`apple-web-app-capable`** → Standalone mode
- **`apple-web-app-status-bar-style`** → Status bar styling
- **`apple-web-app-title`** → App titel

### **PWA Features Enabled:**
- ✅ **Manifest** → App configuratie
- ✅ **Service Worker** → Caching en offline (optioneel)
- ✅ **Responsive** → Werkt op alle scherm sizes
- ✅ **Secure Context** → HTTPS vereist voor PWA

## 📋 Checklist

### **Voor Productie:**
- [ ] `/public/kipje.png` bestaat en is goed geoptimaliseerd
- [ ] App draait over HTTPS 
- [ ] Manifest validatie door tools zoals lighthouse
- [ ] Thema kleuren matchen met brand guidelines
- [ ] App titels zijn consistent in alle meta tags

### **Voor Debugging:**
- Safari → **Developer** → **Service Workers** om manifest te controleren
- Chrome → **DevTools** → **Application** → **Manifest** voor validatie
- Lighthouse audit voor PWA score

Het resultaat zou moeten zijn dat gebruikers de kipje.png als icoon zien wanneer ze de app aan hun homescreen toevoegen! 🐔📱✅

