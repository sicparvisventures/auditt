-- Poule & Poulette Interne Audit Tool - ADD DEVELOPER ROLE (SEPARATE TRANSACTIONS)
-- Dit script voegt de 'developer' rol toe aan de user_role enum en configureert Dietmar.
-- BELANGRIJK: Voer elke stap uit als aparte transactie in de Supabase SQL Editor.

-- ========================================
-- STAP 1: Voeg 'developer' toe aan user_role enum
-- ========================================
-- Kopieer en plak dit in de Supabase SQL Editor en voer uit:
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum e 
        JOIN pg_type t ON e.enumtypid = t.oid 
        WHERE t.typname = 'user_role' AND e.enumlabel = 'developer'
    ) THEN
        ALTER TYPE user_role ADD VALUE 'developer';
        RAISE NOTICE 'Added enum value: developer';
    ELSE
        RAISE NOTICE 'Enum value developer already exists';
    END IF;
END $$;

-- ========================================
-- STAP 2: Voeg Dietmar Lattré toe met developer rol
-- ========================================
-- Kopieer en plak dit in de Supabase SQL Editor en voer uit (NA STAP 1):
DO $$ BEGIN
    -- Voeg Dietmar Lattré toe met developer rol als deze nog niet bestaat
    INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
    VALUES (
        '00000000-0000-0000-0000-000000000005',
        'DIETMAR',
        'Dietmar Lattré',
        'developer'::user_role,
        '+32 123 456 793',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        naam = EXCLUDED.naam,
        rol = EXCLUDED.rol,
        telefoon = EXCLUDED.telefoon,
        actief = EXCLUDED.actief,
        updated_at = NOW();
    
    RAISE NOTICE 'Dietmar Lattré configured with developer role';
END $$;

-- ========================================
-- STAP 3: Verificatie (optioneel)
-- ========================================
-- Kopieer en plak dit in de Supabase SQL Editor om te controleren:

-- Controleer enum waarden
SELECT 'Available user roles:' as status;
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') ORDER BY enumsortorder;

-- Controleer Dietmar gebruiker
SELECT 'Dietmar user:' as status;
SELECT id, user_id, naam, rol, telefoon, actief, created_at FROM gebruikers WHERE user_id = 'DIETMAR';

-- Toon alle gebruikers
SELECT 'All users:' as status;
SELECT id, user_id, naam, rol, telefoon, actief, created_at FROM gebruikers ORDER BY created_at;
