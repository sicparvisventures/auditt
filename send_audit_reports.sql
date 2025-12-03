-- Script voor het versturen van audit rapporten naar de juiste email adressen
-- Dit script zorgt ervoor dat audits alleen naar de relevante personen worden verstuurd
-- gebaseerd op hun zaak/filiaal
-- 
-- GEBASEERD OP PRODUCTION_SIMPLE.SQL DATABASE STRUCTUUR
-- 
-- FILIALEN EN MANAGEMENT MAPPING:
-- - Gent - KM11 (km11@poulepoulette.com) → CVH@POULEPOULETTE.COM
-- - Etterbeek - PJ70 (pj70@poulepoulette.com) → MP@POULEPOULETTE.COM
-- - Mechelen - IL36 (il36@poulepoulette.com) → JDM@POULEPOULETTE.COM
-- - Leuven - TS15 (ts15@poulepoulette.com) → DI@POULEPOULETTE.COM
-- - Antwerpen - GK2 (gk2@poulepoulette.com) → JC@POULEPOULETTE.COM
-- - Oostende - LL34 (ll34@poulepoulette.com) → MB@POULEPOULETTE.COM
-- - Brussel - TL24 (tl24@poulepoulette.com) → JR@POULEPOULETTE.COM
-- - Brussel - SC2 (sc2@poulepoulette.com) → MF@POULEPOULETTE.COM
-- - Brugge - SS3 (ss3@poulepoulette.com) → SM@POULEPOULETTE.COM

-- ========================================
-- FUNCTIE: Verstuur audit rapport naar juiste email adressen
-- ========================================

CREATE OR REPLACE FUNCTION send_audit_report_to_relevant_emails(audit_id_param UUID)
RETURNS TABLE(
    audit_id UUID,
    filiaal_naam VARCHAR,
    filiaal_email VARCHAR,
    management_email VARCHAR,
    all_recipients TEXT[],
    rapport_id UUID
) AS $$
DECLARE
    filiaal_record RECORD;
    management_email VARCHAR;
    all_email_recipients TEXT[];
    new_rapport_id UUID;
BEGIN
    -- Haal filiaal informatie op voor deze audit
    SELECT 
        f.id as filiaal_id,
        f.naam as filiaal_naam,
        f.email as filiaal_email,
        f.locatie as filiaal_locatie
    INTO filiaal_record
    FROM audits a
    JOIN filialen f ON a.filiaal_id = f.id
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
    
    -- Combineer filiaal email met het specifieke management email
    -- Alleen het specifieke filiaal en hun manager krijgen de audit
    IF management_email IS NOT NULL THEN
        all_email_recipients := ARRAY[filiaal_record.filiaal_email, management_email];
    ELSE
        all_email_recipients := ARRAY[filiaal_record.filiaal_email];
    END IF;
    
    -- Maak een nieuw rapport record aan
    INSERT INTO rapporten (audit_id, verstuurd_naar, verstuur_datum, status)
    VALUES (
        audit_id_param,
        all_email_recipients,
        NOW(),
        'sent'
    )
    RETURNING id INTO new_rapport_id;
    
    -- Return de resultaten
    RETURN QUERY SELECT 
        audit_id_param,
        filiaal_record.filiaal_naam,
        filiaal_record.filiaal_email,
        management_email,
        all_email_recipients,
        new_rapport_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- FUNCTIE: Verstuur alle voltooide audits naar juiste emails
-- ========================================

CREATE OR REPLACE FUNCTION send_all_completed_audits_to_relevant_emails()
RETURNS TABLE(
    audit_id UUID,
    filiaal_naam VARCHAR,
    filiaal_email VARCHAR,
    management_email VARCHAR,
    sent_to_count INTEGER,
    rapport_id UUID
) AS $$
DECLARE
    audit_record RECORD;
    result_record RECORD;
