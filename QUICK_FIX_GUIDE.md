# 🚀 Quick Fix Guide - Storage & Audit Data

## ⚡ Snelle Fix (5 minuten)

### STAP 1: Run SQL Script in Supabase (2 min)

1. **Ga naar:** https://supabase.com/dashboard/project/kauerobifkgjvddyrkuz/sql/new
2. **Open:** `supabase/COMPLETE-FIX-STORAGE-AND-AUDIT-DATA.sql`
3. **Kopieer** de volledige inhoud
4. **Plak** in SQL Editor
5. **Klik** "Run" (of Ctrl+Enter)
6. **Wacht** tot je ziet: "✅ COMPLETE FIX APPLIED"

### STAP 2: Test (3 min)

1. **Ga naar:** https://auditt-psi.vercel.app/audits/new
2. **Selecteer** een filiaal
3. **Upload** een foto bij een checklist item
4. **Vul** audit formulier in met:
   - Opmerkingen
   - Verbeterpunten
   - Foto's
5. **Sla** audit op
6. **Ga naar** audit detail pagina
7. **Verifieer:** Alles wordt getoond ✅

## ✅ Wat wordt gefixt

- ✅ Foto uploads werken (geen RLS error meer)
- ✅ Alle audit data wordt opgeslagen (foto's, tekst)
- ✅ Audit detail pagina toont alles correct
- ✅ Storage bucket is publiek toegankelijk
- ✅ Database tabellen zijn toegankelijk voor anon users

## 📋 SQL Scripts

**HOOFD SCRIPT (run dit!):**
- `supabase/COMPLETE-FIX-STORAGE-AND-AUDIT-DATA.sql`

**Optionele scripts:**
- `supabase/storage-rls-fix.sql` - Alleen storage
- `supabase/audit-data-complete-setup.sql` - Alleen database

## 🔍 Troubleshooting

**Foto upload faalt nog steeds?**
- Check Supabase Storage → Buckets → `audit-photos` bestaat
- Check Storage → Policies → Anon users hebben INSERT toestemming
- Check browser console voor errors

**Data wordt niet opgeslagen?**
- Check Table Editor → `audit_resultaten` → Nieuwe records?
- Check Authentication → Policies → Anon users hebben INSERT toestemming

---

**BELANGRIJK:** Run het SQL script eerst voordat je test!

