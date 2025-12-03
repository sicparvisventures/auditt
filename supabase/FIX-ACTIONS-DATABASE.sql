-- Poule & Poulette Interne Audit Tool - FIX ACTIONS DATABASE
-- Dit script herstelt de acties functionaliteit en zorgt ervoor dat acties correct worden opgehaald
-- Voer dit script uit in de Supabase SQL Editor

-- ========================================
-- STAP 1: Controleer bestaande data
-- ========================================
SELECT 'Current actions in database:' as status;
SELECT id, titel, status, urgentie, created_at FROM acties ORDER BY created_at DESC;

SELECT 'Current audits in database:' as status;
SELECT id, filiaal_id, status, audit_datum FROM audits ORDER BY audit_datum DESC;

SELECT 'Current filialen in database:' as status;
SELECT id, naam, locatie FROM filialen ORDER BY naam;

-- ========================================
-- STAP 2: Voeg test actie toe als deze niet bestaat
-- ========================================
DO $$ BEGIN
    -- Controleer of de test actie al bestaat
    IF NOT EXISTS (SELECT 1 FROM acties WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd') THEN
        -- Voeg test actie toe
        INSERT INTO acties (
            id, 
            audit_id, 
            audit_resultaat_id, 
            titel, 
            beschrijving, 
            urgentie, 
            status, 
            toegewezen_aan, 
            deadline, 
            created_at, 
            updated_at
        ) VALUES (
            'dddddddd-dddd-dddd-dddd-dddddddddddd',
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Test audit ID
            'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Test audit result ID
            'Test Actie: Schoonmaak verbeteren',
            'Deze test actie is toegevoegd om de functionaliteit te testen. Schoonmaak procedures moeten worden verbeterd.',
            'high',
            'pending',
            '00000000-0000-0000-0000-000000000003', -- Store Manager
            CURRENT_DATE + INTERVAL '3 days',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Test actie toegevoegd';
    ELSE
        RAISE NOTICE 'Test actie bestaat al';
    END IF;
END $$;

-- ========================================
-- STAP 3: Voeg test audit toe als deze niet bestaat
-- ========================================
DO $$ BEGIN
    -- Controleer of de test audit al bestaat
    IF NOT EXISTS (SELECT 1 FROM audits WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') THEN
        -- Voeg test audit toe
        INSERT INTO audits (
            id, 
            filiaal_id, 
            district_manager_id, 
            audit_datum, 
            status, 
            totale_score, 
            pass_percentage, 
            opmerkingen, 
            created_at, 
            updated_at
        ) VALUES (
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            '11111111-1111-1111-1111-111111111111', -- Gent filiaal
            '00000000-0000-0000-0000-000000000002', -- Inspector gebruiker
            CURRENT_DATE,
            'completed',
            4.2,
            84.0,
            'Test audit voor functionaliteit',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Test audit toegevoegd';
    ELSE
        RAISE NOTICE 'Test audit bestaat al';
    END IF;
END $$;

-- ========================================
-- STAP 4: Voeg test audit resultaat toe als deze niet bestaat
-- ========================================
DO $$ BEGIN
    -- Controleer of het test audit resultaat al bestaat
    IF NOT EXISTS (SELECT 1 FROM audit_resultaten WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc') THEN
        -- Voeg test audit resultaat toe
        INSERT INTO audit_resultaten (
            id, 
            audit_id, 
            checklist_item_id, 
            resultaat, 
            score, 
            opmerkingen, 
            verbeterpunt, 
            created_at
        ) VALUES (
            'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Test audit ID
            (SELECT id FROM audit_checklist_items LIMIT 1), -- Eerste checklist item
            'niet_ok',
            2,
            'Verbetering nodig',
            'Schoonmaak verbeteren',
            NOW()
        );
        
        RAISE NOTICE 'Test audit resultaat toegevoegd';
    ELSE
        RAISE NOTICE 'Test audit resultaat bestaat al';
    END IF;
END $$;

-- ========================================
-- STAP 5: Herstel getActionById functie
-- ========================================
CREATE OR REPLACE FUNCTION get_action_by_id(action_id UUID)
RETURNS TABLE(
    id UUID,
    audit_id UUID,
    audit_resultaat_id UUID,
    titel VARCHAR,
    beschrijving TEXT,
    urgentie urgency_level,
    status action_status,
    toegewezen_aan UUID,
    deadline DATE,
    actie_onderneem TEXT,
    foto_urls TEXT[],
    voltooid_door UUID,
    voltooid_op TIMESTAMP WITH TIME ZONE,
    geverifieerd_door UUID,
    geverifieerd_op TIMESTAMP WITH TIME ZONE,
    verificatie_opmerkingen TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    -- Audit data
    audit_filiaal_id UUID,
    audit_datum DATE,
    audit_totale_score DECIMAL,
    audit_pass_percentage DECIMAL,
    -- Filiaal data
    filiaal_naam VARCHAR,
    filiaal_locatie VARCHAR,
    -- Audit resultaat data
    resultaat_ok BOOLEAN,
    resultaat_score INTEGER,
    resultaat_opmerkingen TEXT,
    resultaat_verbeterpunt TEXT,
    -- Checklist item data
    checklist_categorie VARCHAR,
    checklist_titel VARCHAR,
    checklist_beschrijving TEXT,
    checklist_gewicht DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ac.id,
        ac.audit_id,
        ac.audit_resultaat_id,
        ac.titel,
        ac.beschrijving,
        ac.urgentie,
        ac.status,
        ac.toegewezen_aan,
        ac.deadline,
        ac.actie_onderneem,
        ac.foto_urls,
        ac.voltooid_door,
        ac.voltooid_op,
        ac.geverifieerd_door,
        ac.geverifieerd_op,
        ac.verificatie_opmerkingen,
        ac.created_at,
        ac.updated_at,
        -- Audit data
        a.filiaal_id as audit_filiaal_id,
        a.audit_datum,
        a.totale_score as audit_totale_score,
        a.pass_percentage as audit_pass_percentage,
        -- Filiaal data
        f.naam as filiaal_naam,
        f.locatie as filiaal_locatie,
        -- Audit resultaat data
        (ar.resultaat = 'ok') as resultaat_ok,
        ar.score as resultaat_score,
        ar.opmerkingen as resultaat_opmerkingen,
        ar.verbeterpunt as resultaat_verbeterpunt,
        -- Checklist item data
        aci.categorie as checklist_categorie,
        aci.titel as checklist_titel,
        aci.beschrijving as checklist_beschrijving,
        aci.gewicht as checklist_gewicht
    FROM acties ac
    LEFT JOIN audits a ON ac.audit_id = a.id
    LEFT JOIN filialen f ON a.filiaal_id = f.id
    LEFT JOIN audit_resultaten ar ON ac.audit_resultaat_id = ar.id
    LEFT JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
    WHERE ac.id = action_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- STAP 6: Herstel getActions functie
-- ========================================
CREATE OR REPLACE FUNCTION get_actions_for_user_simple(user_id_param UUID, filiaal_id_param UUID DEFAULT NULL)
RETURNS TABLE(
    id UUID,
    audit_id UUID,
    titel VARCHAR,
    beschrijving TEXT,
    urgentie urgency_level,
    status action_status,
    toegewezen_aan UUID,
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE,
    filiaal_naam VARCHAR,
    filiaal_locatie VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ac.id,
        ac.audit_id,
        ac.titel,
        ac.beschrijving,
        ac.urgentie,
        ac.status,
        ac.toegewezen_aan,
        ac.deadline,
        ac.created_at,
        f.naam as filiaal_naam,
        f.locatie as filiaal_locatie
    FROM acties ac
    JOIN audits a ON ac.audit_id = a.id
    JOIN filialen f ON a.filiaal_id = f.id
    WHERE (filiaal_id_param IS NULL OR a.filiaal_id = filiaal_id_param)
    ORDER BY ac.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- STAP 7: Verificatie
-- ========================================
DO $$ BEGIN
    RAISE NOTICE '=== ACTIONS DATABASE FIX COMPLETED ===';
    RAISE NOTICE 'Test data created/verified';
    RAISE NOTICE 'Database functions restored';
    RAISE NOTICE '=== READY FOR TESTING ===';
END $$;

-- Toon verificatie data
SELECT 'Actions after fix:' as status;
SELECT id, titel, status, urgentie, created_at FROM acties ORDER BY created_at DESC;

SELECT 'Audits after fix:' as status;
SELECT a.id, f.naam as filiaal, a.status, a.audit_datum 
FROM audits a 
JOIN filialen f ON a.filiaal_id = f.id 
ORDER BY a.audit_datum DESC;

-- Test de getActionById functie
SELECT 'Testing getActionById function:' as status;
SELECT * FROM get_action_by_id('dddddddd-dddd-dddd-dddd-dddddddddddd');

-- Test de getActions functie
SELECT 'Testing getActions function:' as status;
SELECT * FROM get_actions_for_user_simple('00000000-0000-0000-0000-000000000001'::UUID);
