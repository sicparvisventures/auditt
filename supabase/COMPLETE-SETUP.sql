-- Poule & Poulette Interne Audit Tool - COMPLETE SETUP
-- Dit script bevat ALLE functionaliteit van de local database
-- Run dit bestand in je Supabase SQL Editor voor volledige productie setup

-- STAP 1: Disable RLS (Row Level Security)
ALTER TABLE IF EXISTS gebruikers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS filialen DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audits DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_resultaten DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS rapporten DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS acties DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notificaties DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_checklist_items DISABLE ROW LEVEL SECURITY;

-- STAP 2: Verwijder alle bestaande data
DELETE FROM audit_resultaten;
DELETE FROM acties;
DELETE FROM notificaties;
DELETE FROM rapporten;
DELETE FROM audits;
DELETE FROM filialen;
DELETE FROM gebruikers;
DELETE FROM audit_checklist_items;

-- STAP 3: Gebruikers aanmaken (14 gebruikers)
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip Van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'COO01', 'Sarah De Vries', 'coo', '+32 123 456 790', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'DM001', 'Tom Janssen', 'district_manager', '+32 123 456 791', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'DM002', 'Lisa Peeters', 'district_manager', '+32 123 456 792', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 'DM003', 'Marc Van Der Berg', 'district_manager', '+32 123 456 793', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000006', 'FM001', 'Anna Verstraeten', 'filiaal_manager', '+32 123 456 794', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000007', 'FM002', 'Jeroen De Smet', 'filiaal_manager', '+32 123 456 795', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000008', 'FM003', 'Sofie Van Damme', 'filiaal_manager', '+32 123 456 796', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000009', 'FM004', 'Kevin Vandenberghe', 'filiaal_manager', '+32 123 456 797', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000010', 'FM005', 'Nathalie De Clercq', 'filiaal_manager', '+32 123 456 798', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000011', 'FM006', 'Dries Van Hove', 'filiaal_manager', '+32 123 456 799', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000012', 'FM007', 'Eline De Backer', 'filiaal_manager', '+32 123 456 800', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000013', 'FM008', 'Robbe Van Den Bossche', 'filiaal_manager', '+32 123 456 801', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000014', 'FM009', 'Lotte De Meyer', 'filiaal_manager', '+32 123 456 802', true, NOW(), NOW());

-- STAP 4: Alle filialen toevoegen (9 filialen)
INSERT INTO filialen (id, naam, locatie, district_manager_id, adres, telefoon, email, status, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Gent - KM11', 'Gent', '00000000-0000-0000-0000-000000000003', 'Korenmarkt 11, 9000 Gent', '+32 9 245 75 85', 'km11@poulepoulette.com', 'actief', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Etterbeek - PJ70', 'Etterbeek', '00000000-0000-0000-0000-000000000003', 'Place Jourdan 70, 1040 Etterbeek', '+32 2 759 42 97', 'pj70@poulepoulette.com', 'actief', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Mechelen - IL36', 'Mechelen', '00000000-0000-0000-0000-000000000003', 'Ijzerenleen 36, 2800 Mechelen', '+32 15 528 35 1', 'il36@poulepoulette.com', 'actief', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Leuven - TS15', 'Leuven', '00000000-0000-0000-0000-000000000004', 'Tiensestraat 15, 3000 Leuven', '+32 16 792 15 2', 'ts15@poulepoulette.com', 'actief', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Antwerpen - GK2', 'Antwerpen', '00000000-0000-0000-0000-000000000004', 'Godfrieduskaai 2, 2000 Antwerpen', '+32 3 828 38 22', 'gk2@poulepoulette.com', 'actief', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'Oostende - IL34', 'Oostende', '00000000-0000-0000-0000-000000000004', 'Leopold II Laan 34, 8400 Oostende', '+32 59 709 25 55', 'il34@poulepoulette.com', 'actief', NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'Brussel - TL24', 'Brussel', '00000000-0000-0000-0000-000000000005', 'Tervurenlaan 24a, 1040 Brussel', '+32 2 895 57 00', 'tl24@poulepoulette.com', 'actief', NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'Brussel - SC2', 'Brussel', '00000000-0000-0000-0000-000000000005', 'Place Saint-Catherine 2, 1000 Brussel', '+32 2 895 57 00', 'sc2@poulepoulette.com', 'actief', NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', 'Brugge - SS3', 'Brugge', '00000000-0000-0000-0000-000000000005', 'Simon Stevinplein 3, 8000 Brugge', '+32 50 893 70 00', 'ss3@poulepoulette.com', 'actief', NOW(), NOW());

