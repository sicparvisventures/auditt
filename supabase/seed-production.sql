-- Poule & Poulette Interne Audit Tool - Production Seed Data
-- Realistische data voor productie gebruik

-- Admin gebruiker aanmaken (Filip van Hoeck)
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW());

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

-- Filiaal Managers
INSERT INTO gebruikers (id, user_id, naam, rol, telefoon, actief, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000006', 'FM001', 'Anna De Smet', 'filiaal_manager', '+32 123 456 794', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000007', 'FM002', 'Jeroen Vandenberghe', 'filiaal_manager', '+32 123 456 795', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000008', 'FM003', 'Sophie Willems', 'filiaal_manager', '+32 123 456 796', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000009', 'FM004', 'Kevin De Backer', 'filiaal_manager', '+32 123 456 797', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000010', 'FM005', 'Nathalie Jacobs', 'filiaal_manager', '+32 123 456 798', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000011', 'FM006', 'Dimitri Van Damme', 'filiaal_manager', '+32 123 456 799', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000012', 'FM007', 'Eline De Clercq', 'filiaal_manager', '+32 123 456 800', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000013', 'FM008', 'Robbe Van Den Bossche', 'filiaal_manager', '+32 123 456 801', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000014', 'FM009', 'Lotte De Meyer', 'filiaal_manager', '+32 123 456 802', true, NOW(), NOW());

-- Filialen toevoegen
INSERT INTO filialen (id, naam, locatie, district_manager_id, adres, telefoon, email, status, created_at, updated_at)
VALUES 
  -- District 1 - Tom Janssen
  ('filiaal-1', 'Gent - KM11', 'Gent', '00000000-0000-0000-0000-000000000003', 'Korenmarkt 11, 9000 Gent', '+32 9 245 75 85', 'km11@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-2', 'Etterbeek - PJ70', 'Etterbeek', '00000000-0000-0000-0000-000000000003', 'Place Jourdan 70, 1040 Etterbeek', '+32 2 759 42 97', 'pj70@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-3', 'Mechelen - IL36', 'Mechelen', '00000000-0000-0000-0000-000000000003', 'Ijzerenleen 36, 2800 Mechelen', '+32 15 528 35 1', 'il36@poulepoulette.com', 'actief', NOW(), NOW()),
  
  -- District 2 - Lisa Peeters
  ('filiaal-4', 'Leuven - TS15', 'Leuven', '00000000-0000-0000-0000-000000000004', 'Tiensestraat 15, 3000 Leuven', '+32 16 792 15 2', 'ts15@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-5', 'Antwerpen - GK2', 'Antwerpen', '00000000-0000-0000-0000-000000000004', 'Godfrieduskaai 2, 2000 Antwerpen', '+32 3 828 38 22', 'gk2@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-6', 'Oostende - IL34', 'Oostende', '00000000-0000-0000-0000-000000000004', 'Leopold II Laan 34, 8400 Oostende', '+32 59 709 25 55', 'il34@poulepoulette.com', 'actief', NOW(), NOW()),
  
  -- District 3 - Marc Van Der Berg
  ('filiaal-7', 'Brussel - TL24', 'Brussel', '00000000-0000-0000-0000-000000000005', 'Tervurenlaan 24a, 1040 Brussel', '+32 2 895 57 00', 'tl24@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-8', 'Brussel - SC2', 'Brussel', '00000000-0000-0000-0000-000000000005', 'Place Saint-Catherine 2, 1000 Brussel', '+32 2 895 57 00', 'sc2@poulepoulette.com', 'actief', NOW(), NOW()),
  ('filiaal-9', 'Brugge - SS3', 'Brugge', '00000000-0000-0000-0000-000000000005', 'Simon Stevinplein 3, 8000 Brugge', '+32 50 893 70 00', 'ss3@poulepoulette.com', 'actief', NOW(), NOW());

-- Recente audits toevoegen (laatste 3 maanden)
INSERT INTO audits (id, filiaal_id, district_manager_id, audit_datum, status, totale_score, pass_percentage, opmerkingen, created_at, updated_at)
VALUES 
  -- Gent - KM11
  ('audit-1', 'filiaal-1', '00000000-0000-0000-0000-000000000003', '2024-01-15', 'completed', 4.2, 84.0, 'Goede algemene staat, kleine verbeterpunten bij FIFO controle', '2024-01-15T10:00:00Z', '2024-01-15T10:00:00Z'),
  ('audit-2', 'filiaal-1', '00000000-0000-0000-0000-000000000003', '2024-01-08', 'completed', 3.8, 76.0, 'Koelkast temperatuur te hoog, FIFO niet correct nageleefd', '2024-01-08T14:30:00Z', '2024-01-08T14:30:00Z'),
  ('audit-3', 'filiaal-1', '00000000-0000-0000-0000-000000000003', '2023-12-20', 'completed', 4.5, 90.0, 'Uitstekende staat, alle punten in orde', '2023-12-20T09:15:00Z', '2023-12-20T09:15:00Z'),
  
  -- Etterbeek - PJ70
  ('audit-4', 'filiaal-2', '00000000-0000-0000-0000-000000000003', '2024-01-12', 'completed', 4.6, 92.0, 'Uitstekende staat, alle punten in orde', '2024-01-12T09:15:00Z', '2024-01-12T09:15:00Z'),
  ('audit-5', 'filiaal-2', '00000000-0000-0000-0000-000000000003', '2023-12-28', 'completed', 4.1, 82.0, 'Goede staat, kleine aandachtspunten bij hygiëne', '2023-12-28T11:30:00Z', '2023-12-28T11:30:00Z'),
  
  -- Mechelen - IL36
  ('audit-6', 'filiaal-3', '00000000-0000-0000-0000-000000000003', '2024-01-10', 'completed', 3.9, 78.0, 'Verbeterpunten bij terras properheid en FIFO controle', '2024-01-10T14:00:00Z', '2024-01-10T14:00:00Z'),
  ('audit-7', 'filiaal-3', '00000000-0000-0000-0000-000000000003', '2023-12-15', 'completed', 4.3, 86.0, 'Goede algemene staat', '2023-12-15T10:45:00Z', '2023-12-15T10:45:00Z'),
  
  -- Leuven - TS15
  ('audit-8', 'filiaal-4', '00000000-0000-0000-0000-000000000004', '2024-01-18', 'completed', 4.4, 88.0, 'Zeer goede staat, kleine verbeterpunten', '2024-01-18T13:20:00Z', '2024-01-18T13:20:00Z'),
  ('audit-9', 'filiaal-4', '00000000-0000-0000-0000-000000000004', '2023-12-22', 'completed', 4.0, 80.0, 'Goede staat, aandacht voor FIFO procedures', '2023-12-22T15:10:00Z', '2023-12-22T15:10:00Z'),
  
  -- Antwerpen - GK2
  ('audit-10', 'filiaal-5', '00000000-0000-0000-0000-000000000004', '2024-01-14', 'completed', 3.7, 74.0, 'Verbeterpunten bij keukenhygiëne en FIFO controle', '2024-01-14T12:00:00Z', '2024-01-14T12:00:00Z'),
  ('audit-11', 'filiaal-5', '00000000-0000-0000-0000-000000000004', '2023-12-18', 'completed', 4.2, 84.0, 'Goede staat, kleine verbeterpunten', '2023-12-18T16:30:00Z', '2023-12-18T16:30:00Z'),
  
  -- Oostende - IL34
  ('audit-12', 'filiaal-6', '00000000-0000-0000-0000-000000000004', '2024-01-16', 'completed', 4.5, 90.0, 'Uitstekende staat, alle punten in orde', '2024-01-16T11:15:00Z', '2024-01-16T11:15:00Z'),
  ('audit-13', 'filiaal-6', '00000000-0000-0000-0000-000000000004', '2023-12-25', 'completed', 4.1, 82.0, 'Goede staat, kleine aandachtspunten', '2023-12-25T14:45:00Z', '2023-12-25T14:45:00Z'),
  
  -- Brussel - TL24
  ('audit-14', 'filiaal-7', '00000000-0000-0000-0000-000000000005', '2024-01-13', 'completed', 3.6, 72.0, 'Verbeterpunten bij terras en keukenhygiëne', '2024-01-13T10:30:00Z', '2024-01-13T10:30:00Z'),
  ('audit-15', 'filiaal-7', '00000000-0000-0000-0000-000000000005', '2023-12-30', 'completed', 4.0, 80.0, 'Goede staat, aandacht voor FIFO', '2023-12-30T13:00:00Z', '2023-12-30T13:00:00Z'),
  
  -- Brussel - SC2
  ('audit-16', 'filiaal-8', '00000000-0000-0000-0000-000000000005', '2024-01-11', 'completed', 4.3, 86.0, 'Goede algemene staat', '2024-01-11T15:20:00Z', '2024-01-11T15:20:00Z'),
  ('audit-17', 'filiaal-8', '00000000-0000-0000-0000-000000000005', '2023-12-19', 'completed', 3.8, 76.0, 'Verbeterpunten bij hygiëne en FIFO', '2023-12-19T12:15:00Z', '2023-12-19T12:15:00Z'),
  
  -- Brugge - SS3
  ('audit-18', 'filiaal-9', '00000000-0000-0000-0000-000000000005', '2024-01-17', 'completed', 4.7, 94.0, 'Uitstekende staat, voorbeeld voor andere filialen', '2024-01-17T09:45:00Z', '2024-01-17T09:45:00Z'),
  ('audit-18', 'filiaal-9', '00000000-0000-0000-0000-000000000005', '2023-12-23', 'completed', 4.4, 88.0, 'Zeer goede staat', '2023-12-23T16:00:00Z', '2023-12-23T16:00:00Z');

-- Audit resultaten toevoegen voor recente audits
INSERT INTO audit_resultaten (id, audit_id, checklist_item_id, resultaat, score, opmerkingen, foto_urls, verbeterpunt, created_at)
VALUES 
  -- Audit 1 - Gent KM11 (goede staat)
  ('result-1', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 1), 'ok', 5, 'Terras netjes gedekt en operationeel', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-2', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 2), 'ok', 5, 'Vloer en meubilair schoon', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-3', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 3), 'ok', 5, 'Plantenbakken in goede staat', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-4', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 4), 'ok', 5, 'Inkomzone proper en ordelijk', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-5', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 5), 'ok', 5, 'Geen sporen van ongedierte', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-6', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 6), 'ok', 5, 'Risicoplaatsen proper', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-7', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 7), 'ok', 5, 'Keuken schoon en georganiseerd', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-8', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 8), 'ok', 5, 'Zaal netjes', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-9', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 9), 'ok', 5, 'Toiletten hygiënisch', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-10', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 10), 'ok', 5, 'Kelder schoon en droog', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-11', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 11), 'ok', 5, 'Extra ruimtes netjes', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-12', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 12), 'niet_ok', 2, 'FIFO niet correct nageleefd', '{}', 'Producten herorganiseren volgens vervaldatum', '2024-01-15T10:00:00Z'),
  ('result-13', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 13), 'ok', 5, 'Vriezer goed georganiseerd', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-14', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 14), 'ok', 5, 'Bar frigo in orde', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-15', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 15), 'ok', 5, 'Personeelsbezetting adequaat', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-16', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 16), 'ok', 5, 'Kassaprocedures correct', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-17', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 17), 'ok', 5, 'Voorraadniveaus op peil', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-18', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 18), 'ok', 5, 'Promoties correct uitgevoerd', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-19', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 19), 'ok', 5, 'Goede gastbeleving', '{}', NULL, '2024-01-15T10:00:00Z'),
  ('result-20', 'audit-1', (SELECT id FROM audit_checklist_items WHERE volgorde = 20), 'ok', 5, 'Veiligheidsmaatregelen in orde', '{}', NULL, '2024-01-15T10:00:00Z'),
  
  -- Audit 2 - Gent KM11 (problemen)
  ('result-21', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 1), 'ok', 5, 'Terras in orde', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-22', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 2), 'ok', 5, 'Vloer en meubilair schoon', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-23', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 3), 'ok', 5, 'Plantenbakken ok', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-24', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 4), 'ok', 5, 'Inkomzone proper', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-25', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 5), 'ok', 5, 'Geen ongedierte', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-26', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 6), 'ok', 5, 'Risicoplaatsen proper', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-27', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 7), 'niet_ok', 1, 'Keuken niet voldoende schoon', '{}', 'Extra schoonmaakbeurt nodig', '2024-01-08T14:30:00Z'),
  ('result-28', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 8), 'ok', 5, 'Zaal netjes', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-29', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 9), 'ok', 5, 'Toiletten hygiënisch', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-30', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 10), 'ok', 5, 'Kelder in orde', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-31', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 11), 'ok', 5, 'Extra ruimtes netjes', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-32', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 12), 'niet_ok', 0, 'FIFO niet correct nageleefd', '{}', 'Producten herorganiseren volgens vervaldatum', '2024-01-08T14:30:00Z'),
  ('result-33', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 13), 'ok', 5, 'Vriezer in orde', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-34', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 14), 'ok', 5, 'Bar frigo ok', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-35', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 15), 'ok', 5, 'Personeelsbezetting ok', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-36', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 16), 'ok', 5, 'Kassaprocedures correct', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-37', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 17), 'ok', 5, 'Voorraadniveaus ok', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-38', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 18), 'ok', 5, 'Promoties correct', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-39', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 19), 'ok', 5, 'Gastbeleving goed', '{}', NULL, '2024-01-08T14:30:00Z'),
  ('result-40', 'audit-2', (SELECT id FROM audit_checklist_items WHERE volgorde = 20), 'ok', 5, 'Veiligheid in orde', '{}', NULL, '2024-01-08T14:30:00Z');

