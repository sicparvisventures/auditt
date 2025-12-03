# Final Enum Fix Instructions

## Probleem
De database geeft de fout: `ERROR: 55P04: unsafe use of new value "storemanager" of enum type user_role`

## Oplossing
Voer de SQL-statements **stap voor stap** uit in de Supabase SQL Editor. Elke stap moet in een **aparte transactie** worden uitgevoerd.

### Stap 1: Controleer huidige enum waarden
```sql
SELECT enumlabel as current_roles
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;
```
**Klik op "Run" en wacht tot het voltooid is.**

### Stap 2: Voeg 'storemanager' toe (EERSTE TRANSACTIE)
```sql
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'storemanager';
```
**Klik op "Run" en wacht tot het voltooid is.**

### Stap 3: Voeg 'inspector' toe (TWEEDE TRANSACTIE)
```sql
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'inspector';
```
**Klik op "Run" en wacht tot het voltooid is.**

### Stap 4: Voeg 'coo' toe (DERDE TRANSACTIE)
```sql
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'coo';
```
**Klik op "Run" en wacht tot het voltooid is.**

### Stap 5: Voeg 'district_manager' toe (VIERDE TRANSACTIE)
```sql
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'district_manager';
```
**Klik op "Run" en wacht tot het voltooid is.**

### Stap 6: Voeg 'filiaal_manager' toe (VIJFDE TRANSACTIE)
```sql
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'filiaal_manager';
```
**Klik op "Run" en wacht tot het voltooid is.**

### Stap 7: Controleer de enum waarden
```sql
SELECT enumlabel as updated_roles
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;
```
**Klik op "Run" en wacht tot het voltooid is.**

### Stap 8: Update bestaande gebruikers (ZESDE TRANSACTIE)
```sql
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gebruikers' AND column_name = 'rol') THEN
        IF EXISTS (SELECT 1 FROM gebruikers WHERE rol::text = 'user') THEN
            UPDATE gebruikers 
            SET rol = 'storemanager'::user_role, updated_at = NOW()
            WHERE rol::text = 'user';
            RAISE NOTICE 'Updated user roles to storemanager';
        END IF;
        
        IF EXISTS (SELECT 1 FROM gebruikers WHERE rol::text = 'manager' AND rol::text != 'admin') THEN
            UPDATE gebruikers 
            SET rol = 'inspector'::user_role, updated_at = NOW()
            WHERE rol::text = 'manager' AND rol::text != 'admin';
            RAISE NOTICE 'Updated manager roles to inspector';
        END IF;
    ELSE
        RAISE NOTICE 'Rol column does not exist in gebruikers table';
    END IF;
END $$;
```
**Klik op "Run" en wacht tot het voltooid is.**

### Stap 9: Voeg standaardgebruikers toe (ZEVENDE TRANSACTIE)
```sql
-- Admin user
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip Van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  naam = EXCLUDED.naam,
  rol = EXCLUDED.rol,
  telefoon = EXCLUDED.telefoon,
  updated_at = NOW();

-- Inspector user
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'MAN02', 'Inspector', 'inspector', '+32 123 456 791', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  naam = EXCLUDED.naam,
  rol = EXCLUDED.rol,
  telefoon = EXCLUDED.telefoon,
  updated_at = NOW();

-- Store Manager user
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'USER1', 'Store Manager', 'storemanager', '+32 123 456 792', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  naam = EXCLUDED.naam,
  rol = EXCLUDED.rol,
  telefoon = EXCLUDED.telefoon,
  updated_at = NOW();
```
**Klik op "Run" en wacht tot het voltooid is.**

### Stap 10: Controleer het resultaat
```sql
SELECT 
    id,
    user_id,
    naam,
    rol,
    telefoon,
    actief,
    created_at,
    updated_at
FROM gebruikers 
ORDER BY created_at;
```
**Klik op "Run" en wacht tot het voltooid is.**

## Belangrijk
- Voer elke stap **afzonderlijk** uit
- Wacht tot elke stap voltooid is voordat je de volgende uitvoert
- Controleer na elke stap of er geen errors zijn
- Elke stap moet in een **aparte transactie** worden uitgevoerd

## Na voltooiing
- Test de applicatie op localhost
- Upload de nieuwe build naar Cloudflare Pages
- Test alle functionaliteiten

## Troubleshooting
Als je nog steeds de fout krijgt:
1. Controleer of alle enum waarden zijn toegevoegd
2. Controleer of de gebruikers tabel bestaat
3. Controleer of de rol kolom bestaat
4. Voer de stappen opnieuw uit in de juiste volgorde
