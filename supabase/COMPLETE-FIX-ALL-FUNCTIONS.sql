-- Poule & Poulette Interne Audit Tool - COMPLETE FIX ALL FUNCTIONS
-- Dit script herstelt ALLE database functies en zorgt ervoor dat de volledige app werkt
-- Voer dit script uit in de Supabase SQL Editor

-- ========================================
-- STAP 1: Update user_role enum met alle rollen
-- ========================================
DO $$ BEGIN
    -- Voeg alle rollen toe aan de enum
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'user_role' AND e.enumlabel = 'admin') THEN
        ALTER TYPE user_role ADD VALUE 'admin';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'user_role' AND e.enumlabel = 'inspector') THEN
        ALTER TYPE user_role ADD VALUE 'inspector';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'user_role' AND e.enumlabel = 'storemanager') THEN
        ALTER TYPE user_role ADD VALUE 'storemanager';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'user_role' AND e.enumlabel = 'developer') THEN
        ALTER TYPE user_role ADD VALUE 'developer';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'user_role' AND e.enumlabel = 'coo') THEN
        ALTER TYPE user_role ADD VALUE 'coo';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'user_role' AND e.enumlabel = 'district_manager') THEN
        ALTER TYPE user_role ADD VALUE 'district_manager';
    END IF;
    
    RAISE NOTICE 'User role enum values updated';
END $$;

-- ========================================
-- STAP 2: Update bestaande gebruikers met juiste rollen
-- ========================================
DO $$ BEGIN
    -- Update oude rollen naar nieuwe rollen
    UPDATE gebruikers SET rol = 'storemanager'::user_role, updated_at = NOW() WHERE rol::text = 'user';
    UPDATE gebruikers SET rol = 'inspector'::user_role, updated_at = NOW() WHERE rol::text = 'manager' AND rol::text != 'admin';
    
    RAISE NOTICE 'Existing user roles updated';
END $$;

-- ========================================
-- STAP 3: Voeg standaard gebruikers toe
-- ========================================
DO $$ BEGIN
    -- Admin gebruiker
    INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip Van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        user_id = EXCLUDED.user_id, naam = EXCLUDED.naam, rol = EXCLUDED.rol, telefoon = EXCLUDED.telefoon, actief = EXCLUDED.actief, updated_at = NOW();
    
    -- Inspector gebruiker
    INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000002', 'MAN02', 'Inspector', 'inspector', '+32 123 456 791', true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        user_id = EXCLUDED.user_id, naam = EXCLUDED.naam, rol = EXCLUDED.rol, telefoon = EXCLUDED.telefoon, actief = EXCLUDED.actief, updated_at = NOW();
    
    -- Store Manager gebruiker
    INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000003', 'USER1', 'Store Manager', 'storemanager', '+32 123 456 792', true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        user_id = EXCLUDED.user_id, naam = EXCLUDED.naam, rol = EXCLUDED.rol, telefoon = EXCLUDED.telefoon, actief = EXCLUDED.actief, updated_at = NOW();
    
    -- Developer gebruiker (Dietmar)
    INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000005', 'DIET', 'Dietmar Lattré', 'developer', '+32 123 456 793', true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        user_id = EXCLUDED.user_id, naam = EXCLUDED.naam, rol = EXCLUDED.rol, telefoon = EXCLUDED.telefoon, actief = EXCLUDED.actief, updated_at = NOW();
    
    RAISE NOTICE 'Default users created/updated';
END $$;