-- Acties toevoegen (gegenereerd door triggers)
INSERT INTO acties (id, audit_id, audit_resultaat_id, titel, beschrijving, urgentie, status, toegewezen_aan, deadline, actie_onderneem, foto_urls, voltooid_door, voltooid_op, geverifieerd_door, geverifieerd_op, verificatie_opmerkingen, created_at, updated_at)
VALUES 
  -- Acties voor audit-1 (FIFO probleem)
  ('action-1', 'audit-1', 'result-12', 'Actie vereist: Frigo keuken', 'FIFO niet correct nageleefd. Producten herorganiseren volgens vervaldatum', 'high', 'completed', '00000000-0000-0000-0000-000000000006', '2024-01-22', 'Alle producten in koelkast hergeorganiseerd volgens vervaldatum. Personeel getraind op FIFO procedures.', '{}', '00000000-0000-0000-0000-000000000006', '2024-01-20T14:30:00Z', '00000000-0000-0000-0000-000000000003', '2024-01-21T10:00:00Z', 'Koelkast correct georganiseerd volgens FIFO. Personeel heeft training gevolgd.', '2024-01-15T10:00:00Z', '2024-01-21T10:00:00Z'),
  
  -- Acties voor audit-2 (keuken en FIFO problemen)
  ('action-2', 'audit-2', 'result-27', 'Actie vereist: Keuken', 'Keuken niet voldoende schoon. Extra schoonmaakbeurt nodig', 'high', 'completed', '00000000-0000-0000-0000-000000000006', '2024-01-15', 'Keuken grondig gereinigd. Werkbladen, toestellen en vloeren extra schoongemaakt.', '{}', '00000000-0000-0000-0000-000000000006', '2024-01-14T16:00:00Z', '00000000-0000-0000-0000-000000000003', '2024-01-15T09:00:00Z', 'Keuken is nu voldoende schoon. Extra schoonmaakprocedures geïmplementeerd.', '2024-01-08T14:30:00Z', '2024-01-15T09:00:00Z'),
  ('action-3', 'audit-2', 'result-32', 'Actie vereist: Frigo keuken', 'FIFO niet correct nageleefd. Producten herorganiseren volgens vervaldatum', 'critical', 'completed', '00000000-0000-0000-0000-000000000006', '2024-01-11', 'Koelkast temperatuur aangepast naar 3°C. Thermometer gecontroleerd en gekalibreerd. Producten hergeorganiseerd volgens FIFO.', '{}', '00000000-0000-0000-0000-000000000006', '2024-01-10T11:30:00Z', '00000000-0000-0000-0000-000000000003', '2024-01-11T08:00:00Z', 'Koelkast temperatuur en FIFO nu correct. Thermometer gekalibreerd.', '2024-01-08T14:30:00Z', '2024-01-11T08:00:00Z');

