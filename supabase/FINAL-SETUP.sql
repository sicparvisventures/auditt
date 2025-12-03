-- Poule & Poulette Interne Audit Tool - FINAL SETUP
-- Run dit bestand in je Supabase SQL Editor voor de volledige setup

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

-- STAP 3: Admin gebruiker aanmaken (Filip Van Hoeck)
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip Van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW());

-- COO gebruiker
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'COO01', 'Sarah De Vries', 'coo', '+32 123 456 790', true, NOW(), NOW());

-- District Managers
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'DM001', 'Tom Janssen', 'district_manager', '+32 123 456 791', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'DM002', 'Lisa Peeters', 'district_manager', '+32 123 456 792', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 'DM003', 'Marc Van Der Berg', 'district_manager', '+32 123 456 793', true, NOW(), NOW());

-- STAP 4: Filialen toevoegen
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

-- STAP 5: Audit checklist items toevoegen
INSERT INTO audit_checklist_items (id, categorie, titel, beschrijving, gewicht, volgorde, actief, created_at)
VALUES
  (gen_random_uuid(), 'HACCP', 'Koelkast temperatuur (max 4°C)', 'Controleer of de koelkast op de juiste temperatuur staat', 2.0, 1, true, NOW()),
  (gen_random_uuid(), 'HACCP', 'FIFO principe (First In, First Out)', 'Controleer of producten correct gerangschikt zijn volgens vervaldatum', 1.5, 2, true, NOW()),
  (gen_random_uuid(), 'HACCP', 'Diepvries temperatuur (max -18°C)', 'Controleer of de diepvries op de juiste temperatuur staat', 2.0, 3, true, NOW()),
  (gen_random_uuid(), 'HACCP', 'Temperatuur registratie', 'Controleer of temperaturen correct worden bijgehouden', 1.5, 4, true, NOW()),
  (gen_random_uuid(), 'HACCP', 'Bewaring producten (afgedekt, gelabeld)', 'Controleer of alle producten correct zijn opgeslagen', 1.5, 5, true, NOW()),
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
  (gen_random_uuid(), 'Operationele Checks', 'Stock management (voorraad, bestellingen)', 'Controleer of de voorraad correct wordt beheerd', 1.5, 17, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Personeel hygiëne (handen wassen, schorten)', 'Controleer of personeel de hygiëneregels volgt', 2.0, 18, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Afval scheiding', 'Controleer of afval correct wordt gescheiden', 1.0, 19, true, NOW()),
  (gen_random_uuid(), 'Operationele Checks', 'Veiligheid (brandblussers, nooduitgangen, EHBO)', 'Controleer of de veiligheidsmaatregelen op hun plaats zijn en goed werken', 1.5, 20, true, NOW());

-- STAP 6: Verificatie
SELECT 'Setup completed successfully!' as status;

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
