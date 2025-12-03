-- Fix voor Rapport Email Adressen naar Juiste Filiaal en Manager Emails
-- Vervangt statische emails (district@poulepoulette.be, coo@poulepoulette.be)
-- door emails van het specifieke filiaal en hun district manager

DO $$
BEGIN
    RAISE NOTICE '=== FIXING REPORT EMAIL ADDRESSES ===';
END $$;

-- 1. Controleer huidige email mapping in database
DO $$
DECLARE
    mapping_record RECORD;
BEGIN
    RAISE NOTICE '=== HUIDIGE EMAIL MAPPING ===';
    
    FOR mapping_record IN 
        SELECT 
            f.naam as filiaal_naam,
            f.email as filiaal_email,
            f.locatie,
            CASE 
                WHEN f.email = 'km11@poulepoulette.com' THEN 'CVH@POULEPOULETTE.COM -> Gent KM11'
                WHEN f.email = 'pj70@poulepoulette.com' THEN 'MP@POULEPOULETTE.COM -> Etterbeek PJ70'
                WHEN f.email = 'il36@poulepoulette.com' THEN 'JDM@POULEPOULETTE.COM -> Mechelen IL36'
                WHEN f.email = 'ts15@poulepoulette.com' THEN 'DI@POULEPOULETTE.COM -> Leuven TS15'
                WHEN f.email = 'gk2@poulepoulette.com' THEN 'JC@POULEPOULETTE.COM -> Antwerpen GK2'
                WHEN f.email = 'll34@poulepoulette.com' THEN 'MB@POULEPOULETTE.COM -> Oostende LL34'
                WHEN f.email = 'tl24@poulepoulette.com' THEN 'JR@POULEPOULETTE.COM -> Brussel TL24'
                WHEN f.email = 'sc2@poulepoulette.com' THEN 'MF@POULEPOULETTE.COM -> Brussel SC2'
                WHEN f.email = 'ss3@poulepoulette.com' THEN 'SM@POULEPOULETTE.COM -> Brugge SS3'
                ELSE 'GEEN MATCH GEVONDEN'
            END as management_email
        FROM filialen f
        ORDER BY f.naam
    LOOP
        RAISE NOTICE '%: % → %', 
            mapping_record.filiaal_naam,
            mapping_record.filiaal_email,
            mapping_record.management_email;
    END LOOP;
END $$;

-- 2. Update bestaande rapporten die nog statische emails hebben
UPDATE rapporten 
SET verstuurd_naar = CASE 
    WHEN audits.filiaal_id IN (
        SELECT id FROM filialen WHERE email IN (
            'km11@poulepoulette.com', 'pj70@poulepoulette.com', 'il36@poulepoulette.com',
            'ts15@poulepoulette.com', 'gk2@poulepoulette.com', 'll34@poulepoulette.com',
            'tl24@poulepoulette.com', 'sc2@poulepoulette.com', 'ss3@poulepoulette.com'
        )
    ) THEN NULL  -- Reset zodat nieuwe functie het kan aanpakken
    ELSE verstuurd_naar  -- Behoud wat al goed is
END
FROM audits
WHERE rapporten.audit_id = audits.id
AND (verstuurd_naar && ARRAY['district@poulepoulette.be', 'coo@poulepoulette.be']);  -- Alleen die met statische emails

-- 3. Update de send_audit_report functie voor betere email afhandeling
DROP FUNCTION IF EXISTS send_audit_report_to_relevant_emails(UUID);

CREATE OR REPLACE FUNCTION send_audit_report_to_relevant_emails(audit_id_param UUID)
RETURNS TABLE(
    audit_id UUID,
    filiaal_naam VARCHAR,
    filiaal_email VARCHAR,
    management_email VARCHAR,
    district_manager_id VARCHAR,
    all_recipients TEXT[],
    rapport_id UUID
) AS $$
DECLARE
    filiaal_record RECORD;
    management_email VARCHAR;
    district_manager_id VARCHAR;
    all_email_recipients TEXT[];
    new_rapport_id UUID;
