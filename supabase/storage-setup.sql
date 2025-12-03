-- =====================================================
-- STORAGE BUCKET SETUP SCRIPT
-- =====================================================
-- Dit script configureert de storage bucket voor audit foto's
-- Run dit in Supabase SQL Editor
-- =====================================================

-- 1. Maak storage bucket aan (als deze niet bestaat)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audit-photos',
  'audit-photos',
  true,
  10485760, -- 10MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 2. Enable Row Level Security op storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Verwijder oude policies (als ze bestaan)
DROP POLICY IF EXISTS "Public read audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their audit photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view audit photos" ON storage.objects;

-- 4. Maak nieuwe storage policies

-- Policy: Iedereen kan audit foto's bekijken (publiek)
CREATE POLICY "Public can view audit photos" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'audit-photos');

-- Policy: Authenticated users kunnen foto's uploaden
CREATE POLICY "Authenticated users can upload audit photos" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'audit-photos' AND
    (storage.foldername(name))[1] = 'audit-photos'
  );

-- Policy: Authenticated users kunnen hun eigen foto's updaten
CREATE POLICY "Users can update their audit photos" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'audit-photos')
  WITH CHECK (bucket_id = 'audit-photos');

-- Policy: Authenticated users kunnen hun eigen foto's verwijderen
CREATE POLICY "Users can delete their audit photos" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'audit-photos');

-- 5. Verifieer bucket configuratie
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'audit-photos'
  ) INTO bucket_exists;
  
  IF bucket_exists THEN
    RAISE NOTICE '✅ Storage bucket "audit-photos" is geconfigureerd';
  ELSE
    RAISE EXCEPTION '❌ Storage bucket "audit-photos" bestaat niet!';
  END IF;
END $$;

-- 6. Test query om bucket te verifiëren
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'audit-photos';

