-- Script om de create_actions_from_audit_results functie te verbeteren
-- Dit voorkomt dat test tekst wordt opgenomen in nieuwe acties

CREATE OR REPLACE FUNCTION create_actions_from_audit_results(audit_id UUID)
RETURNS VOID AS $$
DECLARE
    result_record RECORD;
    action_urgentie urgency_level;
    action_deadline TIMESTAMP WITH TIME ZONE;
    action_beschrijving TEXT;
    audits_created_count INTEGER := 0;
BEGIN
    -- Loop door alle audit resultaten die acties vereisen
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
        -- Skip als er al actie is voor dit resultaat
        IF EXISTS (
            SELECT 1 FROM acties 
            WHERE audit_resultaat_id = result_record.result_id
        ) THEN
            CONTINUE;
        END IF;

        -- Bepaal urgentie
        action_urgentie := determine_action_urgency(
            result_record.categorie,
            result_record.score,
            result_record.gewicht
        );
        
        -- Set deadline op basis van urgentie EN audit datum
        action_deadline := CASE action_urgentie
            WHEN 'critical' THEN result_record.audit_datum + INTERVAL '1 day'
            WHEN 'high' THEN result_record.audit_datum + INTERVAL '1 day'  
            WHEN 'medium' THEN result_record.audit_datum + INTERVAL '3 days'
            WHEN 'low' THEN result_record.audit_datum + INTERVAL '7 days'
        END CASE;
        
        -- Bouwen van beschrijving MET filter voor test tekst
        action_beschrijving := '';
        
        -- Begin met verbeterpunt of beschrijving
        IF result_record.verbeterpunt IS NOT NULL AND TRIM(result_record.verbeterpunt) != '' 
           AND result_record.verbeterpunt NOT ILIKE '%test%' THEN
            action_beschrijving := result_record.verbeterpunt;
        ELSIF result_record.beschrijving IS NOT NULL AND TRIM(result_record.beschrijving) != '' 
              AND result_record.beschrijving NOT ILIKE '%test%' THEN
            action_beschrijving := result_record.beschrijving;
        ELSE
            action_beschrijving := 'Actie vereist voor: ' || result_record.titel;
        END IF;
        
        -- Voeg opmerkingen toe (alleen als niet test)
        IF result_record.opmerkingen IS NOT NULL 
           AND TRIM(result_record.opmerkingen) != '' 
           AND result_record.opmerkingen NOT ILIKE '%test%' THEN
            action_beschrijving := action_beschrijving || ' - Opmerkingen: ' || result_record.opmerkingen;
        END IF;
        
        -- Voorkom lege beschrijvingen
        IF TRIM(action_beschrijving) = '' OR TRIM(action_beschrijving) = 'Actie vereist voor: ' || result_record.titel THEN
            action_beschrijving := 'Verbetering vereist voor punt: ' || result_record.titel || ' (score: ' || result_record.score || '/5)';
        END IF;
        
        -- Maak actie aan
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
            action_beschrijving,
            action_urgentie,
            action_deadline
        );
        
        audits_created_count := audits_created_count + 1;
    END LOOP;
    
    -- Log resultaat
    IF audits_created_count > 0 THEN
        RAISE NOTICE 'Created % actions for audit %', audits_created_count, audit_id;
    ELSE
        RAISE NOTICE 'No actions needed for audit %', audit_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update existing actions to clean up descriptions
UPDATE acties 
SET beschrijving = CASE 
    WHEN beschrijving ILIKE '%test%' THEN 'Beschrijving vereist bijwerken'
    ELSE beschrijving
END
WHERE beschrijving ILIKE '%test%';