-- STAP 5: Volledige audit checklist items toevoegen (25 items)
INSERT INTO audit_checklist_items (id, categorie, titel, beschrijving, gewicht, volgorde, actief, created_at)
VALUES
  -- HACCP Items (5 items)
  (gen_random_uuid(), 'HACCP', 'Koelkast temperatuur (max 4°C)', 'Controleer of de koelkast op de juiste temperatuur staat', 2.0, 1, true, NOW()),
  (gen_random_uuid(), 'HACCP', 'FIFO principe (First In, First Out)', 'Controleer of producten correct gerangschikt zijn volgens vervaldatum', 1.5, 2, true, NOW()),
  (gen_random_uuid(), 'HACCP', 'Diepvries temperatuur (max -18°C)', 'Controleer of de diepvries op de juiste temperatuur staat', 2.0, 3, true, NOW()),
  (gen_random_uuid(), 'HACCP', 'Temperatuur registratie', 'Controleer of temperaturen correct worden bijgehouden', 1.5, 4, true, NOW()),
  (gen_random_uuid(), 'HACCP', 'Bewaring producten (afgedekt, gelabeld)', 'Controleer of alle producten correct zijn opgeslagen', 1.5, 5, true, NOW()),
  
  -- Algemene Properheid Items (11 items)
  (gen_random_uuid(), 'Algemene Properheid', 'Keuken vloeren', 'Controleer de schoonheid van de keuken vloeren', 1.5, 6, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Keuken werkbladen', 'Controleer de schoonheid van de werkbladen', 1.5, 7, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Keuken muren en plafonds', 'Controleer de schoonheid van muren en plafonds', 1.0, 8, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Keuken afvoeren', 'Controleer of afvoeren schoon zijn', 1.0, 9, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Keuken apparatuur (oven, friteuse, grill)', 'Controleer de schoonheid van de apparatuur', 1.5, 10, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Afwasmachine', 'Controleer de schoonheid en werking van de afwasmachine', 1.0, 11, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Zaalvloeren', 'Controleer de schoonheid van de zaalvloeren', 1.0, 12, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Tafels en stoelen', 'Controleer de schoonheid van tafels en stoelen', 1.0, 13, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Toiletten', 'Controleer de schoonheid van de toiletten', 1.5, 14, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Gevel en ramen', 'Controleer de schoonheid van de gevel en ramen', 1.0, 15, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Ingang en terras', 'Controleer de schoonheid van de ingang en het terras', 1.0, 16, true, NOW()),
  
  -- Operationele Checks Items (9 items)
  (gen_random_uuid(), 'Operationele Checks', 'Stock management (voorraad, bestellingen)', 'Controleer of de voorraad correct wordt beheerd', 1.5, 17, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Personeel hygiëne (handen wassen, schorten)', 'Controleer of personeel de hygiëneregels volgt', 2.0, 18, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Afval scheiding', 'Controleer of afval correct wordt gescheiden', 1.0, 19, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Veiligheid (brandblussers, nooduitgangen, EHBO)', 'Controleer of de veiligheidsmaatregelen op hun plaats zijn en goed werken', 1.5, 20, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Personeelsbezetting & planning', 'Is het personeel voldoende en goed ingepland voor de drukte?', 1.5, 21, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Kassaprocedures en dagrapporten', 'Is alles correct geregistreerd en zijn de dagrapporten accuraat?', 1.3, 22, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Voorraadniveaus', 'Zorg ervoor dat de voorraad op peil is en er geen tekorten zijn', 1.2, 23, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Acties en promoties correct uitgevoerd', 'Zijn de promoties correct gepromoot en uitgevoerd volgens de afspraken?', 1.0, 24, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Gastbeleving en servicekwaliteit', 'Hoe wordt de service ervaren door de gasten? Is er ruimte voor verbetering?', 1.8, 25, true, NOW());

