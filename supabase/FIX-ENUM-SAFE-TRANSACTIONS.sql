-- Poule & Poulette Interne Audit Tool - Safe Enum Transactions
-- This script fixes the enum commit issue by using completely separate transactions
-- Run dit bestand in je Supabase SQL Editor

-- TRANSACTION 1: Add 'storemanager' enum value
-- Run this FIRST and commit before proceeding
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'storemanager';

-- TRANSACTION 2: Add 'inspector' enum value  
-- Run this SECOND and commit before proceeding
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'inspector';

-- TRANSACTION 3: Add 'coo' enum value
-- Run this THIRD and commit before proceeding
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'coo';

-- TRANSACTION 4: Add 'district_manager' enum value
-- Run this FOURTH and commit before proceeding
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'district_manager';

-- TRANSACTION 5: Add 'filiaal_manager' enum value
-- Run this FIFTH and commit before proceeding
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'filiaal_manager';

-- TRANSACTION 6: Check enum values
-- Run this SIXTH to verify all values are added
SELECT enumlabel as current_roles
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;

-- TRANSACTION 7: Update existing users (SAFE - enum values already committed)
-- Run this SEVENTH after all enum values are committed
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

-- TRANSACTION 8: Insert/Update default users (SAFE - enum values already committed)
-- Run this EIGHTH after all enum values are committed
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip Van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  naam = EXCLUDED.naam,
  rol = EXCLUDED.rol,
  telefoon = EXCLUDED.telefoon,
  updated_at = NOW();

INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'MAN02', 'Inspector', 'inspector', '+32 123 456 791', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  naam = EXCLUDED.naam,
  rol = EXCLUDED.rol,
  telefoon = EXCLUDED.telefoon,
  updated_at = NOW();

INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'USER1', 'Store Manager', 'storemanager', '+32 123 456 792', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  naam = EXCLUDED.naam,
  rol = EXCLUDED.rol,
  telefoon = EXCLUDED.telefoon,
  updated_at = NOW();

-- TRANSACTION 9: Verify final result
-- Run this NINTH to check everything worked
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

-- Success message
SELECT 'Enum values added and users updated successfully. Available roles: admin, inspector, storemanager' as status;
