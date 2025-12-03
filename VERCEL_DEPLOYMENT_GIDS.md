# 🚀 Vercel Deployment Gids

## 📋 Overzicht

Deze gids beschrijft hoe je het project naar GitHub pusht en Vercel automatisch een deployment maakt.

---

## 🔑 Stap 1: Environment Variables Setup

### Lokaal (.env.local)

Het `.env.local` bestand is al aangemaakt met de Supabase credentials. Dit bestand wordt **NIET** naar GitHub gepusht (staat in `.gitignore`).

### Vercel Environment Variables

Je moet de environment variables ook in Vercel instellen:

1. **Ga naar Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecteer je project (of maak een nieuw project aan)

2. **Ga naar Settings → Environment Variables**

3. **Voeg de volgende variabelen toe:**

```
NEXT_PUBLIC_SUPABASE_URL=https://kauerobifkgjvddyrkuz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdWVyb2JpZmtnanZkZHlya3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTIxODQsImV4cCI6MjA3NDcyODE4NH0.GqMYsz9byBYHw_fqmPYH53E4fyciz3MpdUtDQDhpvd8
NEXT_PUBLIC_APP_URL=https://jouw-project.vercel.app
```

**Belangrijk:**
- Zet `NEXT_PUBLIC_APP_URL` naar je Vercel deployment URL
- Selecteer alle environments (Production, Preview, Development)

---

## 📤 Stap 2: GitHub Repository Setup

### 2.1 Initialiseer Git (als nog niet gedaan)

```bash
# Check of git al geïnitialiseerd is
git status

# Als niet, initialiseer git
git init
```

### 2.2 Maak .gitignore aan

Het `.gitignore` bestand is al aangemaakt en bevat:
- `.env*.local` - Environment files worden niet gepusht
- `node_modules/` - Dependencies
- `.next/` - Next.js build files
- `dist/` - Build output

### 2.3 Voeg alle bestanden toe

```bash
# Voeg alle bestanden toe (behalve die in .gitignore)
git add .

# Check wat er wordt toegevoegd
git status
```

### 2.4 Maak eerste commit

```bash
git commit -m "Initial commit: Poule & Poulette Audit Tool with backend upgrades"
```

---

## 🔗 Stap 3: GitHub Repository Aanmaken

### 3.1 Maak repository aan op GitHub

1. **Ga naar GitHub:**
   - https://github.com/new
   - Of gebruik GitHub CLI: `gh repo create`

2. **Repository instellingen:**
   - **Name:** `pp-audit-tool` (of een andere naam)
   - **Description:** Poule & Poulette Internal Audit Tool
   - **Visibility:** Private (aanbevolen) of Public
   - **DON'T** initialiseer met README, .gitignore, of license (we hebben die al)

3. **Klik "Create repository"**

### 3.2 Link lokale repository met GitHub

```bash
# Voeg remote repository toe (vervang USERNAME en REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Of met SSH:
# git remote add origin git@github.com:USERNAME/REPO_NAME.git

# Verifieer remote
git remote -v
```

### 3.3 Push naar GitHub

```bash
# Push naar main branch
git branch -M main
git push -u origin main

# Als je al een main branch hebt:
git push -u origin main
```

---

## 🚀 Stap 4: Vercel Deployment Setup

### 4.1 Import Project in Vercel

1. **Ga naar Vercel Dashboard:**
   - https://vercel.com/new

2. **Import Git Repository:**
   - Klik "Import Git Repository"
   - Selecteer je GitHub repository
   - Klik "Import"

### 4.2 Configureer Project

**Project Settings:**
- **Framework Preset:** Next.js (automatisch gedetecteerd)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

**Environment Variables:**
- Zorg dat alle environment variables zijn ingesteld (zie Stap 1)

### 4.3 Deploy

1. **Klik "Deploy"**
2. **Wacht tot deployment klaar is** (ongeveer 2-5 minuten)
3. **Je krijgt een deployment URL** zoals: `https://jouw-project.vercel.app`

---

## 🔄 Stap 5: Automatische Deployments

### Automatische Deployments zijn nu actief!

**Hoe het werkt:**
- Elke push naar `main` branch → **Production deployment**
- Elke push naar andere branches → **Preview deployment**
- Elke Pull Request → **Preview deployment**

### Test Automatische Deployment

```bash
# Maak een kleine wijziging
echo "# Test" >> README.md

# Commit en push
git add README.md
git commit -m "Test automatic deployment"
git push origin main

# Check Vercel dashboard - er zou automatisch een nieuwe deployment moeten starten
```

---

## 📝 Stap 6: Update Environment Variables in Vercel

Na de eerste deployment:

1. **Ga naar Vercel Dashboard → Project → Settings → Environment Variables**

2. **Update `NEXT_PUBLIC_APP_URL`:**
   ```
   NEXT_PUBLIC_APP_URL=https://jouw-actuele-vercel-url.vercel.app
   ```

3. **Redeploy:**
   - Ga naar Deployments tab
   - Klik op de drie puntjes van de laatste deployment
   - Klik "Redeploy"

---

## ✅ Verificatie Checklist

- [ ] `.env.local` bestaat lokaal (niet gepusht naar GitHub)
- [ ] `.gitignore` bevat `.env*.local`
- [ ] Git repository is geïnitialiseerd
- [ ] Code is gecommit
- [ ] Repository is aangemaakt op GitHub
- [ ] Code is gepusht naar GitHub
- [ ] Project is geïmporteerd in Vercel
- [ ] Environment variables zijn ingesteld in Vercel
- [ ] Eerste deployment is succesvol
- [ ] Automatische deployments werken

---

## 🐛 Troubleshooting

### Probleem: Environment variables werken niet in Vercel

**Oplossing:**
1. Check of variabelen zijn ingesteld in Vercel
2. Check of `NEXT_PUBLIC_` prefix correct is
3. Redeploy na het toevoegen van variabelen
4. Check Vercel logs voor errors

### Probleem: Build faalt in Vercel

**Oplossing:**
1. Check build logs in Vercel dashboard
2. Test lokaal: `npm run build`
3. Check of alle dependencies in `package.json` staan
4. Check Node.js versie (Vercel gebruikt Node 18+)

### Probleem: Supabase connectie werkt niet

**Oplossing:**
1. Check of Supabase URL en key correct zijn
2. Check Supabase dashboard voor CORS instellingen
3. Voeg je Vercel URL toe aan Supabase allowed origins
4. Check browser console voor errors

### Probleem: .env.local wordt gepusht naar GitHub

**Oplossing:**
1. Check `.gitignore` bevat `.env*.local`
2. Verwijder uit git: `git rm --cached .env.local`
3. Commit: `git commit -m "Remove .env.local from git"`
4. Push: `git push`

---

## 📚 Handige Commands

```bash
# Check git status
git status

# Check remote repository
git remote -v

# Pull laatste wijzigingen
git pull origin main

# Push naar GitHub
git push origin main

# Check Vercel CLI (optioneel)
npm i -g vercel
vercel login
vercel
```

---

## 🔒 Security Best Practices

1. **✅ .env.local staat in .gitignore** - Geen credentials in GitHub
2. **✅ Environment variables in Vercel** - Veilig opgeslagen
3. **✅ Gebruik NEXT_PUBLIC_ prefix** - Alleen publieke variabelen
4. **⚠️ Service Role Key** - Gebruik alleen in server-side code (niet in client)

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs

---

**Status:** ✅ Gids Compleet  
**Datum:** 2025-01-08

