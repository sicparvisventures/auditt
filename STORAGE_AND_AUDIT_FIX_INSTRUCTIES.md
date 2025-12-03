# 🔧 Storage & Audit Data Fix - Instructies

## ❌ Probleem
- Foto uploads falen met: "new row violates row-level security policy"
- Audit data (foto's, tekst) wordt niet altijd correct opgeslagen
- Audit detail pagina toont niet alle data

## ✅ Oplossing

### STAP 1: Run SQL Script in Supabase

1. **Ga naar Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Selecteer je project: `kauerobifkgjvddyrkuz`

2. **Ga naar SQL Editor:**
   - Klik op "SQL Editor" in het menu
   - Klik op "New Query"

3. **Run het complete fix script:**
   - Open: `supabase/COMPLETE-FIX-STORAGE-AND-AUDIT-DATA.sql`
   - Kopieer de volledige inhoud
   - Plak in SQL Editor
   - Klik "Run" (of druk Ctrl+Enter)

4. **Verifieer:**
   - Je zou moeten zien: "✅ COMPLETE FIX APPLIED"
   - Check de output voor eventuele errors

### STAP 2: Test Foto Upload

1. **Ga naar:** https://auditt-psi.vercel.app/audits/new
2. **Selecteer een filiaal**
3. **Upload een foto** bij een checklist item
4. **Verifieer:** Foto wordt geüpload zonder error

### STAP 3: Test Audit Opslag

1. **Vul een audit formulier in:**
   - Selecteer filiaal
   - Vul checklist items in
   - Voeg foto's toe
   - Voeg opmerkingen toe
   - Voeg verbeterpunten toe

2. **Sla audit op**

3. **Ga naar audit detail pagina:**
   - https://auditt-psi.vercel.app/audits/detail?id=<audit-id>

4. **Verifieer:**
   - ✅ Alle foto's worden getoond
   - ✅ Alle opmerkingen worden getoond
   - ✅ Alle verbeterpunten worden getoond
   - ✅ Alle data is correct opgeslagen

## 📋 Wat wordt gefixt

### Storage Bucket
- ✅ Bucket `audit-photos` wordt aangemaakt (als niet bestaat)
- ✅ Public bucket (anon access)
- ✅ RLS policies voor anon users (upload, read, update, delete)
- ✅ RLS policies voor authenticated users

### Database Tables
- ✅ `audit_resultaten.foto_urls` is TEXT[] array
- ✅ `audit_resultaten.opmerkingen` kan NULL zijn
- ✅ `audit_resultaten.verbeterpunt` kan NULL zijn
- ✅ RLS policies voor alle tabellen (anon access)

### RLS Policies
- ✅ Storage: Anon users kunnen uploaden/bekijken
- ✅ Database: Anon users kunnen lezen/schrijven
- ✅ Alle tabellen: Public access voor lezen/schrijven

## 🔍 Troubleshooting

### Foto upload faalt nog steeds:
1. **Check Supabase Storage:**
   - Ga naar Storage → Buckets
   - Check of `audit-photos` bucket bestaat
   - Check of bucket "Public" is

2. **Check RLS Policies:**
   - Ga naar Storage → Policies
   - Check of policies voor `audit-photos` bestaan
   - Check of anon users INSERT toestemming hebben

3. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Check Console voor errors
   - Check Network tab voor failed requests

### Audit data wordt niet opgeslagen:
1. **Check Database:**
   - Ga naar Table Editor → `audit_resultaten`
   - Check of nieuwe records worden aangemaakt
   - Check of `foto_urls` array correct is

2. **Check RLS Policies:**
   - Ga naar Authentication → Policies
   - Check of policies voor `audit_resultaten` bestaan
   - Check of anon users INSERT toestemming hebben

### Foto's worden niet getoond:
1. **Check foto_urls:**
   - Check of URLs correct zijn opgeslagen
   - Check of URLs publiek toegankelijk zijn
   - Test URL in browser

2. **Check CORS:**
   - Supabase Storage heeft automatisch CORS enabled
   - Check of Vercel URL is toegevoegd aan allowed origins

## 📝 SQL Scripts

- `supabase/COMPLETE-FIX-STORAGE-AND-AUDIT-DATA.sql` - **HOOFD SCRIPT** (run dit!)
- `supabase/storage-rls-fix.sql` - Alleen storage fix
- `supabase/audit-data-complete-setup.sql` - Alleen database fix

## ✅ Na Fix

Na het runnen van het script:
- ✅ Foto uploads werken
- ✅ Audit data wordt correct opgeslagen
- ✅ Foto's worden getoond in audit detail
- ✅ Alle tekst (opmerkingen, verbeterpunten) wordt opgeslagen
- ✅ Audit detail pagina toont alle data

---

**BELANGRIJK:** Run het SQL script in Supabase voordat je test!

