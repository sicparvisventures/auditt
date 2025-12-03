# Loading Spinner Update: Pootje.png

## Probleem Opgelost
De loading spinner (cirkel die draait bij "Laden...") is vervangen door een `pootje.png` afbeelding voor een meer merkspecifieke ervaring.

## Wijzigingen Geïmplementeerd

### 1. LoadingSpinner Component (`components/ui/LoadingSpinner.tsx`)

**Voor:**
```typescript
import { Loader2 } from 'lucide-react'

// Gebruikte Loader2 icoon
<Loader2 className={`${sizes[size]} animate-spin text-olive`} />
```

**Na:**
```typescript
import Image from 'next/image'

// Gebruikt pootje.png afbeelding
<div className="animate-spin">
  <Image
    src="/pootje.png"
    alt="Laden..."
    width={currentSize.width}
    height={currentSize.height}
    className="object-contain"
    priority
  />
</div>
```

### 2. Login Pagina (`app/login/page.tsx`)

**Voor:**
```typescript
import { Loader2, Building2 } from 'lucide-react'

// Gebruikte Loader2 in login button
<Loader2 className="w-4 h-4 mr-2 animate-spin" />
```

**Na:**
```typescript
import { Building2 } from 'lucide-react'
import Image from 'next/image'

// Gebruikt pootje.png in login button
<div className="animate-spin mr-2">
  <Image
    src="/pootje.png"
    alt="Laden..."
    width={16}
    height={16}
    className="object-contain"
  />
</div>
```

## Technische Details

### Afbeelding Locatie
- **Bestand:** `/public/pootje.png`
- **Toegankelijk via:** `/pootje.png` (Next.js public folder)

### Responsive Sizes
De LoadingSpinner ondersteunt verschillende groottes:
```typescript
const sizes = {
  sm: { width: 16, height: 16 },   // Klein (16x16px)
  md: { width: 32, height: 32 },   // Medium (32x32px) - standaard
  lg: { width: 48, height: 48 }    // Groot (48x48px)
}
```

### Animatie
- **CSS Class:** `animate-spin` (Tailwind CSS)
- **Effect:** Continue 360° rotatie
- **Duration:** Standaard Tailwind timing (1s per rotatie)

### Next.js Image Optimalisatie
```typescript
<Image
  src="/pootje.png"
  alt="Laden..."
  width={currentSize.width}
  height={currentSize.height}
  className="object-contain"
  priority  // Laadt afbeelding met hoge prioriteit
/>
```

## Waar de Nieuwe Loading Spinner Verschijnt

### 1. Pagina Navigatie
- **Wanneer:** Switchen tussen pagina's
- **Locatie:** Centraal op scherm met "Laden..." tekst
- **Component:** `LoadingSpinner` (md size)

### 2. Login Proces
- **Wanneer:** Tijdens inloggen
- **Locatie:** In login button naast "Inloggen..." tekst
- **Component:** Inline image (sm size - 16x16px)

### 3. Andere Loading States
Alle componenten die `LoadingSpinner` gebruiken tonen nu automatisch de pootje.png:
- Audit detail loading
- Acties loading
- Rapporten loading
- Dashboard loading

## Voordelen van de Update

### 1. Merkspecifieke Ervaring
- ✅ **Consistent branding** met Poule & Poulette thema
- ✅ **Unieke loading indicator** in plaats van generieke cirkel
- ✅ **Professionele uitstraling** met merkherkenning

### 2. Technische Voordelen
- ✅ **Next.js Image optimalisatie** voor betere performance
- ✅ **Responsive sizing** voor verschillende use cases
- ✅ **Priority loading** voor snelle weergave
- ✅ **Consistent implementatie** in alle componenten

### 3. Gebruikerservaring
- ✅ **Herkenbare loading indicator** 
- ✅ **Smooth animatie** met CSS transforms
- ✅ **Consistente ervaring** door hele app
- ✅ **Merkherkenning** tijdens wachttijden

## Browser Compatibiliteit
- ✅ **CSS animate-spin** wordt ondersteund door alle moderne browsers
- ✅ **Next.js Image** component werkt in alle ondersteunde browsers
- ✅ **PNG afbeelding** heeft universele ondersteuning

## Performance Impact
- ✅ **Minimaal:** Kleine PNG afbeelding (pootje.png)
- ✅ **Geoptimaliseerd:** Next.js Image component
- ✅ **Gecached:** Afbeelding wordt gecached na eerste load
- ✅ **Priority loading:** Snelle weergave bij eerste gebruik

## Testing

### Test Scenario's:
1. **Pagina navigatie** → Ga van dashboard naar audits → Zie pootje.png draaien
2. **Login proces** → Klik inloggen → Zie pootje.png in button
3. **Verschillende sizes** → Test sm/md/lg sizes in verschillende componenten
4. **Mobile responsive** → Test op verschillende schermgroottes

### Verwachte Resultaten:
- ✅ **Pootje.png draait** in plaats van generieke cirkel
- ✅ **Smooth animatie** zonder hapering
- ✅ **Juiste sizing** voor verschillende use cases
- ✅ **Consistente weergave** in alle browsers

## Fallback Behavior
Als `pootje.png` niet kan worden geladen:
- **Next.js Image** toont alt text ("Laden...")
- **Browser** toont standaard broken image indicator
- **Functionaliteit** blijft werken (alleen visueel verschil)

## Toekomstige Uitbreidingen
Mogelijke verbeteringen:
- **Verschillende animaties** (bounce, pulse, etc.)
- **Thema-specifieke loading indicators** per seizoen
- **Geanimeerde GIF** versie van pootje
- **Loading progress indicators** met pootje thema

Het resultaat is een merkspecifieke loading ervaring die perfect past bij de Poule & Poulette branding!

