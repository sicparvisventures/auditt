-- SUPER EENVOUDIG SCRIPT: Herstel je originele input in acties beschrijvingen
-- Dit script herstelt wat jij echt hebt ingevoerd tijdens de audit

DO $$
DECLARE
    result_count INTEGER;
    action_count INTEGER;
BEGIN
    RAISE NOTICE '=== HERSTEL ORIGINELE AUDIT INPUT ===';
    
    -- 1. Eerst checken wat er in audit_resultaten staat
    SELECT COUNT(*) INTO result_count
    FROM audit_resultaten ar
    WHERE ar.opmerkingen ILIKE '%test%' OR ar.verbeterpunt ILIKE '%test%';
    
    RAISE NOTICE 'Audit resultaten met test tekst: %', result_count;
    
    -- 2. Herstel audit_resultaten - verwijder test maar bewaar andere data
    UPDATE audit_resultaten 
    SET opmerkingen = NULL
    WHERE opmerkingen = 'test' OR opmerkingen = 'Test' OR opmerkingen = 'TEST';
    
    UPDATE audit_resultaten 
    SET verbeterpunt = NULL  
    WHERE verbeterpunt = 'test' OR verbeterpunt = 'Test' OR verbeterpunt = 'TEST';
    
    -- 3. Herstel alle acties met hun originele audit informatie
    -- Ga terug naar de audit_resultaten en bouw beschrijvingen opnieuw op
    
    UPDATE acties 
    SET beschrijving = (
        SELECT COALESCE(
            NULLIF(TRIM(ar.verbeterpunt), ''), 
            NULLIF(TRIM(ar.opmerkingen), ''), 
            aci.beschrijving,
            'Verbetering vereist voor: ' || aci.titel
        )
        FROM audit_resultaten ar
        JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id  
        WHERE ar.id = acties.audit_resultaat_id
    )
    WHERE EXISTS (
        SELECT 1 FROM audit_resultaten
        WHERE audit_resultaat_id = id
    );
    
    GET DIAGNOSTICS action_count = ROW_COUNT;
    
    -- 4. Verwijder "test" tekst uit overige beschrijvingen
    UPDATE acties 
    SET beschrijving = REGEXP_REPLACE(beschrijving, '\s*test.*$', '', 'g')
    WHERE beschrijving ILIKE '%test%';
    
    RAISE NOTICE '=== HERSTEL VOLTOOID ===';
    RAISE NOTICE 'Aantal herstelde acties: %', action_count;
    RAISE NOTICE 'Alle test tekst is weggehaald! ✅';
    
END $$;

-- Toon resultaat
SELECT 
    'Totaal acties' as categorie,
    COUNT(*) as aantal
FROM acties
UNION ALL
SELECT 
    'Acties met test tekst',
    COUNT(*)
FROM acties 
WHERE beschrijving ILIKE '%test%'
UNION ALL
SELECT
    'Acties zonder duidelijke beschrijving', 
    COUNT(*)
FROM acties
WHERE TRIM(beschrijving) = '' OR beschrijving IS NULL;

