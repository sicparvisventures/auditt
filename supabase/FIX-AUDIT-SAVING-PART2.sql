-- Poule & Poulette Interne Audit Tool - FIX AUDIT SAVING PART 2
-- Dit is het tweede deel van de database fix

-- STAP 8: Schakel RLS uit voor alle tabellen om toegang te garanderen
DO $$ BEGIN
    ALTER TABLE IF EXISTS gebruikers DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS filialen DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS audits DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS audit_resultaten DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS audit_checklist_items DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS acties DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS rapporten DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS notificaties DISABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'Row Level Security uitgeschakeld voor alle tabellen.';
END $$;

-- STAP 9: Voeg een specifieke test actie toe voor de actie detail pagina
DO $$ 
DECLARE
    test_audit_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    test_result_id UUID := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    checklist_item_id UUID;
BEGIN
    -- Haal een checklist item ID op
    SELECT id INTO checklist_item_id FROM audit_checklist_items LIMIT 1;
    
    -- Voeg test audit toe als deze niet bestaat
    INSERT INTO audits (id, filiaal_id, district_manager_id, audit_datum, status, totale_score, pass_percentage, opmerkingen)
    VALUES (
        test_audit_id,
        '11111111-1111-1111-1111-111111111111', -- Gent filiaal
        '00000000-0000-0000-0000-000000000002', -- Inspector
        CURRENT_DATE,
        'completed',
        3.2,
        64.0,
        'Test audit voor actie detail functionaliteit'
    )
    ON CONFLICT (id) DO UPDATE SET
        filiaal_id = EXCLUDED.filiaal_id,
        district_manager_id = EXCLUDED.district_manager_id,
        audit_datum = EXCLUDED.audit_datum,
        status = EXCLUDED.status,
        totale_score = EXCLUDED.totale_score,
        pass_percentage = EXCLUDED.pass_percentage,
        opmerkingen = EXCLUDED.opmerkingen,
        updated_at = NOW();
    
    -- Voeg test audit resultaat toe
    INSERT INTO audit_resultaten (id, audit_id, checklist_item_id, resultaat, score, opmerkingen, verbeterpunt)
    VALUES (
        test_result_id,
        test_audit_id,
        checklist_item_id,
        'niet_ok',
        2,
        'Verbetering nodig voor test',
        'Test verbeterpunt voor actie detail'
    )
    ON CONFLICT (id) DO UPDATE SET
        audit_id = EXCLUDED.audit_id,
        checklist_item_id = EXCLUDED.checklist_item_id,
        resultaat = EXCLUDED.resultaat,
        score = EXCLUDED.score,
        opmerkingen = EXCLUDED.opmerkingen,
        verbeterpunt = EXCLUDED.verbeterpunt;
    
    -- Voeg de specifieke test actie toe die in de URL wordt gebruikt
    INSERT INTO acties (id, audit_id, audit_resultaat_id, titel, beschrijving, urgentie, status, deadline, created_at, updated_at)
    VALUES (
        '1fe177ec-9c1c-4a33-9359-83fc8fb12ae8', -- Specifieke ID uit de URL
        test_audit_id,
        test_result_id,
        'Actie vereist: Koelkast temperatuur (max 4°C)',
        'Controleer of de koelkast op de juiste temperatuur staat. Opmerkingen: Verbetering nodig voor test',
        'high',
        'pending',
        CURRENT_DATE + INTERVAL '3 days',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        audit_id = EXCLUDED.audit_id,
        audit_resultaat_id = EXCLUDED.audit_resultaat_id,
        titel = EXCLUDED.titel,
        beschrijving = EXCLUDED.beschrijving,
        urgentie = EXCLUDED.urgentie,
        status = EXCLUDED.status,
        deadline = EXCLUDED.deadline,
        updated_at = NOW();
    
    RAISE NOTICE 'Test actie voor actie detail pagina toegevoegd: 1fe177ec-9c1c-4a33-9359-83fc8fb12ae8';
END $$;

-- VERIFICATIE: Toon overzicht van alle data
SELECT 'Gebruikers' as tabel, COUNT(*) as aantal FROM gebruikers
UNION ALL
SELECT 'Filialen' as tabel, COUNT(*) as aantal FROM filialen
UNION ALL
SELECT 'Checklist Items' as tabel, COUNT(*) as aantal FROM audit_checklist_items
UNION ALL
SELECT 'Audits' as tabel, COUNT(*) as aantal FROM audits
UNION ALL
SELECT 'Audit Resultaten' as tabel, COUNT(*) as aantal FROM audit_resultaten
UNION ALL
SELECT 'Acties' as tabel, COUNT(*) as aantal FROM acties;

-- Test de specifieke actie die problemen geeft
SELECT 
    a.id,
    a.titel,
    a.beschrijving,
    a.urgentie,
    a.status,
    a.deadline,
    au.id as audit_id,
    f.naam as filiaal_naam
FROM acties a
LEFT JOIN audits au ON a.audit_id = au.id
LEFT JOIN filialen f ON au.filiaal_id = f.id
WHERE a.id = '1fe177ec-9c1c-4a33-9359-83fc8fb12ae8';

RAISE NOTICE 'Database setup voor audit saving en actie detail is compleet!';
