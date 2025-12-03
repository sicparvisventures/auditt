-- QUICK FIX - Run dit eerst om de database te resetten
-- Run dit in je Supabase SQL Editor

-- Disable RLS
ALTER TABLE IF EXISTS gebruikers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS filialen DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audits DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_resultaten DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS rapporten DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS acties DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notificaties DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_checklist_items DISABLE ROW LEVEL SECURITY;

-- Clear all data
DELETE FROM audit_resultaten;
DELETE FROM acties;
DELETE FROM notificaties;
DELETE FROM rapporten;
DELETE FROM audits;
DELETE FROM filialen;
DELETE FROM gebruikers;
DELETE FROM audit_checklist_items;

-- Add minimal data for testing
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip Van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW());

INSERT INTO filialen (id, naam, locatie, district_manager_id, adres, telefoon, email, status, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Gent - KM11', 'Gent', '00000000-0000-0000-0000-000000000001', 'Korenmarkt 11, 9000 Gent', '+32 9 245 75 85', 'km11@poulepoulette.com', 'actief', NOW(), NOW());

-- Add 5 basic checklist items
INSERT INTO audit_checklist_items (id, categorie, titel, beschrijving, gewicht, volgorde, actief, created_at)
VALUES
  (gen_random_uuid(), 'HACCP', 'Koelkast temperatuur (max 4°C)', 'Controleer of de koelkast op de juiste temperatuur staat', 2.0, 1, true, NOW()),
  (gen_random_uuid(), 'HACCP', 'FIFO principe (First In, First Out)', 'Controleer of producten correct gerangschikt zijn volgens vervaldatum', 1.5, 2, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Keuken vloeren', 'Controleer de schoonheid van de keuken vloeren', 1.5, 3, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Keuken werkbladen', 'Controleer de schoonheid van de werkbladen', 1.5, 4, true, NOW()),
  (gen_random_uuid(), 'Algemene Properheid', 'Toiletten', 'Controleer de schoonheid van de toiletten', 1.5, 5, true, NOW());

-- Test query
SELECT 'Quick fix completed!' as status;
SELECT COUNT(*) as users FROM gebruikers;
SELECT COUNT(*) as filialen FROM filialen;
SELECT COUNT(*) as checklist_items FROM audit_checklist_items;