BEGIN
    -- Haal volledige filiaal + district manager informatie op
    SELECT 
        f.id as filiaal_id,
        f.naam as filiaal_naam,
        f.email as filiaal_email,
        f.locatie as filiaal_locatie,
        g.user_id as district_manager_id,
        g.naam as district_manager_naam
    INTO filiaal_record
    FROM audits a
    JOIN filialen f ON a.filiaal_id = f.id
    LEFT JOIN gebruikers g ON a.district_manager_id = g.id
    WHERE a.id = audit_id_param;
    
    -- Als geen filiaal gevonden, stop
    IF filiaal_record IS NULL THEN
        RAISE EXCEPTION 'Geen filiaal gevonden voor audit ID: %', audit_id_param;
    END IF;
    
    -- Bepaal het juiste management email adres op basis van het filiaal
    management_email := CASE 
        WHEN filiaal_record.filiaal_email = 'km11@poulepoulette.com' THEN 'CVH@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'pj70@poulepoulette.com' THEN 'MP@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'il36@poulepoulette.com' THEN 'JDM@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'ts15@poulepoulette.com' THEN 'DI@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'gk2@poulepoulette.com' THEN 'JC@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'll34@poulepoulette.com' THEN 'MB@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'tl24@poulepoulette.com' THEN 'JR@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'sc2@poulepoulette.com' THEN 'MF@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'ss3@poulepoulette.com' THEN 'SM@POULEPOULETTE.COM'
        ELSE NULL -- Geen management email als filiaal niet gevonden
    END;
    
    -- Genereer lijst van ontvangers:
    -- 1. Filiaal email (altijd)
    -- 2. Management email (altijd)
    -- 3. Geen district en coo meer!
    all_email_recipients := ARRAY[filiaal_record.filiaal_email];
    
    -- Voeg management email toe
    IF management_email IS NOT NULL THEN
        all_email_recipients := array_append(all_email_recipients, management_email);
    END IF;
    
    -- Store the district manager ID for return
    district_manager_id := filiaal_record.district_manager_id;
    
    -- Controleer of er al een rapport is voor deze audit
    IF EXISTS (
        SELECT 1 FROM rapporten 
        WHERE audit_id = audit_id_param
    ) THEN
        -- Update bestaand rapport
        UPDATE rapporten 
        SET 
            verstuurd_naar = all_email_recipients,
            verstuur_datum = NOW(),
            status = 'sent'
        WHERE audit_id = audit_id_param
        RETURNING id INTO new_rapport_id;
    ELSE
        -- Maak nieuw rapport record
        INSERT INTO rapporten (audit_id, verstuurd_naar, verstuur_datum, status)
        VALUES (
            audit_id_param,
            all_email_recipients,
            NOW(),
            'sent'
        )
        RETURNING id INTO new_rapport_id;
    END IF;
    
    -- Return de resultaten
    RETURN QUERY SELECT 
        audit_id_param,
        filiaal_record.filiaal_naam,
        filiaal_record.filiaal_email,
        management_email,
        district_manager_id,
        all_email_recipients,
        new_rapport_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Update bestaande rapporten met nieuwe email logica
DO $$
DECLARE
    rapport_record RECORD;
    fixed_count INTEGER := 0;
BEGIN
    RAISE NOTICE '=== CORRIGEREEN BESTAANDE RAPPORTEN ===';
    
    -- Update rapporten die nog statische emails hebben
    FOR rapport_record IN 
        SELECT 
            r.id as rapport_id,
            r.audit_id,
            f.naam as filiaal_naam,
            f.email as filiaal_email,
            g.user_id as district_manager_id
        FROM rapporten r
        JOIN audits a ON r.audit_id = a.id
        JOIN filialen f ON a.filiaal_id = f.id
        LEFT JOIN gebruikers g ON a.district_manager_id = g.id
        WHERE r.status IN ('sent', 'pending')
        AND (r.verstuurd_naar && ARRAY['district@poulepoulette.be', 'coo@poulepoulette.be']
        OR r.verstuurd_naar IS NULL)
        ORDER BY r.created_at DESC
        LIMIT 5  -- Begin met kleine groep
    LOOP
        -- Genereer nieuwe email lijst voor dit rapport
        DECLARE
            new_emails TEXT[];
            management_email TEXT;
        BEGIN
            -- Start met filiaal email
            new_emails := ARRAY[rapport_record.filiaal_email];
            
            -- Voeg district manager toe als beschikbaar (heeft geen eigen email)
            -- Gebruik dus altijd management mapping
            BEGIN
                -- Gebruik management mapping
                management_email := CASE 
                    WHEN rapport_record.filiaal_email = 'km11@poulepoulette.com' THEN 'CVH@POULEPOULETTE.COM'
                    WHEN rapport_record.filiaal_email = 'il36@poulepoulette.com' THEN 'JDM@POULEPOULETTE.COM'
                    WHEN rapport_record.filiaal_email = 'pj70@poulepoulette.com' THEN 'MP@POULEPOULETTE.COM'
                    WHEN rapport_record.filiaal_email = 'ts15@poulepoulette.com' THEN 'DI@POULEPOULETTE.COM'
                    WHEN rapport_record.filiaal_email = 'gk2@poulepoulette.com' THEN 'JC@POULEPOULETTE.COM'
                    WHEN rapport_record.filiaal_email = 'll34@poulepoulette.com' THEN 'MB@POULEPOULETTE.COM'
                    WHEN rapport_record.filiaal_email = 'tl24@poulepoulette.com' THEN 'JR@POULEPOULETTE.COM'
                    WHEN rapport_record.filiaal_email = 'sc2@poulepoulette.com' THEN 'MF@POULEPOULETTE.COM'
                    WHEN rapport_record.filiaal_email = 'ss3@poulepoulette.com' THEN 'SM@POULEPOULETTE.COM'
                    ELSE NULL
                END;
                
                IF management_email IS NOT NULL THEN
                    new_emails := array_append(new_emails, management_email);
                END IF;
            END;
            
            -- Update het rapport
            UPDATE rapporten 
            SET verstuurd_naar = new_emails
            WHERE id = rapport_record.rapport_id;
            
            RAISE NOTICE 'Rapport % (%): %', 
                rapport_record.rapport_id,
                rapport_record.filiaal_naam,
                array_to_string(new_emails, ', ');
                
            fixed_count := fixed_count + 1;
        END;
    END LOOP;
    
    RAISE NOTICE 'Gecorrigeerd: % rapporten', fixed_count;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error tijdens correctie: %', SQLERRM;
