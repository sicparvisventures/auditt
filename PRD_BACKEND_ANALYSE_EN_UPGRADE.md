# 📋 Product Requirements Document (PRD)
## Backend Analyse & Upgrade - Poule & Poulette Audit Tool

**Datum:** 2025-01-08  
**Versie:** 1.0  
**Status:** In Uitvoering

---

## 🎯 Executive Summary

Dit document beschrijft de volledige backend analyse van het Poule & Poulette Audit Tool project, identificeert problemen, en definieert upgrades om de functionaliteit te verbeteren zonder de bestaande UI, branding, of mobile-first design aan te passen.

---

## 🔍 1. Backend Analyse

### 1.1 Supabase Configuratie

**Supabase Project URL:** `https://kauerobifkgjvddyrkuz.supabase.co`  
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdWVyb2JpZmtnanZkZHlya3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTIxODQsImV4cCI6MjA3NDcyODE4NH0.GqMYsz9byBYHw_fqmPYH53E4fyciz3MpdUtDQDhpvd8`

**Configuratie Bestanden:**
- `lib/supabase.ts` - Client configuratie (hardcoded voor Cloudflare Pages)
- `lib/supabase-db.ts` - Database service layer
- `supabase/schema.sql` - Database schema
- `supabase_full.sql` - Complete database setup

### 1.2 Database Schema

**Hoofdtabellen:**
1. **gebruikers** - Gebruikers met rollen (admin, manager, district_manager, etc.)
2. **filialen** - Filiaal informatie met district manager relatie
3. **audits** - Audit records met status, scores, en opmerkingen
4. **audit_resultaten** - Resultaten per checklist item met foto's
5. **audit_checklist_items** - Checklist items met categorieën en gewichten
6. **rapporten** - Rapport records met verzend status
7. **acties** - Acties gegenereerd uit audit resultaten
8. **notificaties** - Notificaties voor gebruikers

**Enums:**
- `user_role`: admin, coo, district_manager, filiaal_manager, inspector, storemanager, developer
- `audit_status`: in_progress, completed, cancelled
- `audit_result`: ok, niet_ok
- `action_status`: pending, in_progress, completed, verified
- `urgency_level`: low, medium, high, critical
- `report_status`: pending, sent, failed

### 1.3 Storage Buckets

**Huidige Configuratie:**
- Bucket naam: `audit-photos` (in code) / `uploads` (in sommige plaatsen)
- Path: `audit-photos/{itemId}/{timestamp}-{filename}`
- Status: **Niet consistent geconfigureerd**

**Problemen:**
- Bucket naam inconsistentie (`audit-photos` vs `uploads`)
- Storage policies mogelijk niet correct ingesteld
- Geen verificatie of bucket bestaat

### 1.4 Audit Opslag Flow

**Huidige Flow:**
1. Gebruiker vult audit formulier in (`NewAuditForm.tsx`)
2. Audit wordt aangemaakt via `createAudit()`
3. Resultaten worden opgeslagen via `addAuditResults()`
4. Foto's worden geüpload naar storage
5. Scores worden automatisch berekend via database trigger

**Problemen Geïdentificeerd:**
- ✅ Audit opslag werkt correct
- ⚠️ Foto uploads kunnen falen als bucket niet bestaat
- ⚠️ Geen validatie of alle resultaten zijn opgeslagen

### 1.5 PDF Generatie & Email Functionaliteit

**Huidige Implementatie:**
- PDF: Browser print dialoog (geen echte PDF bijlage)
- Email: Mailto link (geen automatische verzending)
- Database functie: `send_audit_report_to_relevant_emails()` bestaat maar verstuurt geen echte emails

**Problemen:**
- ❌ PDF wordt niet als bijlage meegestuurd
- ❌ Email wordt niet automatisch verstuurd
- ❌ Geen Supabase Edge Function voor email verzending
- ❌ Geen automatische trigger bij audit completion

---

## 🐛 2. Geïdentificeerde Problemen

### 2.1 Kritieke Problemen

1. **PDF wordt niet als bijlage meegestuurd**
   - Huidige implementatie gebruikt browser print
   - Geen echte PDF generatie met bijlage
   - Email bevat alleen mailto link

2. **Geen automatische email verzending**
   - Database functie bestaat maar verstuurt geen emails
   - Geen Supabase Edge Function geconfigureerd
   - Geen email service (SMTP/SendGrid/etc.)

3. **Storage bucket inconsistentie**
   - Meerdere bucket namen in gebruik
   - Geen verificatie of bucket bestaat
   - Policies mogelijk niet correct

4. **Geen automatische trigger bij audit completion**
   - Trigger bestaat in SQL maar is uitgecommentarieerd
   - Geen automatische rapport generatie

### 2.2 Medium Problemen

5. **Email mapping hardcoded in frontend**
   - Email mapping zou in database moeten staan
   - Moeilijk te onderhouden

6. **Geen error handling voor storage uploads**
   - Uploads kunnen falen zonder duidelijke foutmelding
   - Geen retry mechanisme

7. **Geen validatie van audit data**
   - Geen controle of alle checklist items zijn ingevuld
   - Geen validatie van foto uploads

### 2.3 Low Priority Problemen

8. **Geen caching van checklist items**
   - Checklist items worden elke keer opgehaald
   - Kan performance verbeteren

9. **Geen batch upload voor foto's**
   - Foto's worden één voor één geüpload
   - Kan sneller met parallel uploads

---

## 🎯 3. Upgrade Requirements

### 3.1 Audit Opslag Verbeteringen

**Doel:** Zorgen dat audits correct worden opgeslagen met alle data

**Requirements:**
- ✅ Audit opslag werkt al correct
- ⚠️ Verbeter error handling
- ⚠️ Voeg validatie toe
- ⚠️ Zorg dat alle resultaten worden opgeslagen

**Acceptance Criteria:**
- Alle audit data wordt correct opgeslagen
- Foto's worden correct geüpload en gelinkt
- Scores worden automatisch berekend
- Geen data verlies

### 3.2 PDF Generatie & Email Functionaliteit

**Doel:** PDF genereren en automatisch versturen via email met bijlage

**Requirements:**
1. **PDF Generatie:**
   - Genereer echte PDF met alle audit data
   - Include foto's in PDF
   - Professionele layout met branding
   - Opslaan in Supabase Storage

2. **Email Verzending:**
   - Automatisch versturen bij "Verstuur Rapport" klik
   - PDF als bijlage
   - Correcte ontvangers (filiaal + manager)
   - Email template met audit samenvatting

3. **Automatische Trigger:**
   - Trigger bij audit completion
   - Optioneel: automatisch versturen
   - Database functie voor email logica

**Acceptance Criteria:**
- PDF wordt gegenereerd met alle data
- PDF wordt opgeslagen in storage
- Email wordt automatisch verstuurd met PDF bijlage
- Correcte ontvangers ontvangen email
- Email bevat audit samenvatting

### 3.3 Storage Bucket Configuratie

**Doel:** Zorgen dat storage buckets correct zijn geconfigureerd

**Requirements:**
- Eén consistente bucket naam: `audit-photos`
- Bucket bestaat en is publiek
- Correcte storage policies
- Verificatie in code

**Acceptance Criteria:**
- Bucket bestaat in Supabase
- Foto uploads werken correct
- Foto's zijn publiek toegankelijk
- Policies zijn correct ingesteld

### 3.4 Database Optimalisaties

**Doel:** Optimaliseren van queries en database functies

**Requirements:**
- Optimaliseer audit queries
- Verbeter email mapping functie
- Voeg indexes toe waar nodig
- Verbeter error handling

**Acceptance Criteria:**
- Queries zijn snel (< 500ms)
- Geen N+1 query problemen
- Correcte indexes aanwezig
- Goede error messages

---

## 🔧 4. Technische Implementatie

### 4.1 Supabase Edge Function voor Email

**Nieuwe Functionaliteit:**
- Edge Function: `send-audit-report`
- Gebruikt Supabase SMTP of externe service
- Genereert PDF en verstuurt email

**Alternatief (als Edge Functions niet beschikbaar):**
- Gebruik externe email service (SendGrid, Resend, etc.)
- API endpoint voor email verzending
- Database trigger voor automatische verzending

### 4.2 PDF Generatie Library

**Keuze:**
- `jspdf` + `html2canvas` (al geïnstalleerd)
- Of `puppeteer` voor server-side generatie
- Of `@react-pdf/renderer` voor React-based PDF

**Implementatie:**
- Genereer PDF met alle audit data
- Include foto's (base64 of URLs)
- Opslaan in Supabase Storage
- Return URL voor email bijlage

### 4.3 Storage Bucket Setup

**SQL Script:**
- Maak bucket aan als deze niet bestaat
- Configureer policies
- Test upload functionaliteit

### 4.4 Database Triggers

**Triggers:**
- Auto-send email bij audit completion (optioneel)
- Update rapport status
- Log email verzending

---

## 📊 5. Database Schema Updates

### 5.1 Nieuwe Tabellen (indien nodig)

**email_logs** (optioneel):
- Log alle email verzendingen
- Status tracking
- Error logging

### 5.2 Nieuwe Functies

1. **generate_audit_pdf(audit_id)** - Genereer PDF URL
2. **send_email_with_pdf(audit_id, recipients)** - Verstuur email
3. **verify_storage_bucket()** - Verifieer bucket configuratie

### 5.3 Nieuwe Triggers

1. **auto_send_report_trigger** - Automatisch versturen (optioneel)
2. **update_rapport_status_trigger** - Update status

---

## 🚀 6. Implementatie Plan

### Fase 1: Storage & Audit Opslag (Prioriteit: Hoog)
- ✅ Verifieer storage bucket configuratie
- ✅ Fix bucket naam inconsistentie
- ✅ Verbeter error handling voor uploads
- ✅ Test audit opslag volledig

### Fase 2: PDF Generatie (Prioriteit: Hoog)
- ⚠️ Implementeer echte PDF generatie
- ⚠️ Include foto's in PDF
- ⚠️ Opslaan in storage
- ⚠️ Test PDF generatie

### Fase 3: Email Functionaliteit (Prioriteit: Hoog)
- ⚠️ Setup email service (Supabase SMTP of extern)
- ⚠️ Implementeer email verzending met PDF bijlage
- ⚠️ Test email verzending
- ⚠️ Implementeer automatische trigger (optioneel)

### Fase 4: Optimalisaties (Prioriteit: Medium)
- ⚠️ Optimaliseer database queries
- ⚠️ Voeg indexes toe
- ⚠️ Verbeter error handling
- ⚠️ Performance testing

---

## ✅ 7. Acceptance Criteria

### 7.1 Audit Opslag
- [x] Audits worden correct opgeslagen
- [x] Alle resultaten worden opgeslagen
- [x] Foto's worden correct geüpload
- [x] Scores worden automatisch berekend

### 7.2 PDF Generatie
- [ ] PDF wordt gegenereerd met alle data
- [ ] Foto's zijn zichtbaar in PDF
- [ ] PDF wordt opgeslagen in storage
- [ ] PDF heeft professionele layout

### 7.3 Email Verzending
- [ ] Email wordt automatisch verstuurd
- [ ] PDF is bijlage in email
- [ ] Correcte ontvangers ontvangen email
- [ ] Email bevat audit samenvatting

### 7.4 Storage
- [ ] Bucket bestaat en is geconfigureerd
- [ ] Foto uploads werken correct
- [ ] Policies zijn correct ingesteld

---

## 📝 8. SQL Scripts

Zie bijgevoegde SQL scripts:
- `supabase/storage-setup.sql` - Storage bucket setup
- `supabase/email-functions.sql` - Email functies
- `supabase/triggers.sql` - Database triggers
- `supabase/optimizations.sql` - Query optimalisaties

---

## 🔒 9. Beveiliging & Privacy

- Alle data blijft in Supabase
- Email adressen worden correct gemapped
- Geen data lekken tussen filialen
- Storage policies zijn correct ingesteld
- RLS policies blijven actief

---

## 📱 10. Mobile-First & Branding

**Belangrijk:** Geen wijzigingen aan:
- UI/UX design
- Branding (kleuren, logo's, fonts)
- Mobile-first approach
- Responsive design

**Alleen backend upgrades:**
- Database optimalisaties
- Email functionaliteit
- PDF generatie
- Storage configuratie

---

## 🎯 11. Success Metrics

- ✅ 100% audit opslag success rate
- ✅ PDF generatie < 5 seconden
- ✅ Email verzending < 10 seconden
- ✅ Storage upload success rate > 99%
- ✅ Geen data verlies
- ✅ Correcte email distributie

---

**Document Status:** ✅ Compleet  
**Volgende Stap:** Implementatie starten

