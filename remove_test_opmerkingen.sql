-- Script om test opmerkingen te verwijderen uit acties
-- Dit script verwijdert alle "test" tekst uit opmerkingen en verbeterpunten

-- 1. Toon eerst wat er allemaal wordt aangetroffen
DO $$
DECLARE
    result_record RECORD;
    action_record RECORD;
BEGIN
    RAISE NOTICE '=== CONTROLEREN VAN TEST OPMERKINGEN ===';
    
    -- Check audit_resultaten voor test tekst
    FOR result_record IN 
        SELECT 
            ar.id,
            ar.opmerkingen,
            ar.verbeterpunt,
            aci.titel
        FROM audit_resultaten ar
        JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
        WHERE ar.opmerkingen ILIKE '%test%' 
           OR ar.verbeterpunt ILIKE '%test%'
    LOOP
        RAISE NOTICE 'AUDIT RESULTAAT % (%): Opmerkingen="%", Verbeterpunt="%"', 
            result_record.id,
            result_record.titel,
            result_record.opmerkingen,
            result_record.verbeterpunt;
    END LOOP;
    
    -- Check acties voor test tekst in beschrijving
    FOR action_record IN 
        SELECT 
            a.id,
            a.titel,
            a.beschrijving
        FROM acties a
        WHERE a.beschrijving ILIKE '%test%'
           OR a.titel ILIKE '%test%'
    LOOP
        RAISE NOTICE 'ACTIE %: "%" - "%"', 
            action_record.id,
            action_record.titel,
            action_record.beschrijving;
    END LOOP;

    RAISE NOTICE '=== CONTROL COMPLETE ===';
END $$;

-- 2. Verwijder test tekst uit audit_resultaten opmerkingen
UPDATE audit_resultaten 
SET opmerkingen = CASE 
    WHEN opmerkingen ILIKE '%test%' THEN NULL
    ELSE opmerkingen
END
WHERE opmerkingen ILIKE '%test%';

-- 3. Verwijder test tekst uit audit_resultaten verbeterpunt
UPDATE audit_resultaten 
SET verbeterpunt = CASE 
    WHEN verbeterpunt ILIKE '%test%' THEN NULL
    ELSE verbeterpunt
END
WHERE verbeterpunt ILIKE '%test%';

-- 4. Update acties beschrijvingen om test deel te verwijderen
UPDATE acties 
SET beschrijving = REGEXP_REPLACE(
    beschrijving, 
    '\s*Opmerkingen:\s*(test|Test|TEST)+.*$', 
    '', 
    'g'
)
WHERE beschrijving ILIKE '%test%';

-- 5. Extra cleaning: verwijder pure test strings
UPDATE acties 
SET beschrijving = TRIM(REGEXP_REPLACE(
    REGEXP_REPLACE(beschrijving, '\s*test\s*$', '', 'g'),
    '^\s*test\s*', 
    '', 
    'g'
))
WHERE beschrijving ILIKE '%test%';

-- 6. Verwijder acties die alleen "test" waren
DELETE FROM acties 
WHERE TRIM(LOWER(beschrijving)) = 'test';

-- 7. Final check
DO $$
DECLARE
    remaining_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_count
    FROM acties a
    WHERE a.beschrijving ILIKE '%test%';
    
    RAISE NOTICE '=== CLEANUP COMPLETE ===';
    RAISE NOTICE 'Acties met test tekst nog over: %', remaining_count;
    
    IF remaining_count = 0 THEN
        RAISE NOTICE 'SUCCESS: Alle test tekst is verwijderd!';
    ELSE
        RAISE NOTICE 'WARNING: Er zijn nog % acties met test tekst', remaining_count;
    END IF;
END $$;

