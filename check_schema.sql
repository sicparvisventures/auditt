-- Check the actual database schema
-- Run this in Supabase SQL Editor to see what columns exist

-- Check gebruikers table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'gebruikers' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check filialen table structure  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'filialen' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

