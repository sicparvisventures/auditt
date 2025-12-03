# Fix voor Audit Datum en Deadline Berekening

## Probleem Opgelost
1. **Audit datum:** Werd altijd ingesteld op 02-10-2025 zonder werkelijke tijd
2. **Deadline berekening:** Deadline logica klopte niet met de gewenste urgentie regels

## Oplossing Geïmplementeerd

### 1. Audit Datum Fix

#### **Voor:**
```typescript
audit_datum: new Date().toISOString().split('T')[0]  // Alleen datum (YYYY-MM-DD)
```

#### **Na:**
```typescript
audit_datum: new Date().toISOString()  // Volledige timestamp (YYYY-MM-DDTHH:mm:ss.sssZ)
```

#### **Database Schema Update:**
```sql
-- audit_datum gewijzigd van DATE naar TIMESTAMP WITH TIME ZONE
ALTER TABLE audits 
ALTER COLUMN audit_datum TYPE TIMESTAMP WITH TIME ZONE;
```

### 2. Acties Detail Weergave Fix

#### **Voor:**
```typescript
<FormatDate action.audit?.audit_datum>
// Toonde: "02-10-2025"
```

#### **Na:**
```typescript
{new Date(action.audit.audit_datum).toLocaleDateString('nl-NL') + 
 ', ' + new Date(action.audit.audit_datum).toLocaleTimeString('nl-NL')}
// Toont: "23-12-2024, 14:30" (werkelijke datum en tijd)
```

### 3. Deadline Berekening Fix

#### **Oude Logica (Fout):**
```sql
-- Gebruikte CURRENT_DATE + interval (onjuist)
CASE urgentie
    WHEN 'critical' THEN CURRENT_DATE + INTERVAL '1 day'
    WHEN 'high' THEN CURRENT_DATE + INTERVAL '3 days'  
    WHEN 'medium' THEN CURRENT_DATE + INTERVAL '7 days'
    WHEN 'low' THEN CURRENT_DATE + INTERVAL '14 days'
END
```

#### **Nieuwe Logica (Correct):**
```sql
-- Gebruikt audit_datum + interval (correct)
CASE urgentie
    WHEN 'critical' THEN audit_datum + INTERVAL '1 day'      -- 24h
    WHEN 'high' THEN audit_datum + INTERVAL '1 day'          -- 24h  
    WHEN 'medium' THEN audit_datum + INTERVAL '3 days'       -- 3 dagen
    WHEN 'low' THEN audit_datum + INTERVAL '7 days'          -- 7 dagen
END
```

## Urgentie Regels (Gecorrigeerd)

| Urgentie | Deadline | Beschrijving |
|----------|----------|--------------|
| **Critical** | Audit Datum + 24h | Kritieke problemen |
| **High** | Audit Datum + 24h | Dringende problemen |
| **Medium** | Audit Datum + 3 dagen | Gemiddelde prioriteit |
| **Low** | Audit Datum + 7 dagen | Lage prioriteit |

## SQL Scripts Geïmplementeerd

### 1. `fix_action_dates_and_deadlines.sql`
- ✅ **Deadline functie update** - Nieuwe urgentie logica
- ✅ **Bestaande acties correctie** - Update huidige deadlines
- ✅ **Database controles** - Verificeer wijzigingen

### 2. `update_audit_datum_to_timestamp.sql`
- ✅ **Schema migration** - DATE → TIMESTAMP WITH TIME ZONE
- ✅ **Data conversie** - Bewaarde bestaande data
- ✅ **Functie update** - Werkt met TIMESTAMP
- ✅ **Controles** - Test en verify wijzigingen

## Technische Details

### Database Schema Wijziging
```sql
-- Van:
audit_datum DATE NOT NULL

-- Naar:  
audit_datum TIMESTAMP WITH TIME ZONE NOT NULL
```

### Frontend Wijzigingen

#### **NewAuditForm.tsx:**
```typescript
// Audit datum nu met volledige timestamp
audit_datum: new Date().toISOString()
```

#### **ActionDetailPage.tsx:**
```typescript
// Datum en tijd correct weergeven
new Date(audit.audit_datum).toLocaleDateString('nl-NL') + 
', ' + new Date(audit.audit_datum).toLocaleTimeString('nl-NL')
```

### Database Functie Update
```sql
CREATE OR REPLACE FUNCTION create_actions_from_audit_results(audit_id UUID)
RETURNS VOID AS $$
-- Nieuwe deadline logica op basis van audit_datum TIMESTAMP
CASE action_urgentie
    WHEN 'critical' THEN CAST(result_record.audit_datum AS DATE) + INTERVAL '1 day'
    WHEN 'high' THEN CAST(result_record.audit_datum AS DATE) + INTERVAL '1 day' 
    WHEN 'medium' THEN CAST(result_record.audit_datum AS DATE) + INTERVAL '3 days'
    WHEN 'low' THEN CAST(result_record.audit_datum AS DATE) + INTERVAL '7 days'
END CASE;
```

## Resultaten

### Voor de Fix:
- 📅 **Audit datum:** Altijd "02-10-2025" (static)
- ⏰ **Tijd weergave:** Niet beschikbaar
- 📋 **Deadlines:** Onjuist berekend (gebaseerd op CURRENT_DATE)
- 🚨 **Urgentie:** Nog niet werkende volgens regels

### Na de Fix:
- ✅ **Audit datum:** Werkelijke datum en tijd van audit invoer
- ✅ **Tijd weergave:** "23-12-2024, 14:30" formaat
- ✅ **Deadlines:** Correct berekend vanaf audit datum
- ✅ **Urgentie:** Werkt volgens nieuwe regels:
  - Kritiek/Hoog: **24 uur**
  - Gemiddeld: **3 dagen**
  - Laag: **7 dagen**

## Toepassing

### Voor Nieuwe Audits:
1. **Audit invullen** → Krijgt werkelijke datum/tijd
2. **Acties aanmaken** → Deadlines berekend vanaf audit datum
3. **Weergave** → Toont correcte audit datum en deadlines

### Voor Bestaande Audits:
1. **Schema update** → Database migratie naar TIMESTAMP
2. **Deadline correctie** → Bestaande deadlines hercalculeerd  
3. **Data migratie** → Behoud van bestaande informatie

## Testing

### Test Scenario's:
1. **Nieuwe audit maken** → 23-12-2024, 10:30
2. **Actie aanmaken** → Deadline 24-12-2024 (Kritiek/Hoog)
3. **Detail bekijken** → Toont "23-12-2024, 10:30"

### Verwachte Resultaten:
- ✅ **Audit datum:** Werkelijke datum/tijd
- ✅ **Deadlines:** Correct berekend naar urgentie
- ✅ **Weergave:** Nederlandse datum/tijd formatting
- ✅ **Consistentie:** Alle acties gebruiken audit datum als startpunt

Het systeem gebruikt nu de **werkelijke tijd van audit invoer** als basis voor alle deadline berekeningen en toont deze correct in het Nederlandse formaat! 📅✅

