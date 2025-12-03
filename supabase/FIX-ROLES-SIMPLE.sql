-- Poule & Poulette Interne Audit Tool - Simple Role Fix
-- This script fixes the role system without breaking existing data
-- Run dit bestand in je Supabase SQL Editor

-- STAP 1: Check current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'gebruikers' 
ORDER BY ordinal_position;

-- STAP 2: Check if user_role enum exists and what values it has
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;

-- STAP 3: Add new enum values if they don't exist
DO $$ 
BEGIN
    -- Add inspector if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') AND enumlabel = 'inspector') THEN
        ALTER TYPE user_role ADD VALUE 'inspector';
    END IF;
    
    -- Add coo if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') AND enumlabel = 'coo') THEN
        ALTER TYPE user_role ADD VALUE 'coo';
    END IF;
    
    -- Add district_manager if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') AND enumlabel = 'district_manager') THEN
        ALTER TYPE user_role ADD VALUE 'district_manager';
    END IF;
    
    -- Add filiaal_manager if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') AND enumlabel = 'filiaal_manager') THEN
        ALTER TYPE user_role ADD VALUE 'filiaal_manager';
    END IF;
END $$;

-- STAP 4: Update existing users with new role names
-- Only update if the column exists
DO $$ 
BEGIN
    -- Check if rol column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gebruikers' AND column_name = 'rol') THEN
        -- Update 'user' to 'manager'
        UPDATE gebruikers 
        SET rol = 'manager'::user_role, updated_at = NOW()
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

-- Manager user (was user)
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'USER1', 'Manager', 'manager', '+32 123 456 792', true, NOW(), NOW())
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

-- STAP 7: Show current enum values
SELECT enumlabel as role_name
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;

-- STAP 8: Success message
SELECT 'Role fix completed successfully. New roles available: admin, inspector, manager' as status;
