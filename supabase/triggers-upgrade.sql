-- =====================================================
-- DATABASE TRIGGERS UPGRADE
-- =====================================================
-- Automatische triggers voor audit rapporten
-- =====================================================

-- Trigger functie: Automatisch rapport aanmaken bij audit completion
CREATE OR REPLACE FUNCTION auto_create_audit_report()
RETURNS TRIGGER AS $$
DECLARE
    result_record RECORD;
BEGIN
    -- Alleen wanneer status verandert naar 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Controleer of er al een rapport is
        IF NOT EXISTS (
            SELECT 1 FROM rapporten 
            WHERE audit_id = NEW.id
        ) THEN
            -- Maak rapport aan met status 'pending'
            INSERT INTO rapporten (audit_id, status)
            VALUES (NEW.id, 'pending')
            ON CONFLICT DO NOTHING;
            
            RAISE NOTICE 'Rapport aangemaakt voor audit %', NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Automatisch rapport aanmaken bij audit completion
DROP TRIGGER IF EXISTS auto_create_audit_report_trigger ON audits;
CREATE TRIGGER auto_create_audit_report_trigger
    AFTER UPDATE ON audits
    FOR EACH ROW 
    WHEN (NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed'))
    EXECUTE FUNCTION auto_create_audit_report();

-- Trigger functie: Update audit scores automatisch (bestaat al, maar verbeterd)
CREATE OR REPLACE FUNCTION update_audit_scores()
RETURNS TRIGGER AS $$
DECLARE
    score_data RECORD;
BEGIN
    -- Calculate new scores
    SELECT * INTO score_data
    FROM calculate_audit_score(COALESCE(NEW.audit_id, OLD.audit_id));

    -- Update audit with new scores
    UPDATE audits 
    SET 
        totale_score = score_data.totale_score,
        pass_percentage = score_data.pass_percentage,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.audit_id, OLD.audit_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update scores bij wijziging audit resultaten (bestaat al)
DROP TRIGGER IF EXISTS update_audit_scores_trigger ON audit_resultaten;
CREATE TRIGGER update_audit_scores_trigger
    AFTER INSERT OR UPDATE OR DELETE ON audit_resultaten
    FOR EACH ROW EXECUTE FUNCTION update_audit_scores();

-- Trigger functie: Automatisch acties aanmaken bij audit completion (bestaat al, maar verbeterd)
CREATE OR REPLACE FUNCTION trigger_create_actions()
RETURNS TRIGGER AS $$
BEGIN
    -- Alleen acties aanmaken wanneer status verandert naar 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Controleer of er al acties zijn aangemaakt
        IF NOT EXISTS (
            SELECT 1 FROM acties 
            WHERE audit_id = NEW.id
        ) THEN
            -- Maak acties aan
            PERFORM create_actions_from_audit_results(NEW.id);
            
            RAISE NOTICE 'Acties aangemaakt voor audit %', NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Automatisch acties aanmaken (bestaat al)
DROP TRIGGER IF EXISTS create_actions_trigger ON audits;
CREATE TRIGGER create_actions_trigger
    AFTER UPDATE ON audits
    FOR EACH ROW 
    WHEN (NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed'))
    EXECUTE FUNCTION trigger_create_actions();

-- OPTIONEEL: Trigger voor automatische email verzending
-- Uncomment alleen als je automatisch emails wilt versturen bij audit completion
/*
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
            -- Verstuur rapport (via Edge Function of externe service)
            -- Deze functie bereidt alleen de data voor
            SELECT * INTO result_record
            FROM send_audit_report_to_relevant_emails(NEW.id);
            
            RAISE NOTICE 'Audit rapport voorbereid voor verzending: audit % naar % ontvangers', 
                         NEW.id, array_length(result_record.all_recipients, 1);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Uncomment om automatische email verzending in te schakelen
-- DROP TRIGGER IF EXISTS auto_send_audit_report_trigger ON audits;
-- CREATE TRIGGER auto_send_audit_report_trigger
--     AFTER UPDATE ON audits
--     FOR EACH ROW 
--     WHEN (NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed'))
--     EXECUTE FUNCTION auto_send_audit_report();
*/

