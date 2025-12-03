-- Fix voor ontbrekende opmerkingen en verbeterpunten in audit detail view
-- Dit script controleert en repareert het probleem waarbij niet alle ingevulde 
-- opmerkingen en verbeterpunten worden getoond

-- STAP 1: Diagnostiek - controleer huidige situatie
DO $$
DECLARE
    audit_count INTEGER;
    results_count INTEGER;
    comments_count INTEGER;
    improvements_count INTEGER;
    empty_strings_count INTEGER;
BEGIN
    RAISE NOTICE '=== DIAGNOSTIEK AUDIT OPMERKINGEN ===';
    
    -- Tel aantal audits
    SELECT COUNT(*) INTO audit_count FROM audits;
    
    -- Tel aantal audit resultaten
    SELECT COUNT(*) INTO results_count FROM audit_resultaten;
    
    -- Tel aantal resultaten met opmerkingen (niet NULL en niet leeg)
    SELECT COUNT(*) INTO comments_count 
    FROM audit_resultaten 
    WHERE opmerkingen IS NOT NULL AND opmerkingen != '';
    
    -- Tel aantal resultaten met verbeterpunten (niet NULL en niet leeg)
    SELECT COUNT(*) INTO improvements_count 
    FROM audit_resultaten 
    WHERE verbeterpunt IS NOT NULL AND verbeterpunt != '';
    
    -- Tel aantal lege strings
    SELECT COUNT(*) INTO empty_strings_count 
    FROM audit_resultaten 
    WHERE opmerkingen = '' OR verbeterpunt = '';
    
    RAISE NOTICE 'Totaal audits: %', audit_count;
    RAISE NOTICE 'Totaal audit resultaten: %', results_count;
    RAISE NOTICE 'Resultaten met opmerkingen: %', comments_count;
    RAISE NOTICE 'Resultaten met verbeterpunten: %', improvements_count;
    RAISE NOTICE 'Lege strings gevonden: %', empty_strings_count;
    RAISE NOTICE '';
END $$;

-- STAP 2: Toon details van meest recente audit
DO $$
DECLARE
    rec RECORD;
    recent_audit_id UUID;
BEGIN
    RAISE NOTICE '=== DETAILS MEEST RECENTE AUDIT ===';
    
    -- Vind meest recente audit
    SELECT id INTO recent_audit_id 
    FROM audits 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    IF recent_audit_id IS NOT NULL THEN
        RAISE NOTICE 'Audit ID: %', recent_audit_id;
        
        -- Toon alle resultaten van deze audit
        FOR rec IN
            SELECT 
                aci.categorie,
                aci.titel,
                aci.volgorde,
                ar.resultaat,
                ar.score,
                CASE 
                    WHEN ar.opmerkingen IS NULL THEN '[NULL]'
                    WHEN ar.opmerkingen = '' THEN '[LEEG STRING]'
                    ELSE ar.opmerkingen
                END as opmerkingen_status,
                CASE 
                    WHEN ar.verbeterpunt IS NULL THEN '[NULL]'
                    WHEN ar.verbeterpunt = '' THEN '[LEEG STRING]'
                    ELSE ar.verbeterpunt
                END as verbeterpunt_status,
                array_length(ar.foto_urls, 1) as foto_count
            FROM audit_resultaten ar
            JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
            WHERE ar.audit_id = recent_audit_id
            ORDER BY aci.volgorde
        LOOP
            RAISE NOTICE '% - %: % | Opmerkingen: % | Verbeterpunt: % | Fotos: %',
                rec.categorie, rec.titel, rec.resultaat,
                rec.opmerkingen_status, rec.verbeterpunt_status, 
                COALESCE(rec.foto_count, 0);
        END LOOP;
    ELSE
        RAISE NOTICE 'Geen audits gevonden';
    END IF;
    RAISE NOTICE '';
END $$;

-- STAP 3: Repareer lege strings (converteer naar NULL voor consistentie)
DO $$
DECLARE
    updated_comments INTEGER := 0;
    updated_improvements INTEGER := 0;
BEGIN
    RAISE NOTICE '=== REPARATIE: LEGE STRINGS NAAR NULL ===';
    
    -- Update lege opmerkingen naar NULL
    UPDATE audit_resultaten 
    SET opmerkingen = NULL 
    WHERE opmerkingen = '' OR opmerkingen = ' ' OR opmerkingen = '  ';
    
    GET DIAGNOSTICS updated_comments = ROW_COUNT;
    RAISE NOTICE 'Lege opmerkingen geconverteerd naar NULL: %', updated_comments;
    
    -- Update lege verbeterpunten naar NULL
    UPDATE audit_resultaten 
    SET verbeterpunt = NULL 
    WHERE verbeterpunt = '' OR verbeterpunt = ' ' OR verbeterpunt = '  ';
    
    GET DIAGNOSTICS updated_improvements = ROW_COUNT;
    RAISE NOTICE 'Lege verbeterpunten geconverteerd naar NULL: %', updated_improvements;
END $$;

-- STAP 4: Controleer specifieke audit waar "test" werd ingevuld
DO $$
DECLARE
    rec RECORD;
    test_audit_id UUID;