-- Notificaties toevoegen
INSERT INTO notificaties (id, gebruiker_id, type, titel, bericht, actie_id, gelezen, created_at)
VALUES 
  ('notif-1', '00000000-0000-0000-0000-000000000003', 'action_completed', 'Actie voltooid: Frigo keuken', 'De actie "Actie vereist: Frigo keuken" is voltooid voor Gent - KM11. Controleer de uitgevoerde actie en foto''s.', 'action-1', false, '2024-01-20T14:30:00Z'),
  ('notif-2', '00000000-0000-0000-0000-000000000001', 'action_completed', 'Actie voltooid: Frigo keuken', 'De actie "Actie vereist: Frigo keuken" is voltooid voor Gent - KM11. Controleer de uitgevoerde actie en foto''s.', 'action-1', false, '2024-01-20T14:30:00Z'),
  ('notif-3', '00000000-0000-0000-0000-000000000006', 'action_verified', 'Actie geverifieerd: Frigo keuken', 'De actie "Actie vereist: Frigo keuken" is geverifieerd voor Gent - KM11. De actie is succesvol afgerond.', 'action-1', false, '2024-01-21T10:00:00Z'),
  ('notif-4', '00000000-0000-0000-0000-000000000003', 'action_completed', 'Actie voltooid: Keuken', 'De actie "Actie vereist: Keuken" is voltooid voor Gent - KM11. Controleer de uitgevoerde actie en foto''s.', 'action-2', false, '2024-01-14T16:00:00Z'),
  ('notif-5', '00000000-0000-0000-0000-000000000001', 'action_completed', 'Actie voltooid: Keuken', 'De actie "Actie vereist: Keuken" is voltooid voor Gent - KM11. Controleer de uitgevoerde actie en foto''s.', 'action-2', false, '2024-01-14T16:00:00Z'),
  ('notif-6', '00000000-0000-0000-0000-000000000006', 'action_verified', 'Actie geverifieerd: Keuken', 'De actie "Actie vereist: Keuken" is geverifieerd voor Gent - KM11. De actie is succesvol afgerond.', 'action-2', false, '2024-01-15T09:00:00Z'),
  ('notif-7', '00000000-0000-0000-0000-000000000003', 'action_completed', 'Actie voltooid: Frigo keuken', 'De actie "Actie vereist: Frigo keuken" is voltooid voor Gent - KM11. Controleer de uitgevoerde actie en foto''s.', 'action-3', false, '2024-01-10T11:30:00Z'),
  ('notif-8', '00000000-0000-0000-0000-000000000001', 'action_completed', 'Actie voltooid: Frigo keuken', 'De actie "Actie vereist: Frigo keuken" is voltooid voor Gent - KM11. Controleer de uitgevoerde actie en foto''s.', 'action-3', false, '2024-01-10T11:30:00Z'),
  ('notif-9', '00000000-0000-0000-0000-000000000006', 'action_verified', 'Actie geverifieerd: Frigo keuken', 'De actie "Actie vereist: Frigo keuken" is geverifieerd voor Gent - KM11. De actie is succesvol afgerond.', 'action-3', false, '2024-01-11T08:00:00Z');