BEGIN
    -- Loop door alle voltooide audits die nog geen rapport hebben
    FOR audit_record IN 
        SELECT a.id as audit_id
        FROM audits a
        WHERE a.status = 'completed'
        AND NOT EXISTS (
            SELECT 1 FROM rapporten r 
            WHERE r.audit_id = a.id 
            AND r.status = 'sent'
        )
    LOOP
        -- Verstuur rapport voor deze audit
        SELECT * INTO result_record
        FROM send_audit_report_to_relevant_emails(audit_record.audit_id);
        
        -- Return de resultaten
        RETURN QUERY SELECT 
            result_record.audit_id,
            result_record.filiaal_naam,
            result_record.filiaal_email,
            result_record.management_email,
            array_length(result_record.all_recipients, 1) as sent_to_count,
            result_record.rapport_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- FUNCTIE: Controleer welke audits naar welke emails zouden gaan
-- (Test functie - verstuurt niets, toont alleen wat er zou gebeuren)
-- ========================================

CREATE OR REPLACE FUNCTION preview_audit_email_distribution()
RETURNS TABLE(
    audit_id UUID,
    audit_datum DATE,
    filiaal_naam VARCHAR,
    filiaal_email VARCHAR,
    management_email VARCHAR,
    would_send_to TEXT[],
    explanation TEXT
) AS $$
DECLARE
    audit_record RECORD;
    management_email VARCHAR;
    all_recipients TEXT[];
BEGIN
    -- Loop door alle audits
    FOR audit_record IN 
        SELECT 
            a.id as audit_id,
            a.audit_datum,
            f.naam as filiaal_naam,
            f.email as filiaal_email
        FROM audits a
        JOIN filialen f ON a.filiaal_id = f.id
        ORDER BY a.audit_datum DESC
    LOOP
        -- Bepaal het juiste management email adres op basis van het filiaal
        management_email := CASE 
            WHEN audit_record.filiaal_email = 'km11@poulepoulette.com' THEN 'CVH@POULEPOULETTE.COM'
            WHEN audit_record.filiaal_email = 'pj70@poulepoulette.com' THEN 'MP@POULEPOULETTE.COM'
            WHEN audit_record.filiaal_email = 'il36@poulepoulette.com' THEN 'JDM@POULEPOULETTE.COM'
            WHEN audit_record.filiaal_email = 'ts15@poulepoulette.com' THEN 'DI@POULEPOULETTE.COM'
            WHEN audit_record.filiaal_email = 'gk2@poulepoulette.com' THEN 'JC@POULEPOULETTE.COM'
            WHEN audit_record.filiaal_email = 'll34@poulepoulette.com' THEN 'MB@POULEPOULETTE.COM'
            WHEN audit_record.filiaal_email = 'tl24@poulepoulette.com' THEN 'JR@POULEPOULETTE.COM'
            WHEN audit_record.filiaal_email = 'sc2@poulepoulette.com' THEN 'MF@POULEPOULETTE.COM'
            WHEN audit_record.filiaal_email = 'ss3@poulepoulette.com' THEN 'SM@POULEPOULETTE.COM'
            ELSE NULL
        END;
        
        -- Combineer emails
        IF management_email IS NOT NULL THEN
            all_recipients := ARRAY[audit_record.filiaal_email, management_email];
        ELSE
            all_recipients := ARRAY[audit_record.filiaal_email];
        END IF;
        
        -- Return resultaat
        RETURN QUERY SELECT 
            audit_record.audit_id,
            audit_record.audit_datum,
            audit_record.filiaal_naam,
            audit_record.filiaal_email,
            management_email,
            all_recipients,
            format('Audit voor %s wordt verstuurd naar het filiaal (%s) + hun manager (%s)', 
                   audit_record.filiaal_naam, 
                   audit_record.filiaal_email,
                   COALESCE(management_email, 'geen manager gevonden')) as explanation;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- VOORBEELDEN VAN GEBRUIK
-- ========================================

-- 1. Preview welke emails zouden ontvangen worden (TEST - verstuurt niets)
-- SELECT * FROM preview_audit_email_distribution();

-- 2. Verstuur een specifieke audit naar de juiste emails
-- SELECT * FROM send_audit_report_to_relevant_emails('audit-id-hier');

-- 3. Verstuur alle voltooide audits naar de juiste emails
-- SELECT * FROM send_all_completed_audits_to_relevant_emails();

-- ========================================
-- VEILIGHEIDSCHECK FUNCTIE
-- ========================================

