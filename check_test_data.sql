-- Quick script om te kijken wat test data er in zit

-- 1. Show all acties with test in beschrijving
SELECT 
    a.id,
    a.titel,
    a.beschrijving,
    a.status,
    a.created_at
FROM acties a
WHERE a.beschrijving ILIKE '%test%'
ORDER BY a.created_at DESC;

-- 2. Show all audit_resultaten with test in opmerkingen/verbeterpunt
SELECT 
    ar.id,
    ar.opmerkingen,
    ar.verbeterpunt,
    ar.score,
    aci.titel as item_titel,
    ar.created_at
FROM audit_resultaten ar
JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
WHERE ar.opmerkingen ILIKE '%test%' 
   OR ar.verbeterpunt ILIKE '%test%'
ORDER BY ar.created_at DESC;

-- 3. Count how many actions have test description
SELECT COUNT(*) as actions_with_test
FROM acties a
WHERE a.beschrijving ILIKE '%test%';

-- 4. Count how many audit results have test fields
SELECT COUNT(*) as audit_results_with_test
FROM audit_resultaten ar
WHERE ar.opmerkingen ILIKE '%test%' 
   OR ar.verbeterpunt ILIKE '%test%';

