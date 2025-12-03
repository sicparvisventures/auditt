# 🚀 Complete Deployment Instructies

## 📋 Repository Info
- **GitHub:** https://github.com/sicparvisventures/auditt.git
- **Status:** Leeg repository, klaar voor eerste push

---

## 🔐 STAP 1: GitHub Authenticatie & Push

### Optie A: Via Terminal (Aanbevolen)

**1. Maak een Personal Access Token:**
- Ga naar: https://github.com/settings/tokens
- Klik "Generate new token" → "Generate new token (classic)"
- **Name:** "Vercel Deployment"
- **Expiration:** 90 days (of langer)
- **Scopes:** Selecteer:
  - ✅ `repo` (alle repo permissies)
  - ✅ `workflow` (voor GitHub Actions)
- Klik "Generate token"
- **KOPIEER DE TOKEN** (je ziet hem maar 1x!)

**2. Push naar GitHub:**

Open terminal in deze map en run:

```bash
# Check status
git status

# Voeg alle bestanden toe
git add .

# Maak commit
git commit -m "Initial commit: Poule & Poulette Audit Tool with backend upgrades"

# Zet main branch
git branch -M main

# Push naar GitHub
git push -u origin main
```

**Bij authenticatie:**
- **Username:** `sicparvisventures` (of je GitHub username)
- **Password:** **Plak je Personal Access Token** (niet je wachtwoord!)

### Optie B: Via GitHub Desktop

1. **Download GitHub Desktop:**
   - https://desktop.github.com/

2. **Log in:**
   - Open GitHub Desktop
   - File → Options → Accounts
   - Klik "Sign in to GitHub.com"
   - Volg de inlog instructies

3. **Add Repository:**
   - File → Add Local Repository
   - Selecteer deze map: `/Users/dietmar/Desktop/Bureaublad - MacBook Air van Dietmar/pp intern audit 2 saas mod/pp ops -- intern audit - BACKUP 20251008_183638`
   - Klik "Add Repository"

4. **Publish Repository:**
   - Klik "Publish repository"
   - Repository name: `auditt`
   - Owner: `sicparvisventures`
   - ✅ Keep this code private (optioneel)
   - Klik "Publish Repository"

---

## ☁️ STAP 2: Vercel Authenticatie & Setup

### 2.1 Log in op Vercel

**Via Website (Aanbevolen):**

1. **Ga naar Vercel:**
   - https://vercel.com/login

2. **Log in met GitHub:**
   - Klik "Continue with GitHub"
   - Je wordt doorgestuurd naar GitHub
   - Klik "Authorize Vercel"
   - Je wordt teruggebracht naar Vercel

**Je bent nu ingelogd!**

### 2.2 Import Project

1. **Ga naar Vercel Dashboard:**
   - https://vercel.com/new

2. **Import Git Repository:**
   - Klik "Import Git Repository"
   - Zoek naar: `sicparvisventures/auditt`
   - Of typ: `sicparvisventures/auditt`
   - Klik "Import"

### 2.3 Configureer Project

**Project Settings:**
- **Project Name:** `auditt` (of kies een andere naam)
- **Framework Preset:** Next.js (automatisch gedetecteerd)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### 2.4 Environment Variables

**BELANGRIJK: Voeg deze environment variables toe!**

Klik op "Environment Variables" en voeg toe:

**Variable 1:**
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://kauerobifkgjvddyrkuz.supabase.co`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdWVyb2JpZmtnanZkZHlya3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTIxODQsImV4cCI6MjA3NDcyODE4NH0.GqMYsz9byBYHw_fqmPYH53E4fyciz3MpdUtDQDhpvd8`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

**Variable 3:**
- **Key:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://jouw-project.vercel.app` (wordt automatisch ingevuld na deployment)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

**⚠️ Let op:** Voor `NEXT_PUBLIC_APP_URL` - vul dit in **NA** de eerste deployment met je echte Vercel URL!

### 2.5 Deploy

1. **Klik "Deploy"**
2. **Wacht 2-5 minuten** tot deployment klaar is
3. **Je krijgt een URL** zoals: `https://auditt-xxx.vercel.app`

### 2.6 Update APP_URL (Na Eerste Deployment)

1. **Ga naar:** Project → Settings → Environment Variables
2. **Zoek `NEXT_PUBLIC_APP_URL`**
3. **Klik op de drie puntjes** → "Edit"
4. **Update de waarde** naar je echte Vercel URL (bijv. `https://auditt-xxx.vercel.app`)
5. **Klik "Save"**
6. **Redeploy:**
   - Ga naar Deployments tab
   - Klik op drie puntjes van laatste deployment
   - Klik "Redeploy"

---

## ✅ Automatische Deployments

Na setup zijn automatische deployments actief:

- ✅ **Push naar `main` branch** → Automatische Production deployment
- ✅ **Push naar andere branch** → Automatische Preview deployment
- ✅ **Pull Request** → Automatische Preview deployment

**Je hoeft niets meer te doen!** Elke push naar GitHub triggert automatisch een Vercel deployment.

---

## 🔍 Verificatie Checklist

### GitHub:
- [ ] Code is gepusht naar https://github.com/sicparvisventures/auditt
- [ ] Alle bestanden zijn zichtbaar
- [ ] `.env.local` is **NIET** zichtbaar (staat in .gitignore)

### Vercel:
- [ ] Project is geïmporteerd
- [ ] Environment variables zijn ingesteld
- [ ] Eerste deployment is succesvol
- [ ] Deployment URL werkt
- [ ] `NEXT_PUBLIC_APP_URL` is geüpdatet met echte URL

---

## 🐛 Troubleshooting

### Probleem: Git push vraagt om wachtwoord

**Oplossing:**
- Gebruik **Personal Access Token** in plaats van wachtwoord
- Zie "STAP 1: GitHub Authenticatie" hierboven

### Probleem: Vercel kan repository niet vinden

**Oplossing:**
1. Check of je ingelogd bent op Vercel
2. Check of Vercel toegang heeft tot je GitHub account
3. Ga naar: https://github.com/settings/applications
4. Check of Vercel is geautoriseerd
5. Probeer opnieuw te importeren

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

## 📞 Hulp

- **GitHub Docs:** https://docs.github.com
- **Vercel Docs:** https://vercel.com/docs
- **Git Authentication:** https://docs.github.com/en/authentication

---

**Status:** ✅ Gids Compleet  
**Volgende Stap:** Volg de stappen hierboven om te deployen