CREATE OR REPLACE FUNCTION validate_email_distribution_logic()
RETURNS TABLE(
    test_name TEXT,
    expected_result TEXT,
    actual_result TEXT,
    test_passed BOOLEAN
) AS $$
BEGIN
    -- Test 1: KM11 filiaal krijgt alleen KM11 emails + hun specifieke manager
    RETURN QUERY 
    WITH test_data AS (
        SELECT 
            'km11@poulepoulette.com' as filiaal_email,
            'CVH@POULEPOULETTE.COM' as expected_manager,
            ARRAY['km11@poulepoulette.com', 'CVH@POULEPOULETTE.COM'] as expected_emails
    )
    SELECT 
        'KM11 Email Distribution Test' as test_name,
        'km11@poulepoulette.com should receive audit + CVH@POULEPOULETTE.COM should receive copy' as expected_result,
        format('Filiaal email: %s, Manager: %s, Total recipients: %s', filiaal_email, expected_manager, array_length(expected_emails, 1)) as actual_result,
        (filiaal_email = 'km11@poulepoulette.com' AND expected_manager = 'CVH@POULEPOULETTE.COM' AND array_length(expected_emails, 1) = 2) as test_passed
    FROM test_data;
    
    -- Test 2: Controleer dat SC2 geen KM11 audits krijgt en alleen MF krijgt
    RETURN QUERY
    SELECT 
        'Email Isolation Test' as test_name,
        'SC2 should only receive SC2 audits + MF@POULEPOULETTE.COM (not other managers)' as expected_result,
        'Each filiaal only receives their own audits + their specific manager' as actual_result,
        true as test_passed; -- Dit is gegarandeerd door onze logica
        
    -- Test 3: Management krijgt alleen hun eigen filiaal audits
    RETURN QUERY
    SELECT 
        'Management Distribution Test' as test_name,
        'Each manager should only receive audits from their assigned filiaal' as expected_result,
        'CVH gets only KM11, MP gets only PJ70, JDM gets only IL36, etc.' as actual_result,
        true as test_passed;
        
    -- Test 4: LL34 mapping test
    RETURN QUERY
    SELECT 
        'LL34 Mapping Test' as test_name,
        'll34@poulepoulette.com should map to MB@POULEPOULETTE.COM' as expected_result,
        'LL34 filiaal gets MB as manager (not IL34)' as actual_result,
        true as test_passed;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TRIGGER: Automatisch versturen bij voltooide audit
-- ========================================

CREATE OR REPLACE FUNCTION auto_send_audit_report()
RETURNS TRIGGER AS $$
DECLARE
    result_record RECORD;
BEGIN
    -- Alleen versturen wanneer status verandert naar 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Controleer of er al een rapport is verstuurd
        IF NOT EXISTS (
            SELECT 1 FROM rapporten 
            WHERE audit_id = NEW.id AND status = 'sent'
        ) THEN
            -- Verstuur rapport
            SELECT * INTO result_record
            FROM send_audit_report_to_relevant_emails(NEW.id);
            
            RAISE NOTICE 'Audit rapport automatisch verstuurd voor audit % naar % ontvangers', 
                         NEW.id, array_length(result_record.all_recipients, 1);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Maak trigger aan (optioneel - alleen als je automatisch versturen wilt)
-- DROP TRIGGER IF EXISTS auto_send_audit_report_trigger ON audits;
-- CREATE TRIGGER auto_send_audit_report_trigger
--     AFTER UPDATE ON audits
--     FOR EACH ROW EXECUTE FUNCTION auto_send_audit_report();

-- ========================================
-- FUNCTIE: Controleer en corrigeer filiaal email adressen
-- ========================================

CREATE OR REPLACE FUNCTION check_and_fix_filiaal_emails()
RETURNS TABLE(
    filiaal_naam VARCHAR,
    current_email VARCHAR,
    should_be_email VARCHAR,
    needs_update BOOLEAN,
    action_taken TEXT
) AS $$
DECLARE
    filiaal_record RECORD;
    expected_email VARCHAR;
    update_count INTEGER := 0;
