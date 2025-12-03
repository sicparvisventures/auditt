-- Fix voor Audit Datum en Deadline Berekening
-- Dit script corrigeert de deadlines op basis van de nieuwe urgentie logica

DO $$
BEGIN
    RAISE NOTICE '=== FIXING ACTION DATES AND DEADLINES ===';
END $$;

-- 1. Update bestaande acties met de nieuwe deadline logica
-- Kritiek en hoog: 24h (1 dag)
-- Gemiddeld: 3 dagen  
-- Laag: 7 dagen

UPDATE acties 
SET deadline = CASE 
    WHEN urgentie = 'critical' OR urgentie = 'high' THEN 
        CAST(audits.audit_datum AS DATE) + INTERVAL '1 day'
    WHEN urgentie = 'medium' THEN 
        CAST(audits.audit_datum AS DATE) + INTERVAL '3 days'
    WHEN urgentie = 'low' THEN 
        CAST(audits.audit_datum AS DATE) + INTERVAL '7 days'
    ELSE 
        deadline -- Blijf huidige deadline als urgentie niet herkend wordt
END
FROM audits
WHERE acties.audit_id = audits.id;

-- 2. Update de create_actions_from_audit_results functie met de nieuwe deadline logica
DROP FUNCTION IF EXISTS create_actions_from_audit_results(UUID);

CREATE OR REPLACE FUNCTION create_actions_from_audit_results(audit_id UUID)
RETURNS VOID AS $$
DECLARE
    result_record RECORD;
    action_urgentie urgency_level;
    action_deadline DATE;
    actions_created INTEGER := 0;
BEGIN
    -- Loop through all audit results that are not OK or have low scores
    FOR result_record IN 
        SELECT 
            ar.id as result_id,
            ar.audit_id,
            ar.checklist_item_id,
            ar.score,
            ar.opmerkingen,
            ar.verbeterpunt,
            aci.categorie,
            aci.titel,
            aci.beschrijving,
            aci.gewicht,
            a.audit_datum
        FROM audit_resultaten ar
        JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
        JOIN audits a ON ar.audit_id = a.id
        WHERE ar.audit_id = create_actions_from_audit_results.audit_id
        AND (ar.resultaat = 'niet_ok' OR ar.score < 4)
    LOOP
        -- Determine urgency
        action_urgentie := determine_action_urgency(
            result_record.categorie,
            result_record.score,
            result_record.gewicht
        );
        
        -- Set deadline based on urgency en audit datum (NIET CURRENT_DATE)
        -- Kritiek en hoog: 24h
        -- Gemiddeld: 3 dagen
        -- Laag: 7 dagen
        CASE action_urgentie
            WHEN 'critical' THEN 
                action_deadline := CAST(result_record.audit_datum AS DATE) + INTERVAL '1 day';
            WHEN 'high' THEN 
                action_deadline := CAST(result_record.audit_datum AS DATE) + INTERVAL '1 day';
            WHEN 'medium' THEN 
                action_deadline := CAST(result_record.audit_datum AS DATE) + INTERVAL '3 days';
            WHEN 'low' THEN 
                action_deadline := CAST(result_record.audit_datum AS DATE) + INTERVAL '7 days';
        END CASE;
        
        -- Create action
        INSERT INTO acties (
            audit_id,
            audit_resultaat_id,
            titel,
            beschrijving,
            urgentie,
            deadline
        ) VALUES (
            result_record.audit_id,
            result_record.result_id,
            'Actie vereist: ' || result_record.titel,
            COALESCE(result_record.verbeterpunt, result_record.beschrijving) || 
            CASE 
                WHEN result_record.opmerkingen IS NOT NULL 
                THEN ' Opmerkingen: ' || result_record.opmerkingen
                ELSE ''
            END,
            action_urgentie,
            action_deadline
        );
        
        actions_created := actions_created + 1;
    END LOOP;
    
    RAISE NOTICE 'Created % actions for audit %', actions_created, audit_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Controleer de huidige audit datums in de database
DO $$
DECLARE
    audit_record RECORD;
    audit_count INTEGER := 0;
BEGIN
    RAISE NOTICE '=== AUDIT DATUMS CONTROLEREN ===';
    
    FOR audit_record IN 
        SELECT id, audit_datum, created_at, filialen.naam as filiaal_naam
        FROM audits 
        LEFT JOIN filialen ON audits.filiaal_id = filialen.id
        ORDER BY audit_datum DESC
        LIMIT 10
    LOOP
        RAISE NOTICE 'Audit %: Datum: %, Created: %, Filiaal: %', 
            audit_record.id, 
            audit_record.audit_datum, 
            audit_record.created_at,
            COALESCE(audit_record.filiaal_naam, 'Onbekend');
        audit_count := audit_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Controleerde % audits', audit_count;
END $$;

-- 4. Controleer de huidige deadline verdeling
DO $$
DECLARE
    deadline_record RECORD;
BEGIN
    RAISE NOTICE '=== DEADLINE VERDELING CONTROLEREN ===';
    
    FOR deadline_record IN 
        SELECT 
            urgentie,
            COUNT(*) as aantal,
            MIN(deadline) as vroegste_deadline,
            MAX(deadline) as laatste_deadline
        FROM acties 
        WHERE deadline IS NOT NULL
        GROUP BY urgentie
        ORDER BY urgentie
    LOOP
        RAISE NOTICE '%: % acties, deadlines van % tot %', 
            deadline_record.urgentie,
            deadline_record.aantal,
            deadline_record.vroegste_deadline,
            deadline_record.laatste_deadline;
    END LOOP;
END $$;

-- 5. Toon voorbeeld van aangepaste deadlines
DO $$
DECLARE
    action_record RECORD;
BEGIN
    RAISE NOTICE '=== VOORBEELD AANGEPASTE DEADLINES ===';
    
    FOR action_record IN 
        SELECT 
            a.titel,
            a.urgentie,
            a.deadline,
            audits.audit_datum,
            audits.id as audit_id
        FROM acties a
        LEFT JOIN audits ON a.audit_id = audits.id
        WHERE a.deadline IS NOT NULL
        ORDER BY a.created_at DESC
        LIMIT 5
    LOOP
        RAISE NOTICE 'Actie: %, Urgentie: %, Audit: %, Deadline: %', 
            COALESCE(action_record.titel, 'Geen titel'),
            action_record.urgentie,
            action_record.audit_datum,
            action_record.deadline;
    END LOOP;
END $$;

DO $$
BEGIN
    RAISE NOTICE '=== FIX VOLTOOID ===';
    RAISE NOTICE 'Nieuwe deadline logica:';
    RAISE NOTICE '- Kritiek/Hoog: Audit datum + 24 uur';
    RAISE NOTICE '- Gemiddeld: Audit datum + 3 dagen';
    RAISE NOTICE '- Laag: Audit datum + 7 dagen';
END $$;

