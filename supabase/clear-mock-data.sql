-- Verwijder alle mock data uit de database
-- Run dit in je Supabase SQL Editor

-- Verwijder alle data in de juiste volgorde (vanwege foreign keys)
DELETE FROM notificaties;
DELETE FROM acties;
DELETE FROM rapporten;
DELETE FROM audit_resultaten;
DELETE FROM audits;
DELETE FROM filialen;
DELETE FROM gebruikers;

-- Reset sequences (als je die gebruikt)
-- ALTER SEQUENCE gebruikers_id_seq RESTART WITH 1;
-- ALTER SEQUENCE filialen_id_seq RESTART WITH 1;
-- ALTER SEQUENCE audits_id_seq RESTART WITH 1;

-- Verificatie - controleer dat alle tabellen leeg zijn
SELECT 'Users' as table_name, COUNT(*) as count FROM gebruikers
UNION ALL
SELECT 'Filialen' as table_name, COUNT(*) as count FROM filialen
UNION ALL
SELECT 'Audits' as table_name, COUNT(*) as count FROM audits
UNION ALL
SELECT 'Audit Resultaten' as table_name, COUNT(*) as count FROM audit_resultaten
UNION ALL
SELECT 'Rapporten' as table_name, COUNT(*) as count FROM rapporten
UNION ALL
SELECT 'Acties' as table_name, COUNT(*) as count FROM acties
UNION ALL
SELECT 'Notificaties' as table_name, COUNT(*) as count FROM notificaties;

-- Bevestiging
SELECT 'Alle mock data succesvol verwijderd!' as status;
