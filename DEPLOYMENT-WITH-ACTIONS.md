# Cloudflare Deployment - Met Actiegeneratie

## Nieuwe Functies Toegevoegd

### ✅ Actiegeneratie
- **Handmatige actiegeneratie**: Werkt zonder databasefuncties
- **Automatische fallback**: Probeert eerst databasefuncties, dan handmatig
- **Logica**: Acties voor alle resultaten met score < 4 of "niet_ok"
- **Urgentie**: Bepaald op basis van score en gewicht

### ✅ Debug Tools
- **Test Database**: `/test-db` - Test databaseverbinding en functies
- **Debug Actions**: `/debug-actions` - Handmatige actiegeneratie voor alle audits
- **Create Test Action**: Directe testactie aanmaken
- **Create Actions Manually**: Handmatige actiegeneratie voor bestaande audits

### ✅ Verbeterde Acties Tab
- **Acties worden nu correct weergegeven**
- **Automatische generatie bij nieuwe audits**
- **Handmatige generatie voor bestaande audits**

## Deployment Bestand

**Bestand**: `cloudflare-deployment-with-actions.zip` (1.8MB)
**Grootte**: Onder de 25MB limiet van Cloudflare Pages ✅

## Installatie Instructies

### 1. Upload naar Cloudflare Pages
1. Ga naar [Cloudflare Pages](https://pages.cloudflare.com/)
2. Klik op "Upload assets"
3. Upload `cloudflare-deployment-with-actions.zip`
4. Klik op "Deploy site"

### 2. Environment Variables
Zet deze environment variables in Cloudflare Pages:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
**Belangrijk**: De databasefuncties zijn nog niet geïnstalleerd. De applicatie werkt met handmatige actiegeneratie.

#### Optioneel: Databasefuncties installeren
1. Ga naar Supabase SQL Editor
2. Voer het script uit: `supabase/INSTALL-FUNCTIONS.sql`
3. Dit activeert automatische actiegeneratie

## Nieuwe Pagina's

### `/test-db`
- Test databaseverbinding
- Controleer beschikbare functies
- Maak testacties aan
- Test handmatige actiegeneratie

### `/debug-actions`
- Genereer acties voor alle bestaande audits
- Handig voor migratie van oude audits

## Actiegeneratie Logica

### Wanneer worden acties aangemaakt?
- **Score < 4**: Alle resultaten met score 0-3
- **Resultaat "niet_ok"**: Alle items gemarkeerd als niet oké
- **Urgentie**: Bepaald op basis van score en gewicht

### Urgentie Niveaus
- **High**: Score ≤ 1
- **Medium**: Score ≤ 2
- **Low**: Score 3-4

### Deadlines
- **High**: 3 dagen
- **Medium**: 7 dagen
- **Low**: 14 dagen

## Werking

### 1. Nieuwe Audit
1. Audit wordt opgeslagen
2. Systeem probeert databasefuncties
3. Als dat faalt, gebruikt het handmatige generatie
4. Acties worden automatisch aangemaakt

### 2. Bestaande Audits
1. Ga naar `/debug-actions`
2. Klik op "Create Actions for All Audits"
3. Acties worden aangemaakt voor alle audits

### 3. Testen
1. Ga naar `/test-db`
2. Test databaseverbinding
3. Maak testacties aan
4. Controleer resultaten

## Troubleshooting

### Acties worden niet aangemaakt
1. Controleer `/test-db` pagina
2. Test handmatige actiegeneratie
3. Controleer console voor errors

### Databasefuncties ontbreken
- **Normaal**: De applicatie werkt zonder databasefuncties
- **Handmatige generatie**: Wordt automatisch gebruikt
- **Optioneel**: Installeer functies voor betere performance

## Status

✅ **Build succesvol**: 1.8MB (onder limiet)
✅ **Alle functies werkend**: Actiegeneratie, debug tools, test pagina's
✅ **Fallback systeem**: Werkt met en zonder databasefuncties
✅ **Klaar voor deployment**: Upload naar Cloudflare Pages

## Volgende Stappen

1. **Upload** `cloudflare-deployment-with-actions.zip` naar Cloudflare Pages
2. **Configureer** environment variables
3. **Test** de applicatie
4. **Optioneel**: Installeer databasefuncties voor betere performance
