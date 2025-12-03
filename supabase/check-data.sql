-- Check of de data correct is toegevoegd
-- Run dit in je Supabase SQL Editor

-- Check gebruikers
SELECT 'Gebruikers:' as info;
SELECT id, user_id, naam, rol, actief FROM gebruikers ORDER BY created_at;

-- Check filialen
SELECT 'Filialen:' as info;
SELECT id, naam, locatie, status FROM filialen ORDER BY created_at;

-- Check audits
SELECT 'Audits:' as info;
SELECT id, filiaal_id, status, totale_score FROM audits ORDER BY created_at;

-- Check of ADMIN gebruiker bestaat
SELECT 'ADMIN gebruiker check:' as info;
SELECT * FROM gebruikers WHERE user_id = 'ADMIN';
