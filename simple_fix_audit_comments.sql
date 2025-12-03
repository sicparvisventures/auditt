-- Eenvoudige fix voor audit opmerkingen en verbeterpunten die niet worden weergegeven
-- Dit script controleert en repareert het probleem

-- STAP 1: Controleer de huidige situatie
SELECT 'DIAGNOSTIEK' as status;

-- Toon aantal audit resultaten per audit met opmerkingen/verbeterpunten
SELECT 
    a.id as audit_id,
    f.naam as filiaal_naam,
    a.audit_datum,
    COUNT(ar.id) as totaal_resultaten,
    COUNT(CASE WHEN ar.opmerkingen IS NOT NULL AND ar.opmerkingen != '' THEN 1 END) as met_opmerkingen,
    COUNT(CASE WHEN ar.verbeterpunt IS NOT NULL AND ar.verbeterpunt != '' THEN 1 END) as met_verbeterpunten
FROM audits a
JOIN filialen f ON a.filiaal_id = f.id
LEFT JOIN audit_resultaten ar ON a.id = ar.audit_id
GROUP BY a.id, f.naam, a.audit_datum
HAVING COUNT(CASE WHEN ar.opmerkingen IS NOT NULL AND ar.opmerkingen != '' THEN 1 END) > 0
   OR COUNT(CASE WHEN ar.verbeterpunt IS NOT NULL AND ar.verbeterpunt != '' THEN 1 END) > 0
ORDER BY a.audit_datum DESC;

-- STAP 2: Toon gedetailleerde resultaten voor de meest recente audit met opmerkingen
SELECT 'GEDETAILLEERDE RESULTATEN VOOR MEEST RECENTE AUDIT' as status;

WITH recent_audit AS (
    SELECT a.id
    FROM audits a
    JOIN audit_resultaten ar ON a.id = ar.audit_id
    WHERE ar.opmerkingen IS NOT NULL AND ar.opmerkingen != ''
    ORDER BY a.audit_datum DESC
    LIMIT 1
)
SELECT 
    aci.volgorde,
    aci.categorie,
    aci.titel,
    ar.resultaat,
    ar.score,
    CASE 
        WHEN ar.opmerkingen IS NULL THEN '[NULL]'
        WHEN ar.opmerkingen = '' THEN '[LEEG]'
        ELSE ar.opmerkingen
    END as opmerkingen_status,
    CASE 
        WHEN ar.verbeterpunt IS NULL THEN '[NULL]'
        WHEN ar.verbeterpunt = '' THEN '[LEEG]'
        ELSE ar.verbeterpunt
    END as verbeterpunt_status
FROM audit_resultaten ar
JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
JOIN recent_audit ra ON ar.audit_id = ra.id
ORDER BY aci.volgorde;

-- STAP 3: Repareer lege strings (converteer naar NULL voor consistentie)
SELECT 'REPARATIE: Converteer lege strings naar NULL' as status;

UPDATE audit_resultaten 
SET opmerkingen = NULL 
WHERE opmerkingen = '' OR opmerkingen = ' ' OR opmerkingen = '  ';

UPDATE audit_resultaten 
SET verbeterpunt = NULL 
WHERE verbeterpunt = '' OR verbeterpunt = ' ' OR verbeterpunt = '  ';

-- STAP 4: Controleer na reparatie
SELECT 'CONTROLE NA REPARATIE' as status;

SELECT 
    a.id as audit_id,
    COUNT(ar.id) as totaal_resultaten,
    COUNT(CASE WHEN ar.opmerkingen IS NOT NULL THEN 1 END) as met_opmerkingen,
    COUNT(CASE WHEN ar.verbeterpunt IS NOT NULL THEN 1 END) as met_verbeterpunten
FROM audits a
LEFT JOIN audit_resultaten ar ON a.id = ar.audit_id
GROUP BY a.id
HAVING COUNT(CASE WHEN ar.opmerkingen IS NOT NULL THEN 1 END) > 0
   OR COUNT(CASE WHEN ar.verbeterpunt IS NOT NULL THEN 1 END) > 0
ORDER BY a.created_at DESC
LIMIT 10;

-- STAP 5: Test de exacte query die de frontend gebruikt
SELECT 'TEST FRONTEND QUERY' as status;

-- Dit simuleert precies hoe Supabase de data ophaalt
SELECT 
    ar.id,
    ar.audit_id,
    ar.checklist_item_id,
    ar.resultaat,
    ar.score,
    ar.opmerkingen,
    ar.foto_urls,
    ar.verbeterpunt,
    ar.created_at,
    aci.id as checklist_item_id_inner,
    aci.titel,
    aci.beschrijving,
    aci.categorie,
    aci.gewicht
FROM audit_resultaten ar
JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
WHERE ar.audit_id IN (
    SELECT a.id
    FROM audits a
    JOIN audit_resultaten ar2 ON a.id = ar2.audit_id
    WHERE ar2.opmerkingen IS NOT NULL OR ar2.verbeterpunt IS NOT NULL
    ORDER BY a.audit_datum DESC
    LIMIT 1
)
ORDER BY aci.volgorde;

-- STAP 6: Voor debugging - toon alle resultaten van een specifieke audit
-- Vervang de UUID hieronder met de audit ID die problemen heeft
/*
SELECT 
    'SPECIFIEKE AUDIT TEST' as status,
    'Vervang de UUID hieronder met de juiste audit ID' as instructie;

SELECT 
    aci.volgorde,
    aci.categorie || ' - ' || aci.titel as item,
    ar.resultaat,
    ar.score,
    COALESCE(ar.opmerkingen, '[GEEN OPMERKING]') as opmerkingen,
    COALESCE(ar.verbeterpunt, '[GEEN VERBETERPUNT]') as verbeterpunt
FROM audit_resultaten ar
JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
WHERE ar.audit_id = 'VERVANG-MET-JUISTE-UUID'  -- <-- VERVANG DIT
ORDER BY aci.volgorde;
*/

