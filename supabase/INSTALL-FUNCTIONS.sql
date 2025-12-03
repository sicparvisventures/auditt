-- Install database functions for action creation
-- Run this script in Supabase SQL Editor

-- First, check if the functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('create_actions_from_audit_results', 'determine_action_urgency', 'trigger_create_actions');

-- Create urgency_level enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'urgency_level') THEN
        CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
    END IF;
END $$;

-- Create function to determine urgency based on category and score
CREATE OR REPLACE FUNCTION determine_action_urgency(
    categorie TEXT,
    score INTEGER,
    gewicht DECIMAL
) RETURNS urgency_level AS $$
BEGIN
    -- Critical urgency for FAVV, FIFO, and safety issues with low scores
    IF (categorie ILIKE '%FAVV%' OR categorie ILIKE '%FIFO%' OR categorie ILIKE '%veiligheid%' OR categorie ILIKE '%hygiëne%') 
       AND score <= 2 THEN
        RETURN 'critical';
    END IF;
    
    -- High urgency for food safety and hygiene with medium scores
    IF (categorie ILIKE '%keuken%' OR categorie ILIKE '%hygiëne%' OR categorie ILIKE '%ongedierte%') 
       AND score <= 3 THEN
        RETURN 'high';
    END IF;
    
    -- High urgency for high-weight items with low scores
    IF gewicht >= 1.8 AND score <= 2 THEN
        RETURN 'high';
    END IF;
    
    -- High urgency for very low scores (0-1)
    IF score <= 1 THEN
        RETURN 'high';
    END IF;
    
    -- Medium urgency for low scores (2-3) or medium-weight items
    IF score <= 3 OR gewicht >= 1.5 THEN
        RETURN 'medium';
    END IF;
    
    -- Low urgency for everything else (score 4-5)
    RETURN 'low';
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-create actions from audit results
CREATE OR REPLACE FUNCTION create_actions_from_audit_results(audit_id UUID)
RETURNS VOID AS $$
DECLARE
    result_record RECORD;
    action_urgentie urgency_level;
    action_deadline DATE;
BEGIN
    -- Loop through all audit results that need actions
    FOR result_record IN
        SELECT 
            ar.id as result_id,
            ar.audit_id,
            ar.checklist_item_id,
            ar.resultaat,
            ar.score,
            ar.opmerkingen,
            ar.verbeterpunt,
            aci.categorie,
            aci.titel,
            aci.beschrijving,
            aci.gewicht
        FROM audit_resultaten ar
        JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
        WHERE ar.audit_id = create_actions_from_audit_results.audit_id
        AND (ar.resultaat = 'niet_ok' OR ar.score < 4)
    LOOP
        -- Determine urgency
        action_urgentie := determine_action_urgency(
            result_record.categorie,
            result_record.score,
            result_record.gewicht
        );
        
        -- Set deadline based on urgency
        CASE action_urgentie
            WHEN 'critical' THEN action_deadline := CURRENT_DATE + INTERVAL '1 day';
            WHEN 'high' THEN action_deadline := CURRENT_DATE + INTERVAL '3 days';
            WHEN 'medium' THEN action_deadline := CURRENT_DATE + INTERVAL '7 days';
            WHEN 'low' THEN action_deadline := CURRENT_DATE + INTERVAL '14 days';
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
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create actions when audit is completed
CREATE OR REPLACE FUNCTION trigger_create_actions()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create actions when audit status changes to completed
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        PERFORM create_actions_from_audit_results(NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS create_actions_trigger ON audits;
CREATE TRIGGER create_actions_trigger
    AFTER UPDATE ON audits
    FOR EACH ROW EXECUTE FUNCTION trigger_create_actions();

-- Test the function with a sample audit (if one exists)
DO $$
DECLARE
    test_audit_id UUID;
BEGIN
    -- Get the first audit ID for testing
    SELECT id INTO test_audit_id FROM audits LIMIT 1;
    
    IF test_audit_id IS NOT NULL THEN
        RAISE NOTICE 'Testing action creation for audit: %', test_audit_id;
        PERFORM create_actions_from_audit_results(test_audit_id);
        RAISE NOTICE 'Action creation test completed';
    ELSE
        RAISE NOTICE 'No audits found for testing';
    END IF;
END $$;

-- Show current actions count
SELECT COUNT(*) as total_actions FROM acties;
