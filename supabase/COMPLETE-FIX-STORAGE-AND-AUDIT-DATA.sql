-- =====================================================
-- COMPLETE FIX: STORAGE + AUDIT DATA OPSLAG
-- =====================================================
-- Dit script fix ALLES:
-- 1. Storage bucket met anon access (RLS fix)
-- 2. Database tables voor audit data
-- 3. RLS policies voor alle tabellen
-- Run dit in Supabase SQL Editor
-- =====================================================

-- ========================================
-- DEEL 1: STORAGE BUCKET SETUP
-- ========================================

-- 1. Maak storage bucket aan (als deze niet bestaat)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audit-photos',
  'audit-photos',
  true, -- Public bucket voor anon access
  10485760, -- 10MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 2. Enable Row Level Security op storage.objects
-- Note: In Supabase is RLS meestal al enabled op storage.objects
-- Als deze regel faalt met "must be owner", is dat ok - RLS is waarschijnlijk al enabled
-- Je kunt deze regel overslaan en direct naar de policies gaan
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Verwijder ALLE oude policies voor audit-photos bucket
DROP POLICY IF EXISTS "Public read audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Anon can upload audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Anon can view audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Anon can update audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Anon can delete audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete audit photos" ON storage.objects;

-- 4. Maak nieuwe storage policies - ANON ACCESS (voor anon key)

-- Policy: Iedereen (anon + authenticated) kan audit foto's bekijken
CREATE POLICY "Public can view audit photos" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'audit-photos');

-- Policy: Anon users kunnen foto's uploaden naar audit-photos bucket
CREATE POLICY "Anon can upload audit photos" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'audit-photos');

-- Policy: Authenticated users kunnen ook foto's uploaden
CREATE POLICY "Authenticated can upload audit photos" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'audit-photos');

-- Policy: Anon users kunnen hun foto's updaten
CREATE POLICY "Anon can update audit photos" ON storage.objects
  FOR UPDATE
  TO anon
  USING (bucket_id = 'audit-photos')
  WITH CHECK (bucket_id = 'audit-photos');

-- Policy: Authenticated users kunnen hun foto's updaten
CREATE POLICY "Authenticated can update audit photos" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'audit-photos')
  WITH CHECK (bucket_id = 'audit-photos');

-- Policy: Anon users kunnen hun foto's verwijderen
CREATE POLICY "Anon can delete audit photos" ON storage.objects
  FOR DELETE
  TO anon
  USING (bucket_id = 'audit-photos');

-- Policy: Authenticated users kunnen hun foto's verwijderen
CREATE POLICY "Authenticated can delete audit photos" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'audit-photos');

-- ========================================
-- DEEL 2: DATABASE TABLES SETUP
-- ========================================

-- 1. Zorg dat audit_resultaten tabel foto_urls correct ondersteunt
DO $$ BEGIN
    -- Check of foto_urls kolom bestaat en TEXT[] type is
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'audit_resultaten' 
        AND column_name = 'foto_urls'
    ) THEN
        ALTER TABLE audit_resultaten ADD COLUMN foto_urls TEXT[] DEFAULT '{}';
        RAISE NOTICE 'Column "foto_urls" toegevoegd aan audit_resultaten';
    ELSE
        -- Check of het een array type is
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'audit_resultaten' 
            AND column_name = 'foto_urls'
            AND data_type = 'ARRAY'
        ) THEN
            -- Converteer naar array als het nog geen array is
            ALTER TABLE audit_resultaten ALTER COLUMN foto_urls TYPE TEXT[] USING ARRAY[foto_urls];
            RAISE NOTICE 'Column "foto_urls" geconverteerd naar TEXT[]';
        ELSE
            RAISE NOTICE 'Column "foto_urls" bestaat al als TEXT[]';
        END IF;
    END IF;
END $$;

-- 2. Zorg dat opmerkingen en verbeterpunt TEXT type zijn (kunnen NULL zijn)
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

-- ========================================
-- DEEL 3: RLS POLICIES VOOR DATABASE TABELLEN
-- ========================================

