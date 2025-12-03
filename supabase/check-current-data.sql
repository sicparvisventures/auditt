-- Check huidige data in Supabase
-- Run dit in je Supabase SQL Editor om te zien wat er nu in de database staat

-- Check alle tabellen
SELECT 'Gebruikers' as tabel, COUNT(*) as aantal FROM gebruikers
UNION ALL
SELECT 'Filialen' as tabel, COUNT(*) as aantal FROM filialen
UNION ALL
SELECT 'Audits' as tabel, COUNT(*) as aantal FROM audits
UNION ALL
SELECT 'Audit Resultaten' as tabel, COUNT(*) as aantal FROM audit_resultaten
UNION ALL
SELECT 'Checklist Items' as tabel, COUNT(*) as aantal FROM audit_checklist_items
UNION ALL
SELECT 'Acties' as tabel, COUNT(*) as aantal FROM acties
UNION ALL
SELECT 'Rapporten' as tabel, COUNT(*) as aantal FROM rapporten
UNION ALL
SELECT 'Notificaties' as tabel, COUNT(*) as aantal FROM notificaties;

-- Check of er audits zijn
SELECT 'Huidige audits:' as info;
SELECT id, filiaal_id, audit_datum, status, totale_score, pass_percentage, opmerkingen 
FROM audits 
ORDER BY audit_datum DESC 
LIMIT 10;

-- Check of er checklist items zijn
SELECT 'Huidige checklist items:' as info;
SELECT COUNT(*) as aantal_items FROM audit_checklist_items;

-- Check of RLS is uitgeschakeld
SELECT 'RLS status:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('gebruikers', 'filialen', 'audits', 'audit_resultaten', 'audit_checklist_items', 'acties', 'rapporten', 'notificaties');
