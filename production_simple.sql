-- SIMPLE PRODUCTION SETUP
-- This disables RLS for production (same as localhost)
-- Use this if you want the same behavior as localhost

-- Insert seed data
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip Van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'INSP1', 'Inspector User', 'inspector', '+32 123 456 790', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'INSP2', 'Tom Janssen', 'inspector', '+32 123 456 791', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'INSP3', 'Lisa Peeters', 'inspector', '+32 123 456 792', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', 'STORE', 'Marc Van Der Berg', 'storemanager', '+32 123 456 793', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000006', 'STR01', 'Anna De Smet', 'storemanager', '+32 123 456 794', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000007', 'STR02', 'Store Manager 2', 'storemanager', '+32 123 456 795', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000008', 'DEV01', 'Developer User', 'developer', '+32 123 456 796', true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000009', 'DEV02', 'Developer User 2', 'developer', '+32 123 456 797', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
user_id = EXCLUDED.user_id, naam = EXCLUDED.naam, rol = EXCLUDED.rol, 
telefoon = EXCLUDED.telefoon, actief = EXCLUDED.actief, updated_at = NOW();

INSERT INTO filialen (id, naam, locatie, district_manager_id, adres, telefoon, email, status, created_at, updated_at)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Gent - KM11', 'Gent', '00000000-0000-0000-0000-000000000002', 'Korenmarkt 11, 9000 Gent', '+32 9 245 75 85', 'km11@poulepoulette.com', 'actief', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Etterbeek - PJ70', 'Etterbeek', '00000000-0000-0000-0000-000000000002', 'Place Jourdan 70, 1040 Etterbeek', '+32 2 759 42 97', 'pj70@poulepoulette.com', 'actief', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Mechelen - IL36', 'Mechelen', '00000000-0000-0000-0000-000000000003', 'Ijzerenleen 36, 2800 Mechelen', '+32 15 528 35 1', 'il36@poulepoulette.com', 'actief', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Leuven - TS15', 'Leuven', '00000000-0000-0000-0000-000000000003', 'Tiensestraat 15, 3000 Leuven', '+32 16 792 15 2', 'ts15@poulepoulette.com', 'actief', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Antwerpen - GK2', 'Antwerpen', '00000000-0000-0000-0000-000000000004', 'Godfrieduskaai 2, 2000 Antwerpen', '+32 3 828 38 22', 'gk2@poulepoulette.com', 'actief', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'Oostende - IL34', 'Oostende', '00000000-0000-0000-0000-000000000004', 'Leopold II Laan 34, 8400 Oostende', '+32 59 709 25 55', 'il34@poulepoulette.com', 'actief', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Brussel - TL24', 'Brussel', '00000000-0000-0000-0000-000000000005', 'Tervurenlaan 24a, 1040 Brussel', '+32 2 895 57 00', 'tl24@poulepoulette.com', 'actief', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'Brussel - SC2', 'Brussel', '00000000-0000-0000-0000-000000000005', 'Place Saint-Catherine 2, 1000 Brussel', '+32 2 895 57 01', 'sc2@poulepoulette.com', 'actief', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'Brugge - SS3', 'Brugge', '00000000-0000-0000-0000-000000000006', 'Simon Stevinplein 3, 8000 Brugge', '+32 50 893 70 00', 'ss3@poulepoulette.com', 'actief', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
naam = EXCLUDED.naam, locatie = EXCLUDED.locatie, district_manager_id = EXCLUDED.district_manager_id, 
adres = EXCLUDED.adres, telefoon = EXCLUDED.telefoon, email = EXCLUDED.email, 
status = EXCLUDED.status, updated_at = NOW();

-- DISABLE RLS for production (same as localhost)
ALTER TABLE gebruikers DISABLE ROW LEVEL SECURITY;
ALTER TABLE filialen DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_checklist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE audits DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_resultaten DISABLE ROW LEVEL SECURITY;
ALTER TABLE acties DISABLE ROW LEVEL SECURITY;
ALTER TABLE rapporten DISABLE ROW LEVEL SECURITY;
ALTER TABLE notificaties DISABLE ROW LEVEL SECURITY;

-- Verify setup
SELECT 'SIMPLE PRODUCTION SETUP COMPLETE' as status;
SELECT 'gebruikers' as table_name, COUNT(*) as count FROM gebruikers;
SELECT 'filialen' as table_name, COUNT(*) as count FROM filialen;

