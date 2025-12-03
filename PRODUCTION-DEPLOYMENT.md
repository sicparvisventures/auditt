# Poule & Poulette Interne Audit Tool - Productie Deployment

## 🎯 Overzicht

Deze gids helpt je om de Poule & Poulette Interne Audit Tool volledig op te zetten voor productie gebruik. Alles is klaar voor deployment morgen!

## 📁 Bestanden Overzicht

### Database Bestanden
- `supabase/schema-production.sql` - Complete database schema
- `supabase/seed-production.sql` - Realistische productie data
- `supabase/quick-setup.sql` - Snelle setup via SQL editor
- `supabase/setup-production.sh` - Automatisch setup script

### Documentatie
- `supabase/README-PRODUCTION.md` - Uitgebreide setup documentatie
- `PRODUCTION-DEPLOYMENT.md` - Deze deployment gids

## 🚀 Snelle Deployment (5 minuten)

### Optie 1: Via Supabase Dashboard (Aanbevolen)

1. **Ga naar je Supabase project**
   - Open [Supabase Dashboard](https://supabase.com/dashboard)
   - Selecteer je project

2. **Open SQL Editor**
   - Klik op "SQL Editor" in het menu
   - Klik op "New query"

3. **Run het schema**
   - Kopieer de inhoud van `supabase/schema-production.sql`
   - Plak in de SQL editor
   - Klik op "Run"

4. **Run de seed data**
   - Kopieer de inhoud van `supabase/seed-production.sql`
   - Plak in de SQL editor
   - Klik op "Run"

5. **Setup storage**
   - Kopieer de inhoud van `supabase/quick-setup.sql`
   - Plak in de SQL editor
   - Klik op "Run"

### Optie 2: Via Command Line

```bash
# 1. Clone/navigeer naar je project
cd /path/to/your/project

# 2. Run het setup script
./supabase/setup-production.sh

# 3. Volg de prompts voor je project details
```

## 🔧 Environment Variables

Na de database setup, update je `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

## 👥 Standaard Login Credentials

Na de setup kun je inloggen met:

| User ID | Wachtwoord | Rol | Beschrijving |
|---------|------------|-----|--------------|
| `ADMIN` | - | admin | Filip van Hoeck - Hoofdbeheerder |
| `COO01` | - | coo | Sarah De Vries - COO |
| `DM001` | - | district_manager | Tom Janssen - District Manager |
| `DM002` | - | district_manager | Lisa Peeters - District Manager |
| `DM003` | - | district_manager | Marc Van Der Berg - District Manager |

**Note**: De app gebruikt momenteel localStorage-based authentication. Gebruikers kunnen inloggen met hun User ID.

## 🏢 Voorgeconfigureerde Filialen

De volgende 9 filialen zijn klaar voor gebruik:

1. **Gent - KM11** (Korenmarkt 11)
2. **Etterbeek - PJ70** (Place Jourdan 70)  
3. **Mechelen - IL36** (Ijzerenleen 36)
4. **Leuven - TS15** (Tiensestraat 15)
5. **Antwerpen - GK2** (Godfrieduskaai 2)
6. **Oostende - IL34** (Leopold II Laan 34)
7. **Brussel - TL24** (Tervurenlaan 24a)
8. **Brussel - SC2** (Place Saint-Catherine 2)
9. **Brugge - SS3** (Simon Stevinplein 3)

## 📊 Sample Data

De database bevat realistische data:

- **18 audits** van de laatste 3 maanden
- **360 audit resultaten** (20 per audit)
- **3 acties** met verschillende statussen
- **9 notificaties** voor actie updates
- **10 rapporten** gegenereerd uit audits

## 🔐 Beveiliging

### Row Level Security (RLS)
- Alle tabellen hebben RLS ingeschakeld
- Gebruikers zien alleen hun toegewezen data
- District managers zien alleen hun filialen

### Storage
- `audit-files` bucket voor foto uploads
- Alleen geauthenticeerde gebruikers kunnen uploaden
- Bestanden zijn gekoppeld aan specifieke audits/acties

## 🚀 Deployment Stappen

### 1. Database Setup
```bash
# Via Supabase Dashboard (aanbevolen)
# 1. Open SQL Editor
# 2. Run schema-production.sql
# 3. Run seed-production.sql
# 4. Run quick-setup.sql
```

### 2. Environment Variables
```bash
# Update .env.local met je Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Deploy Application
```bash
# Build en deploy je applicatie
npm run build
npm run start

# Of deploy naar je hosting platform
# (Vercel, Netlify, etc.)
```

### 4. Verificatie
```bash
# Test de login functionaliteit
# 1. Ga naar /login
# 2. Log in met ADMIN
# 3. Controleer of dashboard laadt
# 4. Test audit functionaliteit
```

## ✅ Checklist voor Productie

- [ ] Database schema toegepast
- [ ] Seed data geladen
- [ ] Storage bucket geconfigureerd
- [ ] Environment variables ingesteld
- [ ] Applicatie gedeployed
- [ ] Login functionaliteit getest
- [ ] Audit functionaliteit getest
- [ ] File upload getest
- [ ] Notificaties getest
- [ ] Rapport generatie getest

## 🔍 Verificatie Queries

Test of alles correct is opgezet:

```sql
-- Controleer gebruikers
SELECT COUNT(*) as user_count FROM gebruikers;

-- Controleer filialen
SELECT COUNT(*) as filiaal_count FROM filialen;

-- Controleer audits
SELECT COUNT(*) as audit_count FROM audits;

-- Controleer acties
SELECT COUNT(*) as action_count FROM acties;

-- Controleer notificaties
SELECT COUNT(*) as notification_count FROM notificaties;
```

## 🚨 Troubleshooting

### Veelvoorkomende Problemen

**1. Database connection failed**
- Controleer je DATABASE_URL
- Controleer of je project actief is
- Controleer je credentials

**2. RLS policies blocking access**
- Controleer of je ingelogd bent
- Controleer of je de juiste rol hebt
- Controleer de RLS policies

**3. Storage upload failed**
- Controleer of de bucket bestaat
- Controleer de storage policies
- Controleer je authentication

**4. Triggers not working**
- Controleer of alle functies zijn aangemaakt
- Controleer of triggers zijn geactiveerd
- Controleer de database logs

## 📞 Support

Voor vragen of problemen:
1. Controleer eerst de logs in je Supabase dashboard
2. Bekijk de uitgebreide documentatie in `supabase/README-PRODUCTION.md`
3. Test de functionaliteit stap voor stap

## 🎉 Klaar voor Productie!

Na het volgen van deze gids heb je:
- ✅ Complete database setup
- ✅ Realistische test data
- ✅ Beveiligde omgeving
- ✅ File upload functionaliteit
- ✅ Notificatie systeem
- ✅ Audit workflow
- ✅ Rapport generatie

**Je applicatie is klaar voor productie gebruik!**

---

**Laatste update**: $(date)
**Versie**: 1.0.0
