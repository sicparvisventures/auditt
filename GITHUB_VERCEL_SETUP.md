# 🔐 GitHub & Vercel Setup - Stap voor Stap

## 📋 Overzicht

Deze gids helpt je om:
1. In te loggen op GitHub
2. Code naar GitHub te pushen
3. In te loggen op Vercel
4. Automatische deployment in te stellen

---

## 🔑 STAP 1: GitHub Authenticatie

### Optie A: Via Terminal (GitHub CLI - Aanbevolen)

```bash
# 1. Installeer GitHub CLI (als je die nog niet hebt)
# macOS:
brew install gh

# 2. Log in op GitHub
gh auth login

# Volg de instructies:
# - Kies: GitHub.com
# - Kies: HTTPS
# - Kies: Login with a web browser
# - Kopieer de code die wordt getoond
# - Druk op Enter
# - Je browser opent automatisch
# - Plak de code en log in
```

### Optie B: Via Terminal (Git Credentials)

```bash
# 1. Configureer git met je GitHub credentials
git config --global user.name "jouw-github-username"
git config --global user.email "jouw-email@example.com"

# 2. Voor HTTPS push (je wordt gevraagd om in te loggen):
git push origin main
# GitHub vraagt om username en Personal Access Token
```

### Optie C: Via GitHub Desktop (Visueel)

1. **Download GitHub Desktop:**
   - https://desktop.github.com/
   - Installeer en open

2. **Log in:**
   - Klik "Sign in to GitHub.com"
   - Volg de inlog instructies

3. **Add Repository:**
   - File → Add Local Repository
   - Selecteer deze map
   - Klik "Publish repository"

---

## 🚀 STAP 2: Push naar GitHub

### Via Terminal:

```bash
# 1. Check status
git status

# 2. Voeg alle bestanden toe
git add .

# 3. Maak commit
git commit -m "Initial commit: Poule & Poulette Audit Tool with backend upgrades"

# 4. Zet main branch
git branch -M main

# 5. Push naar GitHub (je wordt gevraagd om in te loggen)
git push -u origin main
```

**Als je wordt gevraagd om credentials:**
- **Username:** je GitHub username
- **Password:** gebruik een **Personal Access Token** (niet je wachtwoord!)

### Personal Access Token aanmaken:

1. **Ga naar GitHub:**
   - https://github.com/settings/tokens
   - Klik "Generate new token" → "Generate new token (classic)"

2. **Instellingen:**
   - **Note:** "Vercel Deployment"
   - **Expiration:** 90 days (of langer)
   - **Scopes:** vink aan:
     - ✅ `repo` (alle repo permissies)
     - ✅ `workflow` (voor GitHub Actions)

3. **Klik "Generate token"**
4. **Kopieer de token** (je ziet hem maar 1x!)
5. **Gebruik deze token als wachtwoord** bij git push

---

## ☁️ STAP 3: Vercel Authenticatie

### Optie A: Via Website (Aanbevolen)

1. **Ga naar Vercel:**
   - https://vercel.com/login
   - Klik "Continue with GitHub"

2. **Autoriseer Vercel:**
   - Je wordt doorgestuurd naar GitHub
   - Klik "Authorize Vercel"
   - Je wordt teruggebracht naar Vercel

3. **Je bent nu ingelogd!**

### Optie B: Via Terminal (Vercel CLI)

```bash
# 1. Installeer Vercel CLI
npm i -g vercel

# 2. Log in
vercel login

# Volg de instructies:
# - Je browser opent automatisch
# - Log in met GitHub
# - Autoriseer Vercel
```

---

## 🚀 STAP 4: Vercel Project Setup

### 4.1 Import Project

1. **Ga naar Vercel Dashboard:**
   - https://vercel.com/new

2. **Import Git Repository:**
   - Klik "Import Git Repository"
   - Selecteer `dielemar/audittool`
   - Klik "Import"

### 4.2 Configureer Project

**Project Settings:**
- **Framework Preset:** Next.js (automatisch)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### 4.3 Environment Variables

**Klik "Environment Variables" en voeg toe:**

```
NEXT_PUBLIC_SUPABASE_URL
https://kauerobifkgjvddyrkuz.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdWVyb2JpZmtnanZkZHlya3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTIxODQsImV4cCI6MjA3NDcyODE4NH0.GqMYsz9byBYHw_fqmPYH53E4fyciz3MpdUtDQDhpvd8
```

```
NEXT_PUBLIC_APP_URL
https://jouw-project.vercel.app
```

**Belangrijk:**
- Selecteer alle environments: ✅ Production, ✅ Preview, ✅ Development
- Voor `NEXT_PUBLIC_APP_URL`: vul dit in **NA** de eerste deployment met je echte Vercel URL

### 4.4 Deploy

1. **Klik "Deploy"**
2. **Wacht 2-5 minuten** tot deployment klaar is
3. **Je krijgt een URL** zoals: `https://audittool-xxx.vercel.app`

### 4.5 Update APP_URL (Na Eerste Deployment)

1. **Ga naar:** Settings → Environment Variables
2. **Update `NEXT_PUBLIC_APP_URL`:**
   - Verwijder oude waarde
   - Voeg nieuwe toe: `https://jouw-actuele-vercel-url.vercel.app`
3. **Redeploy:**
   - Ga naar Deployments tab
   - Klik op drie puntjes van laatste deployment
   - Klik "Redeploy"

---

## ✅ Automatische Deployments

Na setup zijn automatische deployments actief:

- ✅ **Push naar `main` branch** → Production deployment
- ✅ **Push naar andere branch** → Preview deployment  
- ✅ **Pull Request** → Preview deployment

**Je hoeft niets meer te doen!** Elke push triggert automatisch een deployment.

---

## 🔍 Verificatie

### Check GitHub:
1. Ga naar: https://github.com/dielemar/audittool
2. Controleer dat alle bestanden er zijn
3. Check dat `.env.local` **NIET** zichtbaar is (staat in .gitignore)

### Check Vercel:
1. Ga naar: https://vercel.com/dashboard
2. Selecteer je project
3. Check Deployments tab
4. Klik op deployment URL om te testen

---

## 🐛 Troubleshooting

### Probleem: Git push vraagt om wachtwoord

**Oplossing:**
- Gebruik **Personal Access Token** in plaats van wachtwoord
- Zie "Personal Access Token aanmaken" hierboven

### Probleem: Vercel kan repository niet vinden

**Oplossing:**
1. Check of je ingelogd bent op Vercel
2. Check of Vercel toegang heeft tot je GitHub account
3. Ga naar: https://github.com/settings/applications
4. Check of Vercel is geautoriseerd

### Probleem: Build faalt in Vercel

**Oplossing:**
1. Check build logs in Vercel dashboard
2. Test lokaal: `npm run build`
3. Check of environment variables zijn ingesteld
4. Check of alle dependencies in `package.json` staan

### Probleem: Environment variables werken niet

**Oplossing:**
1. Check of variabelen zijn ingesteld in Vercel
2. Check of `NEXT_PUBLIC_` prefix correct is
3. Redeploy na het toevoegen van variabelen
4. Check Vercel logs voor errors

---

## 📞 Hulp Nodig?

- **GitHub Docs:** https://docs.github.com
- **Vercel Docs:** https://vercel.com/docs
- **Git Authentication:** https://docs.github.com/en/authentication

---

**Status:** ✅ Gids Compleet  
**Volgende Stap:** Volg de stappen hierboven om in te loggen en te deployen

