# Poule & Poulette Interne Audit Tool - Production Database Setup

Dit document beschrijft hoe je de productie database opzet voor de Poule & Poulette Interne Audit Tool in Supabase.

## 📋 Overzicht

Deze setup bevat:
- **Complete database schema** met alle tabellen, triggers en functies
- **Realistische seed data** voor productie gebruik
- **Automatische setup script** voor eenvoudige deployment
- **Storage configuratie** voor file uploads
- **Row Level Security (RLS)** policies voor data beveiliging

## 🚀 Snelle Start

### 1. Voorbereiding

Zorg ervoor dat je de volgende tools hebt geïnstalleerd:
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [PostgreSQL client](https://www.postgresql.org/download/) (voor psql)

```bash
# Installeer Supabase CLI
npm install -g supabase

# Log in op Supabase
supabase login
```

### 2. Supabase Project Aanmaken

1. Ga naar [Supabase Dashboard](https://supabase.com/dashboard)
2. Klik op "New Project"
3. Kies je organisatie
4. Geef je project een naam: "Poule Poulette Audit"
5. Kies een database password (bewaar dit veilig!)
6. Kies de regio die het dichtst bij je is
7. Klik op "Create new project"

### 3. Database Setup

Run het setup script:

```bash
# Ga naar je project directory
cd /path/to/your/project

# Run het setup script
./supabase/setup-production.sh
```

Het script zal vragen om:
- **Project ID**: Vind je in je Supabase dashboard
- **Database URL**: Vind je in Settings > Database
- **Anon Key**: Vind je in Settings > API
- **Service Role Key**: Vind je in Settings > API

### 4. Verificatie

Na het runnen van het script, controleer of alles werkt:

```bash
# Test de database connectie
psql "YOUR_DATABASE_URL" -c "SELECT COUNT(*) FROM gebruikers;"

# Controleer of alle tabellen bestaan
psql "YOUR_DATABASE_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

## 📊 Database Schema

### Tabellen

1. **gebruikers** - Gebruikers en hun rollen
2. **filialen** - Restaurant locaties
3. **audit_checklist_items** - Checklist items voor audits
4. **audits** - Audit sessies
5. **audit_resultaten** - Resultaten per checklist item
6. **acties** - Actie items gegenereerd uit audit resultaten
7. **rapporten** - Audit rapporten
8. **notificaties** - Systeem notificaties

### Belangrijke Functies

- **calculate_audit_score()** - Berekent audit scores automatisch
- **create_actions_from_audit_results()** - Genereert acties uit audit resultaten
- **determine_action_urgency()** - Bepaalt urgentie van acties
- **send_action_completion_notifications()** - Stuurt notificaties bij actie voltooiing

### Triggers

- **update_audit_scores_trigger** - Update scores bij wijziging resultaten
- **create_actions_trigger** - Genereert acties bij audit voltooiing
- **action_completion_notifications_trigger** - Stuurt notificaties bij actie voltooiing
- **action_verification_notifications_trigger** - Stuurt notificaties bij actie verificatie

## 🔐 Beveiliging

### Row Level Security (RLS)

Alle tabellen hebben RLS ingeschakeld met de volgende policies:

- **Gebruikers**: Kunnen alleen hun eigen data lezen/bewerken
- **Filialen**: District managers kunnen alleen hun toegewezen filialen zien
- **Audits**: Volgen dezelfde regels als filialen
- **Acties**: Toegewezen gebruikers kunnen hun acties zien
- **Notificaties**: Gebruikers zien alleen hun eigen notificaties

### Storage Beveiliging

- **audit-files** bucket voor file uploads
- Alleen geauthenticeerde gebruikers kunnen bestanden uploaden/bekijken
- Bestanden zijn gekoppeld aan specifieke audits/acties

## 👥 Standaard Gebruikers

Na de setup zijn de volgende gebruikers beschikbaar:

| User ID | Naam | Rol | Beschrijving |
|---------|------|-----|--------------|
| ADMIN | Filip van Hoeck | admin | Hoofdbeheerder |
| COO01 | Sarah De Vries | coo | Chief Operating Officer |
| DM001 | Tom Janssen | district_manager | District Manager (Gent, Etterbeek, Mechelen) |
| DM002 | Lisa Peeters | district_manager | District Manager (Leuven, Antwerpen, Oostende) |
| DM003 | Marc Van Der Berg | district_manager | District Manager (Brussel, Brugge) |
| FM001-FM009 | Filiaal Managers | filiaal_manager | Managers per filiaal |

## 🏢 Filialen

De volgende filialen zijn voorgeconfigureerd:

1. **Gent - KM11** (Korenmarkt 11)
2. **Etterbeek - PJ70** (Place Jourdan 70)
3. **Mechelen - IL36** (Ijzerenleen 36)
4. **Leuven - TS15** (Tiensestraat 15)
5. **Antwerpen - GK2** (Godfrieduskaai 2)
6. **Oostende - IL34** (Leopold II Laan 34)
7. **Brussel - TL24** (Tervurenlaan 24a)
8. **Brussel - SC2** (Place Saint-Catherine 2)
9. **Brugge - SS3** (Simon Stevinplein 3)

## 📈 Sample Data

De database bevat realistische sample data:

- **18 audits** van de laatste 3 maanden
- **360 audit resultaten** (20 per audit)
- **3 acties** met verschillende statussen
- **9 notificaties** voor actie updates
- **10 rapporten** gegenereerd uit audits

## 🔧 Onderhoud

### Database Backup

```bash
# Maak een backup
pg_dump "YOUR_DATABASE_URL" > backup_$(date +%Y%m%d_%H%M%S).sql

# Herstel van backup
psql "YOUR_DATABASE_URL" < backup_file.sql
```

### Performance Monitoring

Controleer regelmatig:
- Database grootte en groei
- Query performance
- Storage gebruik
- Active connections

### Updates

Voor schema updates:
1. Maak een backup
2. Test updates in development
3. Pas updates toe in productie
4. Verificeer functionaliteit

## 🚨 Troubleshooting

### Veelvoorkomende Problemen

**1. Connection refused**
```bash
# Controleer of je database URL correct is
echo $DATABASE_URL
```

**2. Permission denied**
```bash
# Controleer of je service role key correct is
# Zorg dat je de juiste rechten hebt
```

**3. Schema errors**
```bash
# Controleer of alle extensies beschikbaar zijn
psql "YOUR_DATABASE_URL" -c "SELECT * FROM pg_available_extensions WHERE name = 'uuid-ossp';"
```

**4. RLS policies**
```bash
# Controleer of RLS policies actief zijn
psql "YOUR_DATABASE_URL" -c "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';"
```

### Logs Bekijken

```bash
# Supabase logs
supabase logs --project-ref YOUR_PROJECT_ID

# Database logs
# Ga naar je Supabase dashboard > Logs > Database
```

## 📞 Support

Voor vragen of problemen:
1. Controleer eerst de logs
2. Bekijk de Supabase documentatie
3. Contacteer het development team

## 🔄 Updates

Dit document wordt bijgewerkt bij wijzigingen aan het schema of setup proces.

**Laatste update**: $(date)
**Versie**: 1.0.0