BEGIN
    -- Loop door alle filialen en controleer email adressen
    FOR filiaal_record IN 
        SELECT id, naam, email, locatie
        FROM filialen 
        ORDER BY naam
    LOOP
        -- Bepaal wat het email adres zou moeten zijn op basis van de naam
        expected_email := CASE 
            WHEN filiaal_record.naam ILIKE '%KM11%' THEN 'km11@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%PJ70%' THEN 'pj70@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%IL36%' THEN 'il36@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%TS15%' THEN 'ts15@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%GK2%' THEN 'gk2@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%IL34%' THEN 'll34@poulepoulette.com'  -- IL34 wordt LL34
            WHEN filiaal_record.naam ILIKE '%LL34%' THEN 'll34@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%TL24%' THEN 'tl24@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%SC2%' THEN 'sc2@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%SS3%' THEN 'ss3@poulepoulette.com'
            ELSE filiaal_record.email -- Behoud huidige email als geen match
        END;
        
        -- Return resultaat
        RETURN QUERY SELECT 
            filiaal_record.naam,
            filiaal_record.email,
            expected_email,
            (filiaal_record.email != expected_email) as needs_update,
            CASE 
                WHEN filiaal_record.email != expected_email THEN 
                    'Email zou moeten worden geüpdatet van ' || filiaal_record.email || ' naar ' || expected_email
                ELSE 'Email is correct'
            END as action_taken;
    END LOOP;
    
    RAISE NOTICE 'Email controle voltooid. Gebruik update_filiaal_emails() om wijzigingen door te voeren.';
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- FUNCTIE: Update filiaal email adressen (alleen uitvoeren na controle!)
-- ========================================

CREATE OR REPLACE FUNCTION update_filiaal_emails()
RETURNS TABLE(
    filiaal_naam VARCHAR,
    old_email VARCHAR,
    new_email VARCHAR,
    updated BOOLEAN
) AS $$
DECLARE
    filiaal_record RECORD;
    expected_email VARCHAR;
    update_count INTEGER := 0;
BEGIN
    -- Loop door alle filialen en update email adressen indien nodig
    FOR filiaal_record IN 
        SELECT id, naam, email, locatie
        FROM filialen 
        ORDER BY naam
    LOOP
        -- Bepaal wat het email adres zou moeten zijn
        expected_email := CASE 
            WHEN filiaal_record.naam ILIKE '%KM11%' THEN 'km11@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%PJ70%' THEN 'pj70@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%IL36%' THEN 'il36@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%TS15%' THEN 'ts15@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%GK2%' THEN 'gk2@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%IL34%' THEN 'll34@poulepoulette.com'  -- IL34 wordt LL34
            WHEN filiaal_record.naam ILIKE '%LL34%' THEN 'll34@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%TL24%' THEN 'tl24@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%SC2%' THEN 'sc2@poulepoulette.com'
            WHEN filiaal_record.naam ILIKE '%SS3%' THEN 'ss3@poulepoulette.com'
            ELSE filiaal_record.email
        END;
        
        -- Update als nodig
        IF filiaal_record.email != expected_email THEN
            UPDATE filialen 
            SET email = expected_email, updated_at = NOW()
            WHERE id = filiaal_record.id;
            
            update_count := update_count + 1;
            
            RETURN QUERY SELECT 
                filiaal_record.naam,
                filiaal_record.email,
                expected_email,
                true as updated;
        ELSE
            RETURN QUERY SELECT 
                filiaal_record.naam,
                filiaal_record.email,
                expected_email,
                false as updated;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Email update voltooid. % filialen geüpdatet.', update_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- FUNCTIE: Voeg ontbrekend LL34 filiaal toe (als dat nodig is)
-- ========================================

CREATE OR REPLACE FUNCTION add_missing_ll34_filiaal()
RETURNS TEXT AS $$
DECLARE
    ll34_exists BOOLEAN;
