-- Test script voor rapport email fix zonder complexe loops
-- Dit script test alleen de hoofd functie zonder bestaande data updates

-- Test de hoofd functie
DO $$
DECLARE
    test_audit_id UUID;
    test_result RECORD;
BEGIN
    RAISE NOTICE '=== TEST REPORT EMAIL FUNCTION ===';
    
    -- Vind een recente audit om te testen
    SELECT id INTO test_audit_id
    FROM audits 
    WHERE status = 'completed'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF test_audit_id IS NOT NULL THEN
        RAISE NOTICE 'Test met audit: %', test_audit_id;
        
        -- Test de database functie
        BEGIN
            SELECT * INTO test_result
            FROM send_audit_report_to_relevant_emails(test_audit_id);
            
            RAISE NOTICE 'Succesvol - Audit % (%):', test_result.audit_id, test_result.filiaal_naam;
            RAISE NOTICE '- Filiaal email: %', test_result.filiaal_email;
            RAISE NOTICE '- Verzonden naar: %', array_to_string(test_result.all_recipients, ', ');
            
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Fout in functie: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'Geen completed audit gevonden om te testen';
    END IF;
END $$;

-- Test email mapping logica alleen
DO $$
DECLARE
    filiaal_record RECORD;
BEGIN
    RAISE NOTICE '=== TEST EMAIL MAPPING ===';
    
    FOR filiaal_record IN 
        SELECT 
            f.naam as filiaal_naam,
            f.email as filiaal_email,
            CASE 
                WHEN f.email = 'km11@poulepoulette.com' THEN 'CVH@POULEPOULETTE.COM'
                WHEN f.email = 'il36@poulepoulette.com' THEN 'JDM@POULEPOULETTE.COM'
                ELSE 'GEEN MATCH'
            END as management_email
        FROM filialen f
        LIMIT 3
    LOOP
        RAISE NOTICE '%: % → %', 
            filiaal_record.filiaal_naam,
            filiaal_record.filiaal_email,
            filiaal_record.management_email;
    END LOOP;
END $$;

RAISE NOTICE '=== TEST VOLTOOID ===';

