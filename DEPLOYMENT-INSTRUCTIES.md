# Cloudflare Pages Deployment Instructies

## ✅ Build Klaar voor Upload

De `cloudflare-deployment-working.zip` (2.6MB) is klaar voor deployment op Cloudflare Pages.

**✅ Probleem opgelost**: Dit is de werkende versie die zowel het "bewaar als" als het "Laden..." probleem oplost.

## Deployment Stappen

### 1. Upload naar Cloudflare Pages

1. Ga naar [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Klik op **"Create a project"** of **"Upload assets"**
3. Upload het bestand: `cloudflare-deployment-working.zip`
4. Geef je project een naam (bijv. `poule-poulette-audit`)

### 2. Environment Variables Instellen

Na het uploaden, configureer de volgende environment variables in Cloudflare Pages:

```
NEXT_PUBLIC_SUPABASE_URL=https://kauerobifkgjvddyrkuz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdWVyb2JpZmtnanZkZHlya3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTIxODQsImV4cCI6MjA3NDcyODE4NH0.GqMYsz9byBYHw_fqmPYH53E4fyciz3MpdUtDQDhpvd8
```

**Waar vind je deze instellingen?**
- Ga naar je Cloudflare Pages project
- Klik op **"Settings"**
- Scroll naar **"Environment variables"**
- Klik op **"Add variable"** voor elke variabele

### 3. Database Setup (als nog niet gedaan)

Voer de volgende SQL scripts uit in je Supabase SQL Editor:

1. **Schema setup**: Run `supabase/COMPLETE-SETUP.sql`
2. **User IDs setup**: Run `supabase/UPDATE-USER-IDS.sql`

### 4. Test de Applicatie

Inloggegevens voor testing:

- **Admin**: `ADMIN`
- **COO**: `COO01`
- **District Managers**: `DM001`, `DM002`, `DM003`
- **Filiaal Managers**: `FM001`, `FM002`, `FM003`, `FM004`

## Build Specificaties

- **Build Grootte**: 2.6MB (onder de 25MB limiet ✅)
- **Configuratie**:
  - `_headers` ✅ (Security headers)
  - `_redirects` ✅ (SPA routing - gefixed)
  - Logo's en assets ✅
  - **Probleem opgelost**: "bewaar als" issue definitief opgelost
  - **Probleem opgelost**: "Laden..." zonder opmaak issue opgelost
  - **Dynamische routes**: Omgezet naar query parameters voor statische export
  - **CSS/JS paden**: Gecorrigeerd voor Cloudflare Pages

## Functionaliteit

De applicatie heeft alle features van de localhost versie:

- ✅ User authentication (Supabase)
- ✅ Dashboard met KPI's
- ✅ Audit management
- ✅ Action tracking
- ✅ Report generation
- ✅ Mobile responsive design
- ✅ Admin user management
- ✅ Audit deletion (admin only)
- ✅ Role-based access control

## Support

Als je problemen ondervindt:

1. Check of de environment variables correct zijn ingesteld
2. Controleer de Cloudflare Pages logs
3. Verifieer dat de Supabase database correct is opgezet
4. Test de Supabase verbinding in de browser console

## Herdeployen

Om een nieuwe versie te deployen:

```bash
# Clean en rebuild
rm -rf .next dist out node_modules/.cache

# Install dependencies
npm ci --only=production

# Build
npm run build

# Verwijder cache
rm -rf dist/cache

# Voeg configuratie toe
cp _headers dist/_headers
cp _redirects dist/_redirects
cp public/*.{png,jpg,svg,json} dist/

# Maak nieuwe zip
cd dist
zip -r ../cloudflare-deployment-working.zip . -x "*.DS_Store" "*.git*" "cache/*"
cd ..
```

Upload de nieuwe `cloudflare-deployment-working.zip` naar Cloudflare Pages.