-- STAP 6: Geen demo data - schone productie setup

-- STAP 7: User ID Generator Function
DROP FUNCTION IF EXISTS generate_user_id();
CREATE OR REPLACE FUNCTION generate_user_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..5 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- STAP 8: Trigger voor automatische User ID generatie
DROP TRIGGER IF EXISTS trigger_set_user_id ON gebruikers;
DROP FUNCTION IF EXISTS set_user_id() CASCADE;
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NULL OR NEW.user_id = '' THEN
        NEW.user_id := generate_user_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_user_id
    BEFORE INSERT ON gebruikers
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

-- STAP 9: Audit Score Calculation Function
DROP FUNCTION IF EXISTS calculate_audit_score(UUID);
CREATE OR REPLACE FUNCTION calculate_audit_score(audit_id_param UUID)
RETURNS TABLE(total_score DECIMAL, pass_percentage DECIMAL) AS $$
DECLARE
    total_weight DECIMAL := 0;
    total_score DECIMAL := 0;
    pass_count INTEGER := 0;
    total_items INTEGER := 0;
    result_record RECORD;
    item_record RECORD;
BEGIN
    -- Loop through all audit results for this audit
    FOR result_record IN 
        SELECT ar.*, aci.gewicht 
        FROM audit_resultaten ar
        JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
        WHERE ar.audit_id = audit_id_param
    LOOP
        total_items := total_items + 1;
        total_weight := total_weight + result_record.gewicht;
        
        -- Calculate score based on result (ok = 5, niet_ok = 0)
        IF result_record.resultaat = 'ok' THEN
            total_score := total_score + (5 * result_record.gewicht);
            pass_count := pass_count + 1;
        END IF;
    END LOOP;
    
    -- Calculate final scores
    IF total_weight > 0 THEN
        total_score := total_score / total_weight;
    END IF;
    
    IF total_items > 0 THEN
        pass_percentage := (pass_count::DECIMAL / total_items::DECIMAL) * 100;
    END IF;
    
    RETURN QUERY SELECT total_score, pass_percentage;
END;
$$ LANGUAGE plpgsql;

-- STAP 10: Action Generation Function
DROP FUNCTION IF EXISTS generate_actions_for_audit(UUID);
CREATE OR REPLACE FUNCTION generate_actions_for_audit(audit_id_param UUID)
RETURNS VOID AS $$
DECLARE
    result_record RECORD;
    action_id UUID;
