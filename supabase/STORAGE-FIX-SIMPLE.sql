-- =====================================================
-- SIMPLE STORAGE FIX - Alleen Policies (Geen Tabel Wijzigingen)
-- =====================================================
-- Dit script maakt alleen policies aan voor storage
-- Geen ALTER TABLE commando's die permissions errors kunnen geven
-- Run dit in Supabase SQL Editor
-- =====================================================

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

-- 2. Verwijder ALLE oude policies voor audit-photos bucket
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

-- 3. Maak nieuwe storage policies - ANON ACCESS (voor anon key)

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

-- 4. Verifieer bucket configuratie
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

-- 5. Toon bucket configuratie
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'audit-photos';

-- 6. Toon alle storage policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%audit%'
ORDER BY policyname;

-- Success message
SELECT '✅ STORAGE FIX APPLIED - Policies zijn aangemaakt voor anon access!' as status;

