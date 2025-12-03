-- Poule & Poulette Interne Audit Tool - ADD DEVELOPER ROLE
-- Dit script voegt de 'developer' rol toe aan de user_role enum en zorgt ervoor dat deze alleen voor Dietmar beschikbaar is.
-- BELANGRIJK: Voer dit script uit in aparte transacties om "unsafe use of new value" fouten te voorkomen.

-- STAP 1: Voeg 'developer' toe aan user_role enum als deze nog niet bestaat
-- VOER DIT EERST UIT ALS APARTE TRANSACTIE
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

-- STAP 2: Wacht even en voer dan dit uit als NIEUWE TRANSACTIE
-- VOER DIT UIT NA STAP 1 (als aparte transactie)
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

-- STAP 3: Verifieer dat de developer rol is toegevoegd
SELECT 'Developer role added to enum:' as status;
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') ORDER BY enumsortorder;

-- STAP 4: Verifieer dat Dietmar is toegevoegd met developer rol
SELECT 'Dietmar user with developer role:' as status;
SELECT id, user_id, naam, rol, telefoon, actief FROM gebruikers WHERE user_id = 'DIETMAR';

-- STAP 5: Toon alle beschikbare rollen
SELECT 'All available user roles:' as status;
SELECT enumlabel as role_name FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') ORDER BY enumsortorder;

-- STAP 6: Toon alle gebruikers met hun rollen
SELECT 'All users with their roles:' as status;
SELECT id, user_id, naam, rol, telefoon, actief, created_at FROM gebruikers ORDER BY created_at;

-- STAP 7: Finale melding
DO $$ BEGIN
    RAISE NOTICE 'Developer role successfully added and Dietmar Lattré configured with developer role.';
    RAISE NOTICE 'Note: The developer role is exclusive to Dietmar and should not be assigned to other users.';
END $$;