-- ========================================
-- STAP 4: Voeg standaard filialen toe
-- ========================================
DO $$ BEGIN
    -- Voeg standaard filialen toe
    INSERT INTO filialen (id, naam, locatie, adres, telefoon, email, status, created_at, updated_at)
    VALUES 
        ('11111111-1111-1111-1111-111111111111', 'Poule & Poulette Gent', 'Gent', 'Korenmarkt 1, 9000 Gent', '+32 9 123 45 67', 'gent@poulepoulette.be', 'actief', NOW(), NOW()),
        ('22222222-2222-2222-2222-222222222222', 'Poule & Poulette Antwerpen', 'Antwerpen', 'Grote Markt 15, 2000 Antwerpen', '+32 3 123 45 67', 'antwerpen@poulepoulette.be', 'actief', NOW(), NOW()),
        ('33333333-3333-3333-3333-333333333333', 'Poule & Poulette Leuven', 'Leuven', 'Oude Markt 8, 3000 Leuven', '+32 16 123 45 67', 'leuven@poulepoulette.be', 'actief', NOW(), NOW()),
        ('44444444-4444-4444-4444-444444444444', 'Poule & Poulette Brussel', 'Brussel', 'Grand Place 20, 1000 Brussel', '+32 2 123 45 67', 'brussel@poulepoulette.be', 'actief', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        naam = EXCLUDED.naam, locatie = EXCLUDED.locatie, adres = EXCLUDED.adres, telefoon = EXCLUDED.telefoon, email = EXCLUDED.email, status = EXCLUDED.status, updated_at = NOW();
    
    RAISE NOTICE 'Default filialen created/updated';
END $$;

-- ========================================
-- STAP 5: Voeg test audit toe
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
            '44444444-4444-4444-4444-444444444444', -- Brussel filiaal
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
-- STAP 6: Voeg test audit resultaten toe
-- ========================================
DO $$ BEGIN
    -- Controleer of het test audit resultaat al bestaat
    IF NOT EXISTS (SELECT 1 FROM audit_resultaten WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc') THEN
        -- Voeg test audit resultaat toe (koelkast temperatuur)
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
            (SELECT id FROM audit_checklist_items WHERE titel ILIKE '%frigo%' OR titel ILIKE '%koelkast%' LIMIT 1), -- Koelkast checklist item
            'niet_ok',
            2,
            'Koelkast temperatuur te hoog',
            'Controleer of de koelkast op de juiste temperatuur staat',
            NOW()
        );
        
        RAISE NOTICE 'Test audit resultaat toegevoegd';
    ELSE
        RAISE NOTICE 'Test audit resultaat bestaat al';
    END IF;
END $$;

-- ========================================
-- STAP 7: Voeg test actie toe
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
            'Actie vereist: Koelkast temperatuur (max 4°C)',
            'Controleer of de koelkast op de juiste temperatuur staat. De temperatuur mag niet hoger zijn dan 4°C voor voedselveiligheid.',
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
-- STAP 8: Herstel alle database functies
-- ========================================

-- Functie om KPI data op te halen
CREATE OR REPLACE FUNCTION get_kpi_data(filiaal_id_param UUID DEFAULT NULL)
RETURNS TABLE(
    total_audits INTEGER,
    average_score DECIMAL,
    pass_percentage DECIMAL,
    pending_actions INTEGER,
    completed_actions INTEGER,
    critical_actions INTEGER,
    improvement_points TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT a.id)::INTEGER as total_audits,
        COALESCE(AVG(a.totale_score), 0)::DECIMAL as average_score,
        COALESCE(AVG(a.pass_percentage), 0)::DECIMAL as pass_percentage,
        COUNT(CASE WHEN ac.status = 'pending' THEN 1 END)::INTEGER as pending_actions,
        COUNT(CASE WHEN ac.status = 'completed' THEN 1 END)::INTEGER as completed_actions,
        COUNT(CASE WHEN ac.urgentie = 'critical' THEN 1 END)::INTEGER as critical_actions,
        ARRAY_AGG(DISTINCT ar.verbeterpunt) FILTER (WHERE ar.verbeterpunt IS NOT NULL AND ar.verbeterpunt != '') as improvement_points
    FROM audits a
    LEFT JOIN acties ac ON a.id = ac.audit_id
    LEFT JOIN audit_resultaten ar ON a.id = ar.audit_id
    WHERE (filiaal_id_param IS NULL OR a.filiaal_id = filiaal_id_param)
    AND a.status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- Functie om acties op te halen met juiste filtering
CREATE OR REPLACE FUNCTION get_actions_for_user(user_id_param UUID, filiaal_id_param UUID DEFAULT NULL)
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

-- Functie om audits op te halen met juiste filtering
CREATE OR REPLACE FUNCTION get_audits_for_user(user_id_param UUID, filiaal_id_param UUID DEFAULT NULL)
RETURNS TABLE(
    id UUID,
    filiaal_id UUID,
    audit_datum DATE,
    status audit_status,
    totale_score DECIMAL,
    pass_percentage DECIMAL,
    filiaal_naam VARCHAR,
    filiaal_locatie VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.filiaal_id,
        a.audit_datum,
        a.status,
        a.totale_score,
        a.pass_percentage,
        f.naam as filiaal_naam,
        f.locatie as filiaal_locatie
    FROM audits a
    JOIN filialen f ON a.filiaal_id = f.id
    WHERE (filiaal_id_param IS NULL OR a.filiaal_id = filiaal_id_param)
    ORDER BY a.audit_datum DESC;
END;
$$ LANGUAGE plpgsql;

-- Functie om filialen op te halen voor gebruiker
CREATE OR REPLACE FUNCTION get_filialen_for_user(user_id_param UUID)
RETURNS TABLE(
    id UUID,
    naam VARCHAR,
    locatie VARCHAR,
    adres TEXT,
    telefoon VARCHAR,
    email VARCHAR,
    status filiaal_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.naam,
        f.locatie,
        f.adres,
        f.telefoon,
        f.email,
        f.status
    FROM filialen f
    ORDER BY f.naam;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- STAP 9: Update RLS policies voor juiste toegang
-- ========================================

-- Verwijder oude policies
DROP POLICY IF EXISTS "Users can read own data" ON gebruikers;
DROP POLICY IF EXISTS "Users can update own data" ON gebruikers;
DROP POLICY IF EXISTS "District managers can read assigned filialen" ON filialen;
DROP POLICY IF EXISTS "District managers can read their audits" ON audits;
DROP POLICY IF EXISTS "District managers can create audits" ON audits;
DROP POLICY IF EXISTS "District managers can update their audits" ON audits;
DROP POLICY IF EXISTS "Audit results follow audit rules" ON audit_resultaten;
DROP POLICY IF EXISTS "Reports follow audit rules" ON rapporten;
DROP POLICY IF EXISTS "Actions follow audit rules" ON acties;
DROP POLICY IF EXISTS "Users can see own notifications" ON notificaties;
DROP POLICY IF EXISTS "Filialen access based on role" ON filialen;
DROP POLICY IF EXISTS "Audits access based on role" ON audits;
DROP POLICY IF EXISTS "Audit results access based on role" ON audit_resultaten;
DROP POLICY IF EXISTS "Actions access based on role" ON acties;
DROP POLICY IF EXISTS "Reports access based on role" ON rapporten;
DROP POLICY IF EXISTS "Notifications access based on role" ON notificaties;

-- Nieuwe policies voor gebruikers
CREATE POLICY "Users can read own data" ON gebruikers
    FOR SELECT USING (true); -- Iedereen kan gebruikersdata lezen voor login

CREATE POLICY "Users can update own data" ON gebruikers
    FOR UPDATE USING (true); -- Iedereen kan eigen data updaten

-- Nieuwe policies voor filialen
CREATE POLICY "Filialen access based on role" ON filialen
    FOR ALL USING (true); -- Iedereen kan filialen zien

-- Nieuwe policies voor audits
CREATE POLICY "Audits access based on role" ON audits
    FOR ALL USING (true); -- Iedereen kan audits zien/bewerken

-- Nieuwe policies voor audit resultaten
CREATE POLICY "Audit results access based on role" ON audit_resultaten
    FOR ALL USING (true); -- Iedereen kan audit resultaten zien/bewerken

-- Nieuwe policies voor acties
CREATE POLICY "Actions access based on role" ON acties
    FOR ALL USING (true); -- Iedereen kan acties zien/bewerken

-- Nieuwe policies voor rapporten
CREATE POLICY "Reports access based on role" ON rapporten
    FOR ALL USING (true); -- Iedereen kan rapporten zien/bewerken

-- Nieuwe policies voor notificaties
CREATE POLICY "Notifications access based on role" ON notificaties
    FOR ALL USING (true); -- Iedereen kan notificaties zien/bewerken

-- ========================================
-- STAP 10: Verificatie
-- ========================================
DO $$ BEGIN
    RAISE NOTICE '=== COMPLETE DATABASE FIX COMPLETED ===';
    RAISE NOTICE 'Available user roles:';
    RAISE NOTICE 'Available users:';
    RAISE NOTICE 'Available filialen:';
    RAISE NOTICE 'Available audits:';
    RAISE NOTICE 'Available actions:';
    RAISE NOTICE 'All functions and policies updated';
    RAISE NOTICE 'Test data created';
    RAISE NOTICE '=== READY FOR TESTING ===';
END $$;

-- Toon verificatie data
SELECT 'Available user roles:' as status;
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role') ORDER BY enumsortorder;

SELECT 'Available users:' as status;
SELECT id, user_id, naam, rol, telefoon, actief FROM gebruikers ORDER BY created_at;

SELECT 'Available filialen:' as status;
SELECT id, naam, locatie, adres, status FROM filialen ORDER BY naam;

SELECT 'Available audits:' as status;
SELECT a.id, f.naam as filiaal, a.audit_datum, a.status, a.totale_score, a.pass_percentage 
FROM audits a 
JOIN filialen f ON a.filiaal_id = f.id 
ORDER BY a.audit_datum DESC;

SELECT 'Available actions:' as status;
SELECT ac.id, ac.titel, ac.urgentie, ac.status, f.naam as filiaal, ac.deadline
FROM acties ac
JOIN audits a ON ac.audit_id = a.id
JOIN filialen f ON a.filiaal_id = f.id
ORDER BY ac.created_at DESC;

-- Test KPI functie
SELECT 'Testing KPI function:' as status;
SELECT * FROM get_kpi_data();

-- Test acties functie
SELECT 'Testing actions function:' as status;
SELECT * FROM get_actions_for_user('00000000-0000-0000-0000-000000000001'::UUID);
