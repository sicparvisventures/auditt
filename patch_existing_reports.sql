-- Directe patch voor bestaande rapporten die nog statische emails hebben
-- Dit script vervangt de statische emails door de correcte filiaal + management emails

DO $$
BEGIN
    RAISE NOTICE '=== PATCHING EXISTING REPORTS ===';
END $$;

-- Update alle rapporten die nog de statische emails hebben
WITH email_mapping AS (
    SELECT 
        a.id as audit_id,
        a.filiaal_id,
        f.email as filiaal_email,
        CASE 
            WHEN f.email = 'km11@poulepoulette.com' THEN 'CVH@POULEPOULETTE.COM'
            WHEN f.email = 'pj70@poulepoulette.com' THEN 'MP@POULEPOULETTE.COM'
            WHEN f.email = 'il36@poulepoulette.com' THEN 'JDM@POULEPOULETTE.COM'
            WHEN f.email = 'ts15@poulepoulette.com' THEN 'DI@POULEPOULETTE.COM'
            WHEN f.email = 'gk2@poulepoulette.com' THEN 'JC@POULEPOULETTE.COM'
            WHEN f.email = 'll34@poulepoulette.com' THEN 'MB@POULEPOULETTE.COM'
            WHEN f.email = 'tl24@poulepoulette.com' THEN 'JR@POULEPOULETTE.COM'
            WHEN f.email = 'sc2@poulepoulette.com' THEN 'MF@POULEPOULETTE.COM'
            WHEN f.email = 'ss3@poulepoulette.com' THEN 'SM@POULEPOULETTE.COM'
            ELSE NULL
        END as management_email
    FROM audits a
    JOIN filialen f ON a.filiaal_id = f.id
)
UPDATE rapporten 
SET verstuurd_naar = CASE 
    WHEN em.management_email IS NOT NULL THEN 
        ARRAY[em.filiaal_email, em.management_email]
    ELSE 
        ARRAY[em.filiaal_email]
END
FROM email_mapping em
WHERE rapporten.audit_id = em.audit_id
AND (
    -- Alleen rapporteren met statische emails bijwerken
    verstuurd_naar && ARRAY['district@poulepoulette.be', 'coo@poulepoulette.be']
    OR verstuurd_naar IS NULL
);

-- Controleer resultaten
DO $$
DECLARE
    rapport_record RECORD;
    update_count INTEGER := 0;
BEGIN
    RAISE NOTICE '=== NIEUWE EMAIL LIJSTEN ===';
    
    FOR rapport_record IN 
        SELECT 
            r.id as rapport_id,
            r.verstuurd_naar,
            f.naam as filiaal_naam,
            f.email as filiaal_email
        FROM rapporten r
        JOIN audits a ON r.audit_id = a.id
        JOIN filialen f ON a.filiaal_id = f.id
        ORDER BY r.created_at DESC
        LIMIT 10
    LOOP
        RAISE NOTICE 'Rapport % (%): %', 
            rapport_record.rapport_id,
            rapport_record.filiaal_naam,
            array_to_string(rapport_record.verstuurd_naar, ', ');
        update_count := update_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Getoond: % rapporten', update_count;
END $$;

DO $$
BEGIN
    RAISE NOTICE '=== PATCH VOLTOOID ===';
    RAISE NOTICE 'Alle bestaande rapporten zijn geüpdatet met juiste email adressen';
    RAISE NOTICE 'Controleer de resultaten hierboven';
END $$;
