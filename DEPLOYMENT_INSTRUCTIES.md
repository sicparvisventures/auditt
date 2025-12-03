# 🚀 Deployment Instructies - Snelle Start

## ✅ Stap 1: .env.local Bestand

Het `.env.local` bestand is al aangemaakt met alle Supabase credentials. Dit bestand wordt **NIET** naar GitHub gepusht.

## 📤 Stap 2: Push naar GitHub

### Eerste keer:

```bash
# 1. Initialiseer git (als nog niet gedaan)
git init

# 2. Voeg alle bestanden toe
git add .

# 3. Maak eerste commit
git commit -m "Initial commit: Poule & Poulette Audit Tool"

# 4. Maak repository aan op GitHub (via website of CLI)
# Ga naar: https://github.com/new

# 5. Link lokale repository met GitHub (vervang USERNAME en REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# 6. Push naar GitHub
git branch -M main
git push -u origin main
```

### Volgende keren:

```bash
# Voeg wijzigingen toe
git add .

# Commit
git commit -m "Beschrijving van wijzigingen"

# Push naar GitHub
git push origin main
```

## 🚀 Stap 3: Vercel Deployment

### Eerste keer:

1. **Ga naar Vercel:**
   - https://vercel.com/new
   - Log in met GitHub

2. **Import Project:**
   - Klik "Import Git Repository"
   - Selecteer je GitHub repository
   - Klik "Import"

3. **Configureer Environment Variables:**
   - Klik "Environment Variables"
   - Voeg toe:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://kauerobifkgjvddyrkuz.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdWVyb2JpZmtnanZkZHlya3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTIxODQsImV4cCI6MjA3NDcyODE4NH0.GqMYsz9byBYHw_fqmPYH53E4fyciz3MpdUtDQDhpvd8
     NEXT_PUBLIC_APP_URL=https://jouw-project.vercel.app
     ```
   - Selecteer alle environments (Production, Preview, Development)

4. **Deploy:**
   - Klik "Deploy"
   - Wacht tot deployment klaar is

### Automatische Deployments:

Na de eerste setup:
- ✅ Elke push naar `main` → Automatische production deployment
- ✅ Elke push naar andere branch → Automatische preview deployment
- ✅ Elke Pull Request → Automatische preview deployment

**Je hoeft niets meer te doen!** Vercel deployt automatisch bij elke push.

## 📝 Belangrijk

- ✅ `.env.local` wordt **NIET** naar GitHub gepusht (staat in `.gitignore`)
- ✅ Environment variables moeten **WEL** in Vercel worden ingesteld
- ✅ Na eerste deployment: update `NEXT_PUBLIC_APP_URL` met je echte Vercel URL

## 🔍 Verificatie

Na deployment:
1. Check Vercel dashboard voor deployment status
2. Open je deployment URL
3. Test de applicatie
4. Check browser console voor errors

---

**Zie `VERCEL_DEPLOYMENT_GIDS.md` voor uitgebreide instructies.**

