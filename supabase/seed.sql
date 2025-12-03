-- Seed data voor Poule & Poulette Interne Audit Tool

-- Admin gebruiker aanmaken (Filip van Hoeck)
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW());

-- Filialen toevoegen
INSERT INTO filialen (id, naam, locatie, district_manager_id, adres, telefoon, email, status, created_at, updated_at)
VALUES 
  ('filiaal-1', 'Gent - KM11', 'Gent', '00000000-0000-0000-0000-000000000001', 'Korenmarkt 11, 9000 Gent', '+32 9 245 75 85', 'km11@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-2', 'Etterbeek - PJ70', 'Etterbeek', '00000000-0000-0000-0000-000000000001', 'Place Jourdan 70, 1040 Etterbeek', '+32 2 759 42 97', 'pj70@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-3', 'Mechelen - IL36', 'Mechelen', '00000000-0000-0000-0000-000000000001', 'Ijzerenleen 36, 2800 Mechelen', '+32 15 528 35 1', 'il36@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-4', 'Leuven - TS15', 'Leuven', '00000000-0000-0000-0000-000000000001', 'Tiensestraat 15, 3000 Leuven', '+32 16 792 15 2', 'ts15@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-5', 'Antwerpen - GK2', 'Antwerpen', '00000000-0000-0000-0000-000000000001', 'Godfrieduskaai 2, 2000 Antwerpen', '+32 3 828 38 22', 'gk2@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-6', 'Oostende - IL34', 'Oostende', '00000000-0000-0000-0000-000000000001', 'Leopold II Laan 34, 8400 Oostende', '+32 59 709 25 55', 'il34@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-7', 'Brussel - TL24', 'Brussel', '00000000-0000-0000-0000-000000000001', 'Tervurenlaan 24a, 1040 Brussel', '+32 2 895 57 00', 'tl24@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-8', 'Brussel - SC2', 'Brussel', '00000000-0000-0000-0000-000000000001', 'Place Saint-Catherine 2, 1000 Brussel', '+32 2 895 57 00', 'sc2@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-9', 'Brugge - SS3', 'Brugge', '00000000-0000-0000-0000-000000000001', 'Simon Stevinplein 3, 8000 Brugge', '+32 50 893 70 00', 'ss3@poulepoulette.com', 'actief', NOW(), NOW());

-- Checklist items toevoegen
INSERT INTO audit_checklist_items (id, categorie, titel, beschrijving, gewicht, volgorde, actief, created_at)
VALUES 
  ('item-1', 'Buitenkant Zaak', 'Terras uitnodigend (tafels ingedekt - operationeel)', 'Controleer of de tafels netjes zijn gedekt, het terras netjes wordt gepresenteerd en gereed is voor gasten', 1.5, 1, true, NOW()),
  ('item-2', 'Buitenkant Zaak', 'Terras proper (vloer/meubilair)', 'Vloer en meubilair moeten schoon zijn en er mag geen rommel liggen', 1.3, 2, true, NOW()),
  ('item-3', 'Spotchecks', 'Inkomzone proper en ordelijk', 'De ingang moet netjes en opgeruimd zijn. Geen rommel, schone vloeren en geen obstakels', 1.5, 3, true, NOW()),
  ('item-4', 'Algemene Properheid', 'Keuken', 'Werkbladen moeten schoon zijn zonder etensresten, en alle producten moeten goed afgesloten zijn om besmetting te voorkomen', 2.0, 4, true, NOW()),
  ('item-5', 'FIFO Controle', 'Frigo keuken', 'In de koelkasten moet volgens het FIFO-principe (First In, First Out) gewerkt worden en mogen er geen verlopen producten zijn', 2.0, 5, true, NOW());

-- Audits toevoegen
INSERT INTO audits (id, filiaal_id, district_manager_id, audit_datum, status, totale_score, pass_percentage, opmerkingen, created_at, updated_at)
VALUES 
  ('audit-1', 'filiaal-1', '00000000-0000-0000-0000-000000000001', '2024-01-15', 'completed', 4.2, 84.0, 'Goede algemene staat, kleine verbeterpunten bij FIFO controle', '2024-01-15T10:00:00Z', '2024-01-15T10:00:00Z'),
  ('audit-2', 'filiaal-1', '00000000-0000-0000-0000-000000000001', '2024-01-08', 'completed', 3.8, 76.0, 'Koelkast temperatuur te hoog, FIFO niet correct nageleefd', '2024-01-08T14:30:00Z', '2024-01-08T14:30:00Z'),
  ('audit-3', 'filiaal-2', '00000000-0000-0000-0000-000000000001', '2024-01-12', 'completed', 4.6, 92.0, 'Uitstekende staat, alle punten in orde', '2024-01-12T09:15:00Z', '2024-01-12T09:15:00Z');

-- Audit resultaten toevoegen
INSERT INTO audit_resultaten (id, audit_id, checklist_item_id, resultaat, opmerkingen, foto_urls, score, created_at)
VALUES 
  ('result-1', 'audit-1', 'item-1', 'ok', 'Gevel en ramen zijn schoon', '[]', 1.0, '2024-01-15T10:00:00Z'),
  ('result-2', 'audit-1', 'item-2', 'ok', 'Ingang en deur zijn proper', '[]', 1.0, '2024-01-15T10:00:00Z'),
  ('result-3', 'audit-1', 'item-3', 'ok', 'Koelkast temperatuur is correct', '[]', 1.5, '2024-01-15T10:00:00Z'),
  ('result-4', 'audit-1', 'item-4', 'ok', 'Vloeren zijn schoon', '[]', 1.0, '2024-01-15T10:00:00Z'),
  ('result-5', 'audit-1', 'item-5', 'niet_ok', 'FIFO niet correct nageleefd', '[]', 0.0, '2024-01-15T10:00:00Z'),
  ('result-6', 'audit-2', 'item-1', 'ok', 'Gevel en ramen zijn schoon', '[]', 1.0, '2024-01-08T14:30:00Z'),
  ('result-7', 'audit-2', 'item-2', 'ok', 'Ingang en deur zijn proper', '[]', 1.0, '2024-01-08T14:30:00Z'),
  ('result-8', 'audit-2', 'item-3', 'niet_ok', 'Koelkast temperatuur te hoog', '[]', 0.0, '2024-01-08T14:30:00Z'),
  ('result-9', 'audit-2', 'item-4', 'ok', 'Vloeren zijn schoon', '[]', 1.0, '2024-01-08T14:30:00Z'),
  ('result-10', 'audit-2', 'item-5', 'niet_ok', 'FIFO niet correct nageleefd', '[]', 0.0, '2024-01-08T14:30:00Z'),
  ('result-11', 'audit-3', 'item-1', 'ok', 'Gevel en ramen zijn schoon', '[]', 1.0, '2024-01-12T09:15:00Z'),
  ('result-12', 'audit-3', 'item-2', 'ok', 'Ingang en deur zijn proper', '[]', 1.0, '2024-01-12T09:15:00Z'),
  ('result-13', 'audit-3', 'item-3', 'ok', 'Koelkast temperatuur is correct', '[]', 1.5, '2024-01-12T09:15:00Z'),
  ('result-14', 'audit-3', 'item-4', 'ok', 'Vloeren zijn schoon', '[]', 1.0, '2024-01-12T09:15:00Z'),
  ('result-15', 'audit-3', 'item-5', 'ok', 'FIFO correct nageleefd', '[]', 1.3, '2024-01-12T09:15:00Z');
