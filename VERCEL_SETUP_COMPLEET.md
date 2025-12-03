# ✅ Vercel Setup - Complete Gids

## 🎯 Wat is Gefixt

1. ✅ **Next.js Config** - Geconfigureerd voor Vercel (geen static export)
2. ✅ **Carrieres Pagina** - Lege pagina gefixt
3. ✅ **Gitignore** - Cloudflare folders worden genegeerd
4. ✅ **Package.json** - Prebuild script verwijderd (veroorzaakte problemen)
5. ✅ **Code gepusht** naar GitHub

---

## 🔑 STAP 1: Environment Variables in Vercel

**BELANGRIJK:** Voeg deze toe voordat je deployt!

1. **Ga naar Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecteer je project: `auditt`

2. **Ga naar Settings → Environment Variables**

3. **Voeg deze 3 variabelen toe:**

### Variable 1:
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://kauerobifkgjvddyrkuz.supabase.co`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 2:
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdWVyb2JpZmtnanZkZHlya3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTIxODQsImV4cCI6MjA3NDcyODE4NH0.GqMYsz9byBYHw_fqmPYH53E4fyciz3MpdUtDQDhpvd8`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 3 (Na eerste deployment):
- **Key:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://jouw-actuele-vercel-url.vercel.app` (vul in na eerste deployment)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

---

## 🚀 STAP 2: Eerste Deployment

Na het toevoegen van environment variables:

1. **Ga naar Deployments tab**
2. **Klik op de laatste deployment**
3. **Klik "Redeploy"** (of wacht tot automatische deployment start)

**Deployment start automatisch** omdat code al naar GitHub is gepusht!

---

## ✅ Automatische Deployments

Na setup:
- ✅ **Elke push naar `main`** → Automatische Production deployment
- ✅ **Elke push naar andere branch** → Automatische Preview deployment
- ✅ **Pull Request** → Automatische Preview deployment

---

## 🔍 Verificatie

Na deployment:

1. **Check deployment status** in Vercel dashboard
2. **Open deployment URL** (bijv. `https://auditt-xxx.vercel.app`)
3. **Test de applicatie:**
   - Login werkt
   - Audits kunnen worden aangemaakt
   - Foto's kunnen worden geüpload
   - PDF generatie werkt
   - Email verzending werkt

---

## 🐛 Troubleshooting

### Build faalt nog steeds:

1. **Check build logs** in Vercel dashboard
2. **Check environment variables** zijn ingesteld
3. **Test lokaal:** `npm run build`
4. **Check browser console** voor errors

### Environment variables werken niet:

1. **Redeploy** na het toevoegen van variabelen
2. **Check** of `NEXT_PUBLIC_` prefix correct is
3. **Check** of alle environments zijn geselecteerd

### Supabase connectie werkt niet:

1. **Check** Supabase URL en key zijn correct
2. **Check** Supabase dashboard voor CORS instellingen
3. **Voeg Vercel URL toe** aan Supabase allowed origins

---

## 📊 Status

- ✅ Code gepusht naar GitHub
- ✅ Next.js geconfigureerd voor Vercel
- ✅ Build errors gefixt
- ⏳ Environment variables moeten worden ingesteld in Vercel
- ⏳ Eerste deployment wacht op environment variables

---

**Volgende Stap:** Voeg environment variables toe in Vercel en redeploy!

