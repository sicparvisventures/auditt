-- Poule & Poulette Interne Audit Tool - Fix Enum Step by Step
-- This script adds enum values step by step to avoid commit issues
-- Run dit bestand in je Supabase SQL Editor

-- STAP 1: Check current enum values
SELECT enumlabel as current_roles
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;

-- STAP 2: Add 'storemanager' enum value (run this first and commit)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'storemanager';

-- STAP 3: Add 'inspector' enum value (run this second and commit)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'inspector';

-- STAP 4: Add 'coo' enum value (run this third and commit)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'coo';

-- STAP 5: Add 'district_manager' enum value (run this fourth and commit)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'district_manager';

-- STAP 6: Add 'filiaal_manager' enum value (run this fifth and commit)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'filiaal_manager';

-- STAP 7: Show updated enum values
SELECT enumlabel as updated_roles
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;

-- STAP 8: Now safely update existing users (only if rol column exists)
DO $$ 
BEGIN
    -- Check if rol column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gebruikers' AND column_name = 'rol') THEN
        -- Update 'user' to 'storemanager' (only if 'user' exists)
        IF EXISTS (SELECT 1 FROM gebruikers WHERE rol::text = 'user') THEN
            UPDATE gebruikers 
            SET rol = 'storemanager'::user_role, updated_at = NOW()
            WHERE rol::text = 'user';
            RAISE NOTICE 'Updated user roles to storemanager';
        END IF;
        
        -- Update 'manager' to 'inspector' (but not admin)
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

-- STAP 9: Insert/Update default users with correct roles
-- Admin user
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip Van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  naam = EXCLUDED.naam,
  rol = EXCLUDED.rol,
  telefoon = EXCLUDED.telefoon,
  updated_at = NOW();

-- Inspector user (was manager)
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'MAN02', 'Inspector', 'inspector', '+32 123 456 791', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  naam = EXCLUDED.naam,
  rol = EXCLUDED.rol,
  telefoon = EXCLUDED.telefoon,
  updated_at = NOW();

-- Store Manager user (was user)
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'USER1', 'Store Manager', 'storemanager', '+32 123 456 792', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  naam = EXCLUDED.naam,
  rol = EXCLUDED.rol,
  telefoon = EXCLUDED.telefoon,
  updated_at = NOW();

-- STAP 10: Verify the changes
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

-- STAP 11: Success message
SELECT 'Enum values added and users updated successfully. Available roles: admin, inspector, storemanager' as status;
