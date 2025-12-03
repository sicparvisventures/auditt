# Fix voor Rapport Email Adressen

## Probleem Opgelost
Rapporten werden altijd verzonden naar statische email adressen (`district@poulepoulette.be`, `coo@poulepoulette.be`) in plaats van naar het specifieke filiaal en hun district manager.

## Oplossing Geïmplementeerd

### **Voor:**
- 📧 **Verzonden naar:** `district@poulepoulette.be, coo@poulepoulette.be` (static)
- 📍 **Alle filialen** kregen dezelfde standaard emails
- ❌ **Niet persoonsgebonden** - geen specifieke manager per filiaal

### **Na:**
- 📧 **Verzonden naar:** Filiaal email + District Manager email (dynamic)
- 📍 **Elk filiaal** krijgt eigen specifieke emails
- ✅ **Persoonsgebonden** - juiste manager voor elk filiaal

## Technische Implementatie

### 1. Database Functie Update

#### **Nieuwe Database Functie:**
```sql
CREATE OR REPLACE FUNCTION send_audit_report_to_relevant_emails(audit_id_param UUID)
RETURNS TABLE(
    audit_id UUID,
    filiaal_naam VARCHAR,
    filiaal_email VARCHAR,
    management_email VARCHAR,
    district_manager_email VARCHAR,
    all_recipients TEXT[],
    rapport_id UUID
)
```

#### **Intelligente Email Mapping:**
```sql
-- Genereer ontvangers:
-- 1. Filiaal email (altijd)
-- 2. District manager email (als beschikbaar)
-- 3. Management mapping als backup
all_email_recipients := ARRAY[filiaal_email];

-- Voeg district manager toe als beschikbaar
IF district_manager_email IS NOT NULL THEN
    all_email_recipients := array_append(all_email_recipients, district_manager_email);
ELSE
    -- Voeg management mapping toe als backup
    all_email_recipients := array_append(all_email_recipients, management_email);
END IF;
```

### 2. Email Mapping Logic

#### **Filiaal-Specifieke Managers:**
| Filiaal | Email | Manager Email |
|---------|-------|---------------|
| Gent KM11 | km11@poulepoulette.com | CVH@POULEPOULETTE.COM |
| Etterbeek PJ70 | pj70@poulepoulette.com | MP@POULEPOULETTE.COM |
| Mechelen IL36 | il36@poulepoulette.com | JDM@POULEPOULETTE.COM |
| Leuven TS15 | ts15@poulepoulette.com | DI@POULEPOULETTE.COM |
| Antwerpen GK2 | gk2@poulepoulette.com | JC@POULEPOULETTE.COM |
| Oostende LL34 | ll34@poulepoulette.com | MB@POULEPOULETTE.COM |
| Brussel TL24 | tl24@poulepoulette.com | JR@POULEPOULETTE.COM |
| Brussel SC2 | sc2@poulepoulette.com | MF@POULEPOULETTE.COM |
| Brugge SS3 | ss3@poulepoulette.com | SM@POULEPOULETTE.COM |

### 3. Backend Service Update

</parameter>
<parameter name="explanation">Describe the new backend service function for sending reports