BEGIN
    -- Generate actions for all 'niet_ok' results
    FOR result_record IN 
        SELECT ar.*, aci.titel, aci.categorie
        FROM audit_resultaten ar
        JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
        WHERE ar.audit_id = audit_id_param 
        AND ar.resultaat = 'niet_ok'
        AND ar.verbeterpunt IS NOT NULL 
        AND ar.verbeterpunt != ''
    LOOP
        action_id := gen_random_uuid();
        
        INSERT INTO acties (
            id, audit_id, audit_resultaat_id, titel, beschrijving, 
            urgentie, status, deadline, created_at, updated_at
        ) VALUES (
            action_id,
            audit_id_param,
            result_record.id,
            'Actie vereist: ' || result_record.titel,
            result_record.verbeterpunt,
            CASE 
                WHEN result_record.categorie = 'HACCP' THEN 'critical'
                WHEN result_record.categorie = 'Algemene Properheid' THEN 'high'
                ELSE 'medium'
            END,
            'pending',
            (CURRENT_DATE + INTERVAL '7 days')::DATE,
            NOW(),
            NOW()
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- STAP 11: Trigger voor automatische score berekening en actie generatie
DROP TRIGGER IF EXISTS update_audit_scores_trigger ON audit_resultaten;
DROP FUNCTION IF EXISTS update_audit_scores() CASCADE;
CREATE OR REPLACE FUNCTION update_audit_scores()
RETURNS TRIGGER AS $$
DECLARE
    score_result RECORD;
BEGIN
    -- Calculate new scores
    SELECT * INTO score_result FROM calculate_audit_score(NEW.audit_id);
    
    -- Update audit with new scores
    UPDATE audits 
    SET 
        totale_score = score_result.total_score,
        pass_percentage = score_result.pass_percentage,
        updated_at = NOW()
    WHERE id = NEW.audit_id;
    
    -- Generate actions for new 'niet_ok' results
    IF NEW.resultaat = 'niet_ok' AND NEW.verbeterpunt IS NOT NULL AND NEW.verbeterpunt != '' THEN
        PERFORM generate_actions_for_audit(NEW.audit_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_audit_scores ON audit_resultaten;
DROP TRIGGER IF EXISTS update_audit_scores_trigger ON audit_resultaten;
CREATE TRIGGER trigger_update_audit_scores
    AFTER INSERT OR UPDATE ON audit_resultaten
    FOR EACH ROW
    EXECUTE FUNCTION update_audit_scores();

-- STAP 12: KPI Data Function
DROP FUNCTION IF EXISTS get_kpi_data(UUID);
CREATE OR REPLACE FUNCTION get_kpi_data(filiaal_id_param UUID DEFAULT NULL)
RETURNS TABLE(
    total_audits INTEGER,
    average_score DECIMAL,
    pass_percentage DECIMAL,
    pending_actions INTEGER,
    completed_actions INTEGER,
    critical_actions INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT a.id)::INTEGER as total_audits,
        COALESCE(AVG(a.totale_score), 0)::DECIMAL as average_score,
        COALESCE(AVG(a.pass_percentage), 0)::DECIMAL as pass_percentage,
        COUNT(CASE WHEN ac.status = 'pending' THEN 1 END)::INTEGER as pending_actions,
        COUNT(CASE WHEN ac.status = 'completed' THEN 1 END)::INTEGER as completed_actions,
        COUNT(CASE WHEN ac.urgentie = 'critical' THEN 1 END)::INTEGER as critical_actions
    FROM audits a
    LEFT JOIN acties ac ON a.id = ac.audit_id
    WHERE (filiaal_id_param IS NULL OR a.filiaal_id = filiaal_id_param)
    AND a.status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- STAP 13: Verificatie
SELECT 'Complete setup completed successfully!' as status;

SELECT 
    'Users' as table_name, 
    COUNT(*) as count 
FROM gebruikers
UNION ALL
SELECT 
    'Filialen' as table_name, 
    COUNT(*) as count 
FROM filialen
UNION ALL
SELECT 
    'Checklist Items' as table_name, 
    COUNT(*) as count 
FROM audit_checklist_items;

-- Test query om te controleren of de ADMIN gebruiker bestaat
SELECT 'ADMIN user check:' as info;
SELECT * FROM gebruikers WHERE user_id = 'ADMIN';

-- Test de user ID generator
SELECT 'User ID Generator Test:' as info;
SELECT generate_user_id() as sample_user_id;

-- Test KPI data (zal 0 resultaten tonen zonder audits)
SELECT 'KPI Data Test:' as info;
SELECT * FROM get_kpi_data();
