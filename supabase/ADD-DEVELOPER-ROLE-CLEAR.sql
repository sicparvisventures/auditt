-- Poule & Poulette Interne Audit Tool - ADD DEVELOPER ROLE (CLEAR INSTRUCTIONS)
-- Dit script voegt de 'developer' rol toe aan de user_role enum en configureert Dietmar.
-- BELANGRIJK: Voer elke stap uit als aparte transactie in de Supabase SQL Editor.

-- ========================================
-- STAP 1: Voeg 'developer' toe aan user_role enum
-- ========================================
-- Kopieer ALLEEN de volgende regels (vanaf DO tot END $$;) en plak in Supabase SQL Editor:

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
-- STAP 2: Wacht 5 seconden en voer dan dit uit
-- ========================================
-- Kopieer ALLEEN de volgende regels (vanaf DO tot END $$;) en plak in Supabase SQL Editor:
-- Wacht minimaal 5 seconden tussen STAP 1 en STAP 2

DO $$ BEGIN
    INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
    VALUES (
        '00000000-0000-0000-0000-000000000005',
        'DIET',
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
-- Kopieer de volgende regels en plak in Supabase SQL Editor om te controleren:

SELECT 'Available user roles:' as status;
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') ORDER BY enumsortorder;

SELECT 'Dietmar user:' as status;
SELECT id, user_id, naam, rol, telefoon, actief, created_at FROM gebruikers WHERE user_id = 'DIET';

SELECT 'All users:' as status;
SELECT id, user_id, naam, rol, telefoon, actief, created_at FROM gebruikers ORDER BY created_at;
