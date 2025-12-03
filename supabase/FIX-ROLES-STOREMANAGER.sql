-- Poule & Poulette Interne Audit Tool - Fix Roles to Store Manager
-- This script fixes the user_role enum to use 'storemanager' instead of 'manager'
-- Run dit bestand in je Supabase SQL Editor

-- STAP 1: Check current enum values
SELECT enumlabel as current_roles
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;

-- STAP 2: Add 'storemanager' enum value if it doesn't exist
DO $$ 
BEGIN
    -- Add 'storemanager' if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') AND enumlabel = 'storemanager') THEN
        ALTER TYPE user_role ADD VALUE 'storemanager';
        RAISE NOTICE 'Added storemanager to user_role enum';
    END IF;
    
    -- Add 'inspector' if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') AND enumlabel = 'inspector') THEN
        ALTER TYPE user_role ADD VALUE 'inspector';
        RAISE NOTICE 'Added inspector to user_role enum';
    END IF;
    
    -- Add 'coo' if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') AND enumlabel = 'coo') THEN
        ALTER TYPE user_role ADD VALUE 'coo';
        RAISE NOTICE 'Added coo to user_role enum';
    END IF;
    
    -- Add 'district_manager' if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') AND enumlabel = 'district_manager') THEN
        ALTER TYPE user_role ADD VALUE 'district_manager';
        RAISE NOTICE 'Added district_manager to user_role enum';
    END IF;
    
    -- Add 'filiaal_manager' if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') AND enumlabel = 'filiaal_manager') THEN
        ALTER TYPE user_role ADD VALUE 'filiaal_manager';
        RAISE NOTICE 'Added filiaal_manager to user_role enum';
    END IF;
END $$;

-- STAP 3: Show updated enum values
SELECT enumlabel as updated_roles
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;

-- STAP 4: Update existing users with new role names (only if rol column exists)
DO $$ 
BEGIN
    -- Check if rol column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gebruikers' AND column_name = 'rol') THEN
        -- Update 'user' to 'storemanager'
        UPDATE gebruikers 
        SET rol = 'storemanager'::user_role, updated_at = NOW()
        WHERE rol::text = 'user';
        
        -- Update 'manager' to 'inspector' (but not admin)
        UPDATE gebruikers 
        SET rol = 'inspector'::user_role, updated_at = NOW()
        WHERE rol::text = 'manager' AND rol::text != 'admin';
        
        RAISE NOTICE 'Updated existing user roles';
    ELSE
        RAISE NOTICE 'Rol column does not exist in gebruikers table';
    END IF;
END $$;

-- STAP 5: Insert/Update default users with correct roles
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

-- STAP 6: Verify the changes
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

-- STAP 7: Success message
SELECT 'Role update completed successfully. Available roles: admin, inspector, storemanager' as status;
