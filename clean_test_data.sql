-- Script om alle test data uit de database te verwijderen

-- First show what we are about to delete
DO $$
DECLARE
    action_count INTEGER;
    result_count INTEGER;
BEGIN
    RAISE NOTICE '=== CONTROLE VOOR CLEANUP ===';
    
    SELECT COUNT(*) INTO action_count
    FROM acties a
    WHERE a.beschrijving ILIKE '%test%' 
       OR a.titel ILIKE '%test%';
    
    SELECT COUNT(*) INTO result_count
    FROM audit_resultaten ar
    WHERE ar.opmerkingen ILIKE '%test%' 
       OR ar.verbeterpunt ILIKE '%test%';
    
    RAISE NOTICE 'Te verwijderen acties met test tekst: %', action_count;
    RAISE NOTICE 'Te verwijderen audit resultaten met test tekst: %', result_count;
END $$;

-- Clean audit_resultaten: Remove test from opmerkingen
UPDATE audit_resultaten 
SET opmerkingen = NULL
WHERE opmerkingen ILIKE '%test%';

-- Clean audit_resultaten: Remove test from verbeterpunt  
UPDATE audit_resultaten 
SET verbeterpunt = NULL
WHERE verbeterpunt ILIKE '%test%';

-- Clean acties: Remove test text from beschrijving
UPDATE acties 
SET beschrijving = REGEXP_REPLACE(
    REGEXP_REPLACE(beschrijving, '\s*Opmerkingen:\s*test.*$', '', 'g'),
    '\s*test.*$', 
    '', 
    'g'
)
WHERE beschrijving ILIKE '%test%';

-- Clean acties: Remove standalone "test" 
UPDATE acties 
SET beschrijving = '%Beschrijving nog niet ingevuld%'
WHERE TRIM(beschrijving) = ''
   OR TRIM(beschrijving) = 'Actie vereist:'
   OR beschrijving ILIKE '%test%';

-- Remove actions that are purely test data (if they exist)
DELETE FROM acties 
WHERE beschrijving ILIKE '%test%' 
  AND titel ILIKE '%test%';

-- Summary
DO $$
DECLARE
    remaining_actions INTEGER;
    remaining_results INTEGER;
BEGIN
    RAISE NOTICE '=== CLEANUP COMPLETE ===';
    
    SELECT COUNT(*) INTO remaining_actions
    FROM acties a
    WHERE a.beschrijving ILIKE '%test%' 
       OR a.titel ILIKE '%test%';
    
    SELECT COUNT(*) INTO remaining_results
    FROM audit_resultaten ar
    WHERE ar.opmerkingen ILIKE '%test%' 
       OR ar.verbeterpunt ILIKE '%test%';
    
    RAISE NOTICE 'Acties met test tekst nog over: %', remaining_actions;
    RAISE NOTICE 'Audit resultaten met test tekst nog over: %', remaining_results;
    
    IF remaining_actions = 0 AND remaining_results = 0 THEN
        RAISE NOTICE '✅ SUCCESS: Alle test data is verwijderd!';
    ELSE
        RAISE NOTICE '⚠️ WARNING: Er is nog test data over';
    END IF;
END $$;