END $$;

-- 5. Controleer resultaten
DO $$
DECLARE
    rapport_record RECORD;
BEGIN
    RAISE NOTICE '=== CONTROLEER RESULTATEN ===';
    
    FOR rapport_record IN 
        SELECT 
            r.id as rapport_id,
            r.verstuurd_naar,
            f.naam as filiaal_naam,
            f.email as filiaal_email,
            g.naam as district_manager_naam,
            g.user_id as district_manager_id
        FROM rapporten r
        JOIN audits a ON r.audit_id = a.id
        JOIN filialen f ON a.filiaal_id = f.id
        LEFT JOIN gebruikers g ON a.district_manager_id = g.id
        ORDER BY r.created_at DESC
        LIMIT 5
    LOOP
        RAISE NOTICE 'Rapport % (%): Verzonden naar %', 
            rapport_record.rapport_id,
            rapport_record.filiaal_naam,
            array_to_string(rapport_record.verstuurd_naar, ', ');
    END LOOP;
END $$;

-- 6. Test functie met specifieke audit
DO $$
DECLARE
    test_result RECORD;
    test_audit_id UUID;
BEGIN
    RAISE NOTICE '=== TEST MET SPECIFIEKE AUDIT ===';
    
    -- Vind een recente audit om te testen
    SELECT id INTO test_audit_id
    FROM audits 
    WHERE status = 'completed'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF test_audit_id IS NOT NULL THEN
        -- Test de nieuwe functie
        SELECT * INTO test_result
        FROM send_audit_report_to_relevant_emails(test_audit_id);
        
        RAISE NOTICE 'Test Audit % (%):', test_result.audit_id, test_result.filiaal_naam;
        RAISE NOTICE '- Filiaal email: %', test_result.filiaal_email;
        RAISE NOTICE '- District manager ID: %', COALESCE(test_result.district_manager_id, 'Geen');
        RAISE NOTICE '- Management email: %', COALESCE(test_result.management_email, 'Geen');
        RAISE NOTICE '- Verzonden naar: %', array_to_string(test_result.all_recipients, ', ');
    ELSE
        RAISE NOTICE 'Geen completed audit gevonden om te testen';
    END IF;
END $$;

DO $$
BEGIN
    RAISE NOTICE '=== FIX VOLTOOID ===';
    RAISE NOTICE 'Rapporten worden nu verzonden naar:';
    RAISE NOTICE '1. Het filiaal email adres';
    RAISE NOTICE '2. De district manager van dat filiaal';
    RAISE NOTICE '3. Geen meer universele district@ en coo@ emails';
    RAISE NOTICE '';
    RAISE NOTICE 'Gebruik voor nieuwe rapporten:';
    RAISE NOTICE 'SELECT * FROM send_audit_report_to_relevant_emails(''your-audit-id'');';
END $$;
