-- Poule & Poulette Interne Audit Tool - Quick Setup
-- Run dit bestand in je Supabase SQL editor voor snelle setup

-- 1. Schema toepassen
\i schema-production.sql

-- 2. Seed data toepassen  
\i seed-production.sql

-- 3. Storage bucket aanmaken
INSERT INTO storage.buckets (id, name, public) VALUES ('audit-files', 'audit-files', true);

-- 4. Storage policies instellen
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can upload audit files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'audit-files' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can view audit files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'audit-files' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can update audit files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'audit-files' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can delete audit files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'audit-files' AND
        auth.role() = 'authenticated'
    );

-- 5. Verificatie queries
SELECT 'Setup completed successfully!' as status;

SELECT 
    'Users' as table_name, 
    COUNT(*) as count 
FROM gebruikers
UNION ALL
SELECT 
    'Filialen' as table_name, 
    COUNT(*) as count 
FROM filialen
UNION ALL
SELECT 
    'Audits' as table_name, 
    COUNT(*) as count 
FROM audits
UNION ALL
SELECT 
    'Actions' as table_name, 
    COUNT(*) as count 
FROM acties
UNION ALL
SELECT 
    'Notifications' as table_name, 
    COUNT(*) as count 
FROM notificaties;

-- 6. Test data
SELECT 
    u.naam,
    u.rol,
    f.naam as filiaal_naam,
    a.audit_datum,
    a.totale_score,
    a.pass_percentage
FROM audits a
JOIN gebruikers u ON a.district_manager_id = u.id
JOIN filialen f ON a.filiaal_id = f.id
ORDER BY a.audit_datum DESC
LIMIT 5;