-- 1. Audit Resultaten - ALLOW ALL (anon access)
ALTER TABLE audit_resultaten DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Audit results follow audit rules" ON audit_resultaten;
DROP POLICY IF EXISTS "Public can read audit results" ON audit_resultaten;
DROP POLICY IF EXISTS "Public can insert audit results" ON audit_resultaten;
DROP POLICY IF EXISTS "Public can update audit results" ON audit_resultaten;
DROP POLICY IF EXISTS "Public can delete audit results" ON audit_resultaten;

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

CREATE POLICY "Public can delete audit results" ON audit_resultaten
  FOR DELETE
  TO public
  USING (true);

ALTER TABLE audit_resultaten ENABLE ROW LEVEL SECURITY;

-- 2. Audits - ALLOW ALL (anon access)
ALTER TABLE audits DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read audits" ON audits;
DROP POLICY IF EXISTS "Public can insert audits" ON audits;
DROP POLICY IF EXISTS "Public can update audits" ON audits;
DROP POLICY IF EXISTS "Public can delete audits" ON audits;
DROP POLICY IF EXISTS "District managers can read their audits" ON audits;
DROP POLICY IF EXISTS "District managers can create audits" ON audits;
DROP POLICY IF EXISTS "District managers can update their audits" ON audits;

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

CREATE POLICY "Public can delete audits" ON audits
  FOR DELETE
  TO public
  USING (true);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- 3. Filialen - ALLOW READ (anon access)
ALTER TABLE filialen DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read filialen" ON filialen;
DROP POLICY IF EXISTS "District managers can read assigned filialen" ON filialen;

CREATE POLICY "Public can read filialen" ON filialen
  FOR SELECT
  TO public
  USING (true);

ALTER TABLE filialen ENABLE ROW LEVEL SECURITY;

-- 4. Audit Checklist Items - ALLOW READ (anon access)
ALTER TABLE audit_checklist_items DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read checklist items" ON audit_checklist_items;

CREATE POLICY "Public can read checklist items" ON audit_checklist_items
  FOR SELECT
  TO public
  USING (true);

ALTER TABLE audit_checklist_items ENABLE ROW LEVEL SECURITY;

-- 5. Gebruikers - ALLOW READ (anon access voor district managers)
ALTER TABLE gebruikers DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read users" ON gebruikers;
DROP POLICY IF EXISTS "Users can read own data" ON gebruikers;

CREATE POLICY "Public can read users" ON gebruikers
  FOR SELECT
  TO public
  USING (true);

ALTER TABLE gebruikers ENABLE ROW LEVEL SECURITY;

-- 6. Rapporten - ALLOW ALL (anon access)
ALTER TABLE rapporten DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read reports" ON rapporten;
DROP POLICY IF EXISTS "Public can insert reports" ON rapporten;
DROP POLICY IF EXISTS "Public can update reports" ON rapporten;
DROP POLICY IF EXISTS "Reports follow audit rules" ON rapporten;

CREATE POLICY "Public can read reports" ON rapporten
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert reports" ON rapporten
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update reports" ON rapporten
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

ALTER TABLE rapporten ENABLE ROW LEVEL SECURITY;

-- ========================================
-- DEEL 4: VERIFICATIE
-- ========================================

-- Verifieer bucket configuratie
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'audit-photos'
  ) INTO bucket_exists;
  
  IF bucket_exists THEN
    RAISE NOTICE '✅ Storage bucket "audit-photos" is geconfigureerd met anon access';
  ELSE
    RAISE EXCEPTION '❌ Storage bucket "audit-photos" bestaat niet!';
  END IF;
END $$;

-- Verifieer database configuratie
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
    
    RAISE NOTICE '✅ Database configuratie:';
    RAISE NOTICE '   - foto_urls type: %', foto_urls_type;
    RAISE NOTICE '   - opmerkingen nullable: %', opmerkingen_nullable;
    RAISE NOTICE '   - verbeterpunt nullable: %', verbeterpunt_nullable;
END $$;

-- Toon bucket configuratie
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'audit-photos';

-- Toon alle storage policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%audit%'
ORDER BY policyname;

-- Test query - toon laatste audit resultaten met foto's
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
LIMIT 5;

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '✅ COMPLETE FIX APPLIED - Storage en Database zijn nu geconfigureerd voor anon access!';
END $$;

-- Show success message as query result
SELECT '✅ COMPLETE FIX APPLIED - Storage en Database zijn nu geconfigureerd voor anon access!' as status;

