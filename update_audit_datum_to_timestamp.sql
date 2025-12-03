-- Update audit_datum van DATE naar TIMESTAMP WITH TIME ZONE
-- Dit zorgt ervoor dat zowel datum als tijd worden opgeslagen

DO $$
BEGIN
    RAISE NOTICE '=== UPDATING AUDIT_DATUM TO TIMESTAMP ===';
END $$;

-- 1. Voeg een nieuwe kolom toe
ALTER TABLE audits 
ADD COLUMN audit_datum_new TIMESTAMP WITH TIME ZONE;

-- 2. Converteer bestaande data: voeg huidige tijd toe aan bestaande data
UPDATE audits 
SET audit_datum_new = CAST(audit_datum AS DATE) + CAST(CURRENT_TIME AS TIME)
WHERE audit_datum_new IS NULL;

-- 3. Voor elke audit, gebruik created_at tijd als referentie voor audit tijd
UPDATE audits 
SET audit_datum_new = CAST(audit_datum AS DATE) + 
    CAST(created_at AS TIME) AT TIME ZONE 'Europe/Amsterdam'
WHERE audit_datum_new IS NOT NULL;

-- 4. Verwijder oude kolom en hernoem nieuwe kolom
ALTER TABLE audits DROP COLUMN audit_datum;
ALTER TABLE audits RENAME COLUMN audit_datum_new TO audit_datum;

-- 5. Maak kolom NOT NULL en voeg constraint toe
ALTER TABLE audits 
ALTER COLUMN audit_datum SET NOT NULL;

-- 6. Update de create_actions_from_audit_results functie om met TIMESTAMP te werken
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
            a.audit_datum,
            a.created_at
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
        
        -- Set deadline based on urgency en audit datum (TIMESTAMP)
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

-- 7. Voer deadline fix uit voor bestaande acties
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

-- 8. Controleer resultaten
DO $$
DECLARE
    audit_record RECORD;
    action_record RECORD;
BEGIN
    RAISE NOTICE '=== CONTROLERESULTATEN ===';
    
    RAISE NOTICE '--- AUDIT DATUMS (met tijd) ---';
    FOR audit_record IN 
        SELECT id, audit_datum, created_at, 
               CAST(audit_datum AS DATE) as datum_alleen,
               CAST(audit_datum AS TIME) as tijd_alleen
        FROM audits 
        ORDER BY audit_datum DESC
        LIMIT 3
    LOOP
        RAISE NOTICE 'Audit %: % (%) / %', 
            audit_record.id, 
            audit_record.audit_datum,
            audit_record.datum_alleen,
            audit_record.tijd_alleen;
    END LOOP;
    
    RAISE NOTICE '--- DEADLINES ---';
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
        LIMIT 3
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
    RAISE NOTICE '=== UPDATE VOLTOOID ===';
    RAISE NOTICE '- audit_datum is nu TIMESTAMP WITH TIME ZONE';
    RAISE NOTICE '- Nieuwe audits krijgen werkelijke datum en tijd';
    RAISE NOTICE '- Deadlines zijn gecorrigeerd volgens nieuwe logica';
END $$;

