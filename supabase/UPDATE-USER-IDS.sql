-- UPDATE USER IDS SCRIPT
-- Dit script vult de lege user_id velden in de gebruikers tabel

-- Update bestaande gebruikers met user_id's
UPDATE gebruikers 
SET user_id = 'ADMIN' 
WHERE naam = 'Filip Van Hoeck' AND rol = 'admin';

UPDATE gebruikers 
SET user_id = 'COO01' 
WHERE naam = 'Sarah De Vries' AND rol = 'coo';

UPDATE gebruikers 
SET user_id = 'DM001' 
WHERE naam = 'Tom Janssen' AND rol = 'district_manager';

UPDATE gebruikers 
SET user_id = 'DM002' 
WHERE naam = 'Lisa Peeters' AND rol = 'district_manager';

UPDATE gebruikers 
SET user_id = 'DM003' 
WHERE naam = 'Marc Van Der Berg' AND rol = 'district_manager';

UPDATE gebruikers 
SET user_id = 'FM001' 
WHERE naam = 'Anna Verstraeten' AND rol = 'filiaal_manager';

UPDATE gebruikers 
SET user_id = 'FM002' 
WHERE naam = 'Jeroen De Smet' AND rol = 'filiaal_manager';

UPDATE gebruikers 
SET user_id = 'FM003' 
WHERE naam = 'Sofie Van Damme' AND rol = 'filiaal_manager';

UPDATE gebruikers 
SET user_id = 'FM004' 
WHERE naam = 'Kevin Vandenberghe' AND rol = 'filiaal_manager';

-- Controleer de resultaten
SELECT id, user_id, naam, rol, actief 
FROM gebruikers 
ORDER BY rol, naam;