-- Rapporten toevoegen
INSERT INTO rapporten (id, audit_id, rapport_url, verstuurd_naar, verstuur_datum, status, created_at)
VALUES 
  ('rapport-1', 'audit-1', '/rapporten/audit-1-rapport.pdf', ARRAY['km11@poulepoulette.com', 'tom.janssen@poulepoulette.com'], '2024-01-16T10:00:00Z', 'sent', '2024-01-15T10:00:00Z'),
  ('rapport-2', 'audit-2', '/rapporten/audit-2-rapport.pdf', ARRAY['km11@poulepoulette.com', 'tom.janssen@poulepoulette.com'], '2024-01-09T14:30:00Z', 'sent', '2024-01-08T14:30:00Z'),
  ('rapport-3', 'audit-4', '/rapporten/audit-4-rapport.pdf', ARRAY['pj70@poulepoulette.com', 'tom.janssen@poulepoulette.com'], '2024-01-13T09:15:00Z', 'sent', '2024-01-12T09:15:00Z'),
  ('rapport-4', 'audit-6', '/rapporten/audit-6-rapport.pdf', ARRAY['il36@poulepoulette.com', 'tom.janssen@poulepoulette.com'], '2024-01-11T14:00:00Z', 'sent', '2024-01-10T14:00:00Z'),
  ('rapport-5', 'audit-8', '/rapporten/audit-8-rapport.pdf', ARRAY['ts15@poulepoulette.com', 'lisa.peeters@poulepoulette.com'], '2024-01-19T13:20:00Z', 'sent', '2024-01-18T13:20:00Z'),
  ('rapport-6', 'audit-10', '/rapporten/audit-10-rapport.pdf', ARRAY['gk2@poulepoulette.com', 'lisa.peeters@poulepoulette.com'], '2024-01-15T12:00:00Z', 'sent', '2024-01-14T12:00:00Z'),
  ('rapport-7', 'audit-12', '/rapporten/audit-12-rapport.pdf', ARRAY['il34@poulepoulette.com', 'lisa.peeters@poulepoulette.com'], '2024-01-17T11:15:00Z', 'sent', '2024-01-16T11:15:00Z'),
  ('rapport-8', 'audit-14', '/rapporten/audit-14-rapport.pdf', ARRAY['tl24@poulepoulette.com', 'marc.vanderberg@poulepoulette.com'], '2024-01-14T10:30:00Z', 'sent', '2024-01-13T10:30:00Z'),
  ('rapport-9', 'audit-16', '/rapporten/audit-16-rapport.pdf', ARRAY['sc2@poulepoulette.com', 'marc.vanderberg@poulepoulette.com'], '2024-01-12T15:20:00Z', 'sent', '2024-01-11T15:20:00Z'),
  ('rapport-10', 'audit-18', '/rapporten/audit-18-rapport.pdf', ARRAY['ss3@poulepoulette.com', 'marc.vanderberg@poulepoulette.com'], '2024-01-18T09:45:00Z', 'sent', '2024-01-17T09:45:00Z');
