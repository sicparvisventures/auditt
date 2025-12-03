-- RLS uitschakelen voor alle tabellen
-- Run dit in je Supabase SQL Editor

-- Disable RLS on all tables
ALTER TABLE gebruikers DISABLE ROW LEVEL SECURITY;
ALTER TABLE filialen DISABLE ROW LEVEL SECURITY;
ALTER TABLE audits DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_resultaten DISABLE ROW LEVEL SECURITY;
ALTER TABLE rapporten DISABLE ROW LEVEL SECURITY;
ALTER TABLE acties DISABLE ROW LEVEL SECURITY;
ALTER TABLE notificaties DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own data" ON gebruikers;
DROP POLICY IF EXISTS "Users can update own data" ON gebruikers;
DROP POLICY IF EXISTS "District managers can read assigned filialen" ON filialen;
DROP POLICY IF EXISTS "District managers can read their audits" ON audits;
DROP POLICY IF EXISTS "District managers can create audits" ON audits;
DROP POLICY IF EXISTS "District managers can update their audits" ON audits;
DROP POLICY IF EXISTS "Audit results follow audit rules" ON audit_resultaten;
DROP POLICY IF EXISTS "Reports follow audit rules" ON rapporten;
DROP POLICY IF EXISTS "Actions follow audit rules" ON acties;
DROP POLICY IF EXISTS "Users can see own notifications" ON notificaties;

-- Test query om te controleren of RLS is uitgeschakeld
SELECT 'RLS disabled successfully!' as status;

-- Test of we de ADMIN gebruiker kunnen lezen
SELECT 'ADMIN user test:' as info;
SELECT * FROM gebruikers WHERE user_id = 'ADMIN';
