-- Poule & Poulette Interne Audit Tool - Database Check
-- This script checks the current database structure
-- Run dit bestand in je Supabase SQL Editor om te zien wat er in je database staat

-- STAP 1: Check if gebruikers table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'gebruikers';

-- STAP 2: Check columns in gebruikers table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'gebruikers' 
ORDER BY ordinal_position;

-- STAP 3: Check if user_role enum exists
SELECT 
    typname as type_name,
    typtype as type_type
FROM pg_type 
WHERE typname = 'user_role';

-- STAP 4: Check enum values if they exist
SELECT 
    enumlabel as role_name,
    enumsortorder as sort_order
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;

-- STAP 5: Check existing users (if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gebruikers') THEN
        RAISE NOTICE 'Gebruikers table exists, showing current users:';
    ELSE
        RAISE NOTICE 'Gebruikers table does not exist';
    END IF;
END $$;

-- STAP 6: Show current users (if table exists and has data)
SELECT 
    id,
    user_id,
    naam,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gebruikers' AND column_name = 'rol') 
        THEN rol::text 
        ELSE 'rol column does not exist' 
    END as rol,
    telefoon,
    actief,
    created_at,
    updated_at
FROM gebruikers 
ORDER BY created_at;

-- STAP 7: Check for any other user-related tables
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE '%user%' OR table_name LIKE '%gebruiker%'
ORDER BY table_name;

-- STAP 8: Summary
SELECT 
    'Database check completed. Review the results above to understand your current database structure.' as message;
