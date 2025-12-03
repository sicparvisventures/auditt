-- =====================================================
-- COMPLETE AUDIT DATA SETUP - ZORG DAT ALLES WORDT OPGESLAGEN
-- =====================================================
-- Dit script zorgt ervoor dat alle audit data correct wordt opgeslagen:
-- - Foto's in storage bucket
-- - Tekst (opmerkingen, verbeterpunten) in database
-- - Audit resultaten met foto_urls array
-- Run dit in Supabase SQL Editor
-- =====================================================

-- 1. Zorg dat audit_resultaten tabel foto_urls correct ondersteunt
DO $$ BEGIN
    -- Check of foto_urls kolom bestaat en TEXT[] type is
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'audit_resultaten' 
        AND column_name = 'foto_urls'
        AND data_type = 'ARRAY'
    ) THEN
        -- Als kolom niet bestaat, voeg toe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'audit_resultaten' 
            AND column_name = 'foto_urls'
        ) THEN
            ALTER TABLE audit_resultaten ADD COLUMN foto_urls TEXT[] DEFAULT '{}';
            RAISE NOTICE 'Column "foto_urls" toegevoegd aan audit_resultaten';
        ELSE
            -- Als kolom bestaat maar niet als array, converteer
            ALTER TABLE audit_resultaten ALTER COLUMN foto_urls TYPE TEXT[] USING ARRAY[foto_urls];
            RAISE NOTICE 'Column "foto_urls" geconverteerd naar TEXT[]';
        END IF;
    ELSE
        RAISE NOTICE 'Column "foto_urls" bestaat al als TEXT[]';
    END IF;
END $$;

-- 2. Zorg dat opmerkingen en verbeterpunt TEXT type zijn (niet NOT NULL)
DO $$ BEGIN
    -- Check opmerkingen
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'audit_resultaten' 
        AND column_name = 'opmerkingen'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE audit_resultaten ALTER COLUMN opmerkingen DROP NOT NULL;
        RAISE NOTICE 'Column "opmerkingen" kan nu NULL zijn';
    END IF;

    -- Check verbeterpunt
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'audit_resultaten' 
        AND column_name = 'verbeterpunt'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE audit_resultaten ALTER COLUMN verbeterpunt DROP NOT NULL;
        RAISE NOTICE 'Column "verbeterpunt" kan nu NULL zijn';
    END IF;
END $$;

-- 3. Zorg dat RLS policies voor audit_resultaten correct zijn
-- Disable RLS tijdelijk om data te kunnen schrijven
ALTER TABLE audit_resultaten DISABLE ROW LEVEL SECURITY;

-- Verwijder oude policies
DROP POLICY IF EXISTS "Audit results follow audit rules" ON audit_resultaten;
DROP POLICY IF EXISTS "Public can read audit results" ON audit_resultaten;
DROP POLICY IF EXISTS "Public can insert audit results" ON audit_resultaten;
DROP POLICY IF EXISTS "Public can update audit results" ON audit_resultaten;

-- Maak nieuwe policies - ALLOW ALL voor nu (kan later restrictiever gemaakt worden)
CREATE POLICY "Public can read audit results" ON audit_resultaten
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert audit results" ON audit_resultaten
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update audit results" ON audit_resultaten
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE audit_resultaten ENABLE ROW LEVEL SECURITY;

-- 4. Zorg dat audits tabel correct is
ALTER TABLE audits DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read audits" ON audits;
DROP POLICY IF EXISTS "Public can insert audits" ON audits;
DROP POLICY IF EXISTS "Public can update audits" ON audits;

CREATE POLICY "Public can read audits" ON audits
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert audits" ON audits
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update audits" ON audits
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- 5. Zorg dat filialen tabel toegankelijk is
ALTER TABLE filialen DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read filialen" ON filialen;

CREATE POLICY "Public can read filialen" ON filialen
  FOR SELECT
  TO public
  USING (true);

ALTER TABLE filialen ENABLE ROW LEVEL SECURITY;

-- 6. Zorg dat audit_checklist_items tabel toegankelijk is
ALTER TABLE audit_checklist_items DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read checklist items" ON audit_checklist_items;

CREATE POLICY "Public can read checklist items" ON audit_checklist_items
  FOR SELECT
  TO public
  USING (true);

ALTER TABLE audit_checklist_items ENABLE ROW LEVEL SECURITY;

-- 7. Zorg dat gebruikers tabel toegankelijk is (voor district managers)
ALTER TABLE gebruikers DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read users" ON gebruikers;

CREATE POLICY "Public can read users" ON gebruikers
  FOR SELECT
  TO public
  USING (true);

ALTER TABLE gebruikers ENABLE ROW LEVEL SECURITY;

-- 8. Verifieer dat alles correct is ingesteld
DO $$
DECLARE
    foto_urls_type TEXT;
    opmerkingen_nullable TEXT;
    verbeterpunt_nullable TEXT;
BEGIN
    -- Check foto_urls type
    SELECT data_type INTO foto_urls_type
    FROM information_schema.columns
    WHERE table_name = 'audit_resultaten' AND column_name = 'foto_urls';
    
    -- Check nullable
    SELECT is_nullable INTO opmerkingen_nullable
    FROM information_schema.columns
    WHERE table_name = 'audit_resultaten' AND column_name = 'opmerkingen';
    
    SELECT is_nullable INTO verbeterpunt_nullable
    FROM information_schema.columns
    WHERE table_name = 'audit_resultaten' AND column_name = 'verbeterpunt';
    
    RAISE NOTICE '✅ Audit resultaten configuratie:';
    RAISE NOTICE '   - foto_urls type: %', foto_urls_type;
    RAISE NOTICE '   - opmerkingen nullable: %', opmerkingen_nullable;
    RAISE NOTICE '   - verbeterpunt nullable: %', verbeterpunt_nullable;
END $$;

-- 9. Test query - toon laatste audit resultaten met foto's
SELECT 
    ar.id,
    ar.audit_id,
    ar.checklist_item_id,
    ar.resultaat,
    ar.opmerkingen,
    ar.verbeterpunt,
    array_length(ar.foto_urls, 1) as foto_count,
    ar.foto_urls,
    ar.created_at
FROM audit_resultaten ar
ORDER BY ar.created_at DESC
LIMIT 10;