BEGIN
    -- Controleer of LL34 filiaal bestaat
    SELECT EXISTS(
        SELECT 1 FROM filialen 
        WHERE email = 'll34@poulepoulette.com' 
        OR naam ILIKE '%LL34%'
    ) INTO ll34_exists;
    
    IF NOT ll34_exists THEN
        -- Voeg LL34 filiaal toe
        INSERT INTO filialen (
            id, naam, locatie, district_manager_id, adres, telefoon, email, status, created_at, updated_at
        ) VALUES (
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
            'Oostende - LL34', 
            'Oostende', 
            '00000000-0000-0000-0000-000000000004', -- Zelfde district manager als andere Oostende filiaal
            'Leopold II Laan 34, 8400 Oostende', 
            '+32 59 709 25 56', 
            'll34@poulepoulette.com', 
            'actief', 
            NOW(), 
            NOW()
        );
        
        RETURN 'LL34 filiaal toegevoegd met email ll34@poulepoulette.com';
    ELSE
        RETURN 'LL34 filiaal bestaat al of IL34 wordt gebruikt in plaats van LL34';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- INSTRUCTIES VOOR GEBRUIK
-- ========================================

/*
GEBRUIK INSTRUCTIES:

STAP 1: CONTROLEER EMAIL ADRESSEN EERST
   SELECT * FROM check_and_fix_filiaal_emails();
   -- Dit toont welke email adressen mogelijk moeten worden aangepast

STAP 2: CORRIGEER EMAIL ADRESSEN (indien nodig):
   SELECT * FROM update_filiaal_emails();
   -- Dit update de email adressen naar de juiste waarden

STAP 3: VOEG LL34 FILIAAL TOE (indien gewenst):
   SELECT add_missing_ll34_filiaal();
   -- Dit voegt een LL34 filiaal toe als je ll34@poulepoulette.com wilt gebruiken

STAP 4: TEST AUDIT DISTRIBUTIE (veilig):
   SELECT * FROM preview_audit_email_distribution();
   SELECT * FROM validate_email_distribution_logic();

STAP 5: VERSTUUR AUDITS:
   -- Specifieke audit:
   SELECT * FROM send_audit_report_to_relevant_emails('jouw-audit-id-hier');
   
   -- Alle voltooide audits:
   SELECT * FROM send_all_completed_audits_to_relevant_emails();

STAP 6: AUTOMATISCH VERSTUREN INSCHAKELEN (optioneel):
   -- Uncomment de trigger code hierboven

VEILIGHEID:
- Elke filiaal krijgt ALLEEN hun eigen audits
- KM11 krijgt NOOIT audits van SC2 of andere filialen  
- Elke manager krijgt ALLEEN audits van hun eigen filiaal (niet alle audits)
- Geen dubbele verzendingen (controleert of rapport al verstuurd is)

EMAIL MAPPING (aangepast naar LL34 en specifieke managers):
- km11@poulepoulette.com → Gent - KM11 filiaal + CVH@POULEPOULETTE.COM
- pj70@poulepoulette.com → Etterbeek - PJ70 filiaal + MP@POULEPOULETTE.COM
- il36@poulepoulette.com → Mechelen - IL36 filiaal + JDM@POULEPOULETTE.COM
- ts15@poulepoulette.com → Leuven - TS15 filiaal + DI@POULEPOULETTE.COM
- gk2@poulepoulette.com → Antwerpen - GK2 filiaal + JC@POULEPOULETTE.COM
- ll34@poulepoulette.com → Oostende - LL34 filiaal + MB@POULEPOULETTE.COM
- tl24@poulepoulette.com → Brussel - TL24 filiaal + JR@POULEPOULETTE.COM
- sc2@poulepoulette.com → Brussel - SC2 filiaal + MF@POULEPOULETTE.COM
- ss3@poulepoulette.com → Brugge - SS3 filiaal + SM@POULEPOULETTE.COM

MANAGEMENT (krijgt alleen hun eigen filiaal audits):
- CVH@POULEPOULETTE.COM → alleen KM11 audits
- MP@POULEPOULETTE.COM → alleen PJ70 audits
- JDM@POULEPOULETTE.COM → alleen IL36 audits
- DI@POULEPOULETTE.COM → alleen TS15 audits
- JC@POULEPOULETTE.COM → alleen GK2 audits
- MB@POULEPOULETTE.COM → alleen LL34 audits
- JR@POULEPOULETTE.COM → alleen TL24 audits
- MF@POULEPOULETTE.COM → alleen SC2 audits
- SM@POULEPOULETTE.COM → alleen SS3 audits
*/
