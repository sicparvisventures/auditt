-- Reset database en voeg seed data toe
-- Run dit in je Supabase SQL Editor

-- Verwijder alle bestaande data
DELETE FROM notificaties;
DELETE FROM acties;
DELETE FROM rapporten;
DELETE FROM audit_resultaten;
DELETE FROM audits;
DELETE FROM filialen;
DELETE FROM gebruikers;

-- Admin gebruiker aanmaken (Filip Van Hoeck)
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

-- Filialen toevoegen
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

-- Recente audits toevoegen
INSERT INTO audits (id, filiaal_id, district_manager_id, audit_datum, status, totale_score, pass_percentage, opmerkingen, created_at, updated_at)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003', '2024-01-15', 'completed', 4.2, 84.0, 'Goede algemene staat, kleine verbeterpunten bij FIFO controle', '2024-01-15T10:00:00Z', '2024-01-15T10:00:00Z'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003', '2024-01-08', 'completed', 3.8, 76.0, 'Koelkast temperatuur te hoog, FIFO niet correct nageleefd', '2024-01-08T14:30:00Z', '2024-01-08T14:30:00Z'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000003', '2024-01-12', 'completed', 4.6, 92.0, 'Uitstekende staat, alle punten in orde', '2024-01-12T09:15:00Z', '2024-01-12T09:15:00Z');

-- Verificatie query
SELECT 'Database reset en seed data toegevoegd!' as status;

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
    'Audits' as table_name, 
    COUNT(*) as count 
FROM audits;
