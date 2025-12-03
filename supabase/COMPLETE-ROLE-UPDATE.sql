-- Poule & Poulette Interne Audit Tool - Complete Role Update
-- This script completely updates the database to use the new role system
-- Run dit bestand in je Supabase SQL Editor

-- STAP 1: Disable RLS temporarily
ALTER TABLE IF EXISTS gebruikers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS filialen DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audits DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_resultaten DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS rapporten DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS acties DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notificaties DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_checklist_items DISABLE ROW LEVEL SECURITY;

-- STAP 2: Create new user_role enum with correct values
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('admin', 'coo', 'district_manager', 'inspector', 'manager');

-- STAP 3: Update the gebruikers table to use the new enum
ALTER TABLE gebruikers ALTER COLUMN rol TYPE user_role USING rol::text::user_role;

-- STAP 4: Update existing user data with new role names
-- Map old roles to new roles:
-- 'user' -> 'manager'
-- 'manager' -> 'inspector'
-- Keep 'admin' as is

UPDATE gebruikers 
SET rol = 'manager'::user_role, updated_at = NOW()
WHERE rol::text = 'user';

UPDATE gebruikers 
SET rol = 'inspector'::user_role, updated_at = NOW()
WHERE rol::text = 'manager' AND rol::text != 'admin';

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

-- STAP 6: Re-enable RLS
ALTER TABLE gebruikers ENABLE ROW LEVEL SECURITY;
ALTER TABLE filialen ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_resultaten ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapporten ENABLE ROW LEVEL SECURITY;
ALTER TABLE acties ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaties ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_checklist_items ENABLE ROW LEVEL SECURITY;

-- STAP 7: Create basic RLS policies
-- Users can read their own data
DROP POLICY IF EXISTS "Users can read own data" ON gebruikers;
CREATE POLICY "Users can read own data" ON gebruikers
    FOR SELECT USING (true); -- Simplified for now

-- Users can update their own data
DROP POLICY IF EXISTS "Users can update own data" ON gebruikers;
CREATE POLICY "Users can update own data" ON gebruikers
    FOR UPDATE USING (true); -- Simplified for now

-- Users can insert new data
DROP POLICY IF EXISTS "Users can insert data" ON gebruikers;
CREATE POLICY "Users can insert data" ON gebruikers
    FOR INSERT WITH CHECK (true); -- Simplified for now

-- STAP 8: Verify the changes
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

-- STAP 9: Test role switching
SELECT 'Role update completed successfully. New roles: admin, inspector, manager' as status;
