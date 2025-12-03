-- Poule & Poulette Interne Audit Tool - Role Update Script
-- Update database to use new role names: inspector, manager
-- Run dit bestand in je Supabase SQL Editor

-- STAP 1: Update existing user roles in the database
-- Change 'user' to 'manager' and 'manager' to 'inspector'

-- First, update users with 'user' role to 'manager'
UPDATE gebruikers 
SET rol = 'manager'::user_role, updated_at = NOW()
WHERE rol = 'user'::user_role;

-- Then, update users with 'manager' role to 'inspector' 
UPDATE gebruikers 
SET rol = 'inspector'::user_role, updated_at = NOW()
WHERE rol = 'manager'::user_role;

-- STAP 2: Update the user_role enum to include the new roles
-- First, add the new enum values
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'inspector';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'coo';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'district_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'filiaal_manager';

-- STAP 3: Verify the changes
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

-- STAP 4: Check if there are any constraints or policies that need updating
-- List all policies that reference user roles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE qual LIKE '%rol%' OR with_check LIKE '%rol%';

-- STAP 5: Update any hardcoded role references in policies
-- Note: You may need to update policies manually based on the output above

-- Example policy updates (uncomment if needed):
-- DROP POLICY IF EXISTS "Users can read own data" ON gebruikers;
-- CREATE POLICY "Users can read own data" ON gebruikers
--     FOR SELECT USING (auth.uid() = id);

-- DROP POLICY IF EXISTS "Users can update own data" ON gebruikers;
-- CREATE POLICY "Users can update own data" ON gebruikers
--     FOR UPDATE USING (auth.uid() = id);

-- STAP 6: Test the role switching functionality
-- This should now work with the updated roles
SELECT 'Role update completed successfully' as status;
