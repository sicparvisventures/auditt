-- ÉÉNREGEL OPLOSSING: Verwijder "test opmerkingen" uit acties

-- Dit verwijdert alle "test" tekst uit acties beschrijvingen en maakt ze bruikbaar
UPDATE acties 
SET beschrijving = CASE 
    WHEN beschrijving ILIKE '%Opmerkingen: test%' THEN 
        REGEXP_REPLACE(beschrijving, '\s*Opmerkingen:\s*test.*$', '', 'g')
    WHEN beschrijving ILIKE '%test opmerkingen%' THEN 
        TRIM(REGEXP_REPLACE(beschrijving, '\s*-?\s*test opmerkingen.*$', '', 'i'))
    WHEN beschrijving = 'test' OR beschrijving = 'Test' OR beschrijving = 'TEST' THEN
        'Actie vereist volgens audit resultaten'
    ELSE 
        TRIM(REGEXP_REPLACE(beschrijving, '\s*test.*$', '', 'i'))
END
WHERE beschrijving ILIKE '%test%';

-- Controleer resultaat
SELECT COUNT(*) as "Acties met test tekst nog over" 
FROM acties 
WHERE beschrijving ILIKE '%test%';

