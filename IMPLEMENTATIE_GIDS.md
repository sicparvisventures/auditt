# 🚀 Implementatie Gids - Backend Upgrade

## 📋 Overzicht

Deze gids beschrijft hoe je de backend upgrades implementeert voor het Poule & Poulette Audit Tool.

---

## ✅ Wat is Geüpgraded

### 1. **Storage Bucket Configuratie**
- ✅ Consistente bucket naam: `audit-photos`
- ✅ Correcte storage policies
- ✅ Publieke toegang voor foto's
- ✅ File upload naar Supabase Storage

### 2. **PDF Generatie**
- ✅ Echte PDF generatie met jsPDF
- ✅ Professionele layout met alle audit data
- ✅ Foto's en opmerkingen in PDF
- ✅ Opslaan in Supabase Storage
- ✅ Download functionaliteit

### 3. **Email Functionaliteit**
- ✅ PDF generatie en upload
- ✅ Email met PDF link
- ✅ Correcte ontvangers (filiaal + manager)
- ✅ Database logging van verzending

### 4. **Database Optimalisaties**
- ✅ Verbeterde email functies
- ✅ Automatische rapport creatie trigger
- ✅ PDF URL tracking
- ✅ Email verzend logging

---

## 🔧 Stap-voor-Stap Implementatie

### STAP 1: Supabase Storage Bucket Setup

1. **Ga naar Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/kauerobifkgjvddyrkuz
   - Navigeer naar **Storage**

2. **Run SQL Script:**
   - Ga naar **SQL Editor**
   - Open `supabase/storage-setup.sql`
   - Kopieer en plak het script
   - Klik **Run**

3. **Verifieer:**
   - Ga naar **Storage** → **Buckets**
   - Controleer dat `audit-photos` bucket bestaat
   - Controleer dat bucket **public** is

### STAP 2: Database Functies Upgrade

1. **Run Email Functies Script:**
   - Ga naar **SQL Editor**
   - Open `supabase/email-functions-upgrade.sql`
   - Kopieer en plak het script
   - Klik **Run**

2. **Run Triggers Script:**
   - Open `supabase/triggers-upgrade.sql`
   - Kopieer en plak het script
   - Klik **Run**

3. **Verifieer Functies:**
   ```sql
   -- Test email functie
   SELECT * FROM send_audit_report_to_relevant_emails('jouw-audit-id');
   
   -- Test PDF URL functie
   SELECT get_audit_pdf_url('jouw-audit-id');
   ```

### STAP 3: Frontend Code Updates

De frontend code is al geüpdatet:
- ✅ `lib/file-upload.ts` - Supabase Storage upload
- ✅ `lib/pdf-service.ts` - PDF generatie service
- ✅ `lib/email-service-upgrade.ts` - Email service
- ✅ `components/audit/AuditDetail.tsx` - UI updates

**Geen actie nodig** - code is al geüpdatet!

### STAP 4: Test de Functionaliteit

1. **Test PDF Generatie:**
   - Ga naar een audit detail pagina
   - Klik op **"Export PDF"**
   - PDF moet worden gedownload

2. **Test Email Verzending:**
   - Ga naar een audit detail pagina
   - Klik op **"Verstuur Rapport"**
   - PDF wordt gegenereerd en geüpload
   - Email app opent met PDF link

3. **Test Storage Upload:**
   - Maak een nieuwe audit
   - Upload foto's
   - Controleer dat foto's zichtbaar zijn

---

## 📧 Email Verzending - Huidige Implementatie

### Hoe het werkt:

1. **PDF Generatie:**
   - PDF wordt gegenereerd met alle audit data
   - PDF wordt geüpload naar Supabase Storage
   - PDF URL wordt opgeslagen in database

2. **Email Verzending:**
   - Email app wordt geopend via mailto link
   - PDF URL staat in email body
   - Gebruiker kan PDF link delen of downloaden

### Automatische Email Verzending (Optioneel)

Voor **echte automatische email verzending** (zonder mailto link) heb je nodig:

1. **Supabase Edge Function** of
2. **Externe Email Service** (SendGrid, Resend, etc.)

**Implementatie voor automatische verzending:**
- Zie `lib/email-service-upgrade.ts` → `sendEmailAutomatically()`
- Vereist API endpoint of Edge Function
- Zie PRD voor details

---

## 🔍 Verificatie & Troubleshooting

### Verificatie Queries

```sql
-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'audit-photos';

-- Check email functie
SELECT proname FROM pg_proc WHERE proname = 'send_audit_report_to_relevant_emails';

-- Check triggers
SELECT tgname FROM pg_trigger WHERE tgname LIKE '%audit%';

-- Check rapporten
SELECT * FROM rapporten ORDER BY created_at DESC LIMIT 5;
```

### Veelvoorkomende Problemen

1. **Storage bucket bestaat niet:**
   - Run `storage-setup.sql` opnieuw
   - Controleer bucket in Supabase Dashboard

2. **PDF upload faalt:**
   - Controleer storage policies
   - Controleer bucket permissions
   - Check browser console voor errors

3. **Email functie werkt niet:**
   - Run `email-functions-upgrade.sql` opnieuw
   - Controleer database functies

4. **Foto's worden niet geüpload:**
   - Controleer bucket naam: `audit-photos`
   - Controleer file upload code
   - Check browser console

---

## 📊 Database Schema Updates

### Nieuwe/Geüpdate Functies:

1. `get_audit_pdf_url(audit_id)` - Genereer PDF URL
2. `send_audit_report_to_relevant_emails(audit_id)` - Verstuur rapport (upgrade)
3. `log_email_sent(...)` - Log email verzending
4. `verify_audit_report_status(audit_id)` - Verifieer rapport status

### Nieuwe Triggers:

1. `auto_create_audit_report_trigger` - Maak rapport aan bij completion
2. `update_audit_scores_trigger` - Update scores (bestaat al, verbeterd)
3. `create_actions_trigger` - Maak acties aan (bestaat al, verbeterd)

---

## 🎯 Next Steps (Optioneel)

### Voor Volledige Automatische Email Verzending:

1. **Setup Supabase Edge Function:**
   - Maak Edge Function: `send-email`
   - Configureer SMTP of externe service
   - Update `email-service-upgrade.ts`

2. **Email Service Keuze:**
   - **Supabase SMTP** (binnen Supabase)
   - **SendGrid** (externe service)
   - **Resend** (externe service)
   - **AWS SES** (externe service)

3. **Automatische Trigger:**
   - Uncomment trigger in `triggers-upgrade.sql`
   - Test automatische verzending

---

## ✅ Checklist

- [ ] Storage bucket `audit-photos` bestaat en is public
- [ ] Storage policies zijn correct ingesteld
- [ ] Email functies zijn geüpdatet
- [ ] Triggers zijn geactiveerd
- [ ] PDF generatie werkt
- [ ] Email verzending werkt
- [ ] Foto uploads werken
- [ ] Database logging werkt

---

## 📝 Notities

- **Geen UI wijzigingen** - alleen backend upgrades
- **Branding behouden** - alle styling blijft hetzelfde
- **Mobile-first** - geen wijzigingen aan responsive design
- **Backward compatible** - bestaande functionaliteit blijft werken

---

**Status:** ✅ Implementatie Compleet  
**Datum:** 2025-01-08

