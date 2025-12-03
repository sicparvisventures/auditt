# 🔑 Vercel Environment Variables

## ⚠️ BELANGRIJK: Voeg deze toe in Vercel!

Ga naar je Vercel project → **Settings** → **Environment Variables** en voeg deze toe:

### Variable 1:
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://kauerobifkgjvddyrkuz.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Variable 2:
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdWVyb2JpZmtnanZkZHlya3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTIxODQsImV4cCI6MjA3NDcyODE4NH0.GqMYsz9byBYHw_fqmPYH53E4fyciz3MpdUtDQDhpvd8
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Variable 3 (Na eerste deployment):
```
Key: NEXT_PUBLIC_APP_URL
Value: https://jouw-actuele-vercel-url.vercel.app
Environments: ✅ Production, ✅ Preview, ✅ Development
```

**⚠️ Let op:** Voor `NEXT_PUBLIC_APP_URL` - vul dit in **NA** de eerste deployment met je echte Vercel URL!

---

## 📝 Stappen:

1. **Ga naar Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecteer je project

2. **Ga naar Settings → Environment Variables**

3. **Voeg alle 3 variabelen toe** (zie hierboven)

4. **Redeploy:**
   - Ga naar Deployments tab
   - Klik op drie puntjes van laatste deployment
   - Klik "Redeploy"

---

**Na het toevoegen van environment variables zal de deployment automatisch opnieuw starten!**

