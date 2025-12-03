-- EENVOUDIG SCRIPT: Verwijder "test opmerkingen" uit acties beschrijvingen
-- Dit script zorgt ervoor dat acties alleen jouw echte input tonen

DO $$
DECLARE
    updated_count INTEGER := 0;
    action_record RECORD;
BEGIN
    RAISE NOTICE '=== STATRTING CLEANUP VAN TEST OPMERKINGEN ===';
    
    -- Toon eerst wat gevonden wordt
    FOR action_record IN 
        SELECT id, titel, beschrijving 
        FROM acties 
        WHERE beschrijving ILIKE '%test%'
    LOOP
        RAISE NOTICE 'ACTIE %: "%" - "%"', 
            action_record.id, action_record.titel, action_record.beschrijving;
    END LOOP;
    
    -- Simpele fix: verwijder test tekst en maak beschrijvingen nuttig
    UPDATE acties 
    SET beschrijving = CASE 
        -- Als alleen test staat, vervang door iets nuttigs
        WHEN TRIM(beschrijving) ILIKE '%test%' AND LENGTH(TRIM(beschrijving)) < 20 THEN 
            'Actie vereist: Controle en verbetering van ' || 
            SUBSTRING(titel FROM 'Actie vereist: (.*)' OFFSET 16) || 
            ' volgens audit resultaten'
        -- Als test tussen andere tekst staat, verwijder test deel
        WHEN beschrijving ILIKE '%Opmerkingen: test%' THEN
            REGEXP_REPLACE(beschrijving, '\s*Opmerkingen:\s*test.*$', '', 'g')
        WHEN beschrijving ILIKE '%test opmerkingen%' THEN 
            REGEXP_REPLACE(beschrijving, '\s*test opmerkingen.*$', '', 'i')
        WHEN beschrijving ILIKE '%test.%' THEN
            REGEXP_REPLACE(beschrijving, '\s*test\..*$', '', 'i')
        -- Gebruik originele beschrijving zonder test deel
        ELSE 
            REGEXP_REPLACE(beschrijving, '\s*test.*$', '', 'i')
    END
    WHERE beschrijving ILIKE '%test%';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    RAISE NOTICE '=== CLEANUP VOLTOOID ===';
    RAISE NOTICE 'Aantal aangetaste acties: %', updated_count;
    
    -- Toon na cleaning
    IF updated_count > 0 THEN
        RAISE NOTICE '=== RESULTATEN NA CLEANUP ===';
        FOR action_record IN 
            SELECT id, titel, beschrijving 
            FROM acties 
            WHERE id IN (
                SELECT id FROM acties 
                WHERE beschrijving ILIKE '%test%'
                LIMIT 5
            )
        LOOP
            RAISE NOTICE 'NA: Actie %: "%"', action_record.id, action_record.beschrijving;
        END LOOP;
        
        RAISE NOTICE 'SUCCESS: Test opmerkingen zijn weggehaald! ✅';
    ELSE 
        RAISE NOTICE 'Geen acties met test tekst gevonden.';
    END IF;
END $$;

-- Extra check: toon een paar beschrijvingen om te zien hoe ze eruit zien
SELECT 
    titel,
    LEFT(beschrijving, 60) || '...' as preview_beschrijving
FROM acties 
LIMIT 5;