BEGIN
    RAISE NOTICE '=== ZOEK AUDIT MET "test" OPMERKINGEN ===';
    
    -- Vind audit met "test" opmerkingen
    SELECT DISTINCT ar.audit_id INTO test_audit_id
    FROM audit_resultaten ar
    WHERE ar.opmerkingen ILIKE '%test%' OR ar.verbeterpunt ILIKE '%test%'
    ORDER BY ar.audit_id DESC
    LIMIT 1;
    
    IF test_audit_id IS NOT NULL THEN
        RAISE NOTICE 'Gevonden audit met test data: %', test_audit_id;
        
        -- Toon alle resultaten van deze audit
        FOR rec IN
            SELECT 
                aci.categorie,
                aci.titel,
                ar.resultaat,
                ar.opmerkingen,
                ar.verbeterpunt
            FROM audit_resultaten ar
            JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
            WHERE ar.audit_id = test_audit_id
            ORDER BY aci.volgorde
        LOOP
            RAISE NOTICE '% - %: Opmerkingen=[%] | Verbeterpunt=[%]',
                rec.categorie, rec.titel, 
                COALESCE(rec.opmerkingen, 'NULL'),
                COALESCE(rec.verbeterpunt, 'NULL');
        END LOOP;
    ELSE
        RAISE NOTICE 'Geen audit met "test" opmerkingen gevonden';
    END IF;
    RAISE NOTICE '';
END $$;

-- STAP 5: Test de frontend query
DO $$
DECLARE
    rec RECORD;
    test_audit_id UUID;
    result_count INTEGER := 0;
BEGIN
    RAISE NOTICE '=== TEST FRONTEND QUERY ===';
    
    -- Gebruik dezelfde audit als hierboven
    SELECT DISTINCT ar.audit_id INTO test_audit_id
    FROM audit_resultaten ar
    WHERE ar.opmerkingen ILIKE '%test%' OR ar.verbeterpunt ILIKE '%test%'
    ORDER BY ar.audit_id DESC
    LIMIT 1;
    
    IF test_audit_id IS NOT NULL THEN
        RAISE NOTICE 'Testing frontend query voor audit: %', test_audit_id;
        
        -- Simuleer exact dezelfde query als de frontend gebruikt
        FOR rec IN
            SELECT 
                ar.id,
                ar.audit_id,
                ar.checklist_item_id,
                ar.resultaat,
                ar.score,
                ar.opmerkingen,
                ar.foto_urls,
                ar.verbeterpunt,
                ar.created_at,
                json_build_object(
                    'id', aci.id,
                    'titel', aci.titel,
                    'beschrijving', aci.beschrijving,
                    'categorie', aci.categorie,
                    'gewicht', aci.gewicht
                ) as audit_checklist_items
            FROM audit_resultaten ar
            JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
            WHERE ar.audit_id = test_audit_id
            ORDER BY aci.volgorde
        LOOP
            result_count := result_count + 1;
            RAISE NOTICE 'Result %: % | Opmerkingen: % | Verbeterpunt: %',
                result_count, 
                (rec.audit_checklist_items->>'titel'),
                CASE 
                    WHEN rec.opmerkingen IS NOT NULL THEN rec.opmerkingen
                    ELSE '[NULL/LEEG]'
                END,
                CASE 
                    WHEN rec.verbeterpunt IS NOT NULL THEN rec.verbeterpunt
                    ELSE '[NULL/LEEG]'
                END;
        END LOOP;
        
        RAISE NOTICE 'Totaal resultaten: %', result_count;
    END IF;
    RAISE NOTICE '';
END $$;

-- STAP 6: Finale controle
DO $$
DECLARE
    rec RECORD;
BEGIN
    RAISE NOTICE '=== FINALE CONTROLE ===';
    
    FOR rec IN
        SELECT 
            a.id as audit_id,
            f.naam as filiaal_naam,
            a.audit_datum,
            COUNT(ar.id) as total_results,
            COUNT(CASE WHEN ar.opmerkingen IS NOT NULL THEN 1 END) as with_comments,
            COUNT(CASE WHEN ar.verbeterpunt IS NOT NULL THEN 1 END) as with_improvements
        FROM audits a
        JOIN filialen f ON a.filiaal_id = f.id
        LEFT JOIN audit_resultaten ar ON a.id = ar.audit_id
        GROUP BY a.id, f.naam, a.audit_datum
        HAVING COUNT(CASE WHEN ar.opmerkingen IS NOT NULL THEN 1 END) > 0
           OR COUNT(CASE WHEN ar.verbeterpunt IS NOT NULL THEN 1 END) > 0
        ORDER BY a.audit_datum DESC
        LIMIT 5
    LOOP
        RAISE NOTICE 'Audit % (%) - %: % resultaten, % met opmerkingen, % met verbeterpunten',
            rec.audit_id, rec.filiaal_naam, rec.audit_datum,
            rec.total_results, rec.with_comments, rec.with_improvements;
    END LOOP;
END $$;

-- STAP 7: Voeg constraint toe om lege strings te voorkomen (optioneel)
/*
-- Uncomment deze sectie als je wilt voorkomen dat lege strings worden opgeslagen
ALTER TABLE audit_resultaten 
ADD CONSTRAINT check_opmerkingen_not_empty 
CHECK (opmerkingen IS NULL OR LENGTH(TRIM(opmerkingen)) > 0);

ALTER TABLE audit_resultaten 
ADD CONSTRAINT check_verbeterpunt_not_empty 
CHECK (verbeterpunt IS NULL OR LENGTH(TRIM(verbeterpunt)) > 0);
*/

RAISE NOTICE '=== FIX VOLTOOID ===';
RAISE NOTICE 'Herlaad de audit detail pagina om te controleren of alle opmerkingen nu worden getoond.';

