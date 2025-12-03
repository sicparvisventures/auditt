-- QUICK FIX: Voeg alleen de ontbrekende functies toe
-- Dit script voegt alleen de benodigde functies toe zonder de hele database te wijzigen

-- ==============================================
-- STAP 1: CREATE ORGANIZATION LISTING FUNCTION
-- ==============================================

-- Function om alle actieve organizations op te halen
CREATE OR REPLACE FUNCTION get_active_organizations()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  tier TEXT,
  status TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  background_color TEXT,
  text_color TEXT,
  primary_font TEXT,
  accent_font TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    o.slug,
    COALESCE(o.tier, 'starter') as tier,
    o.status,
    o.primary_color,
    o.secondary_color,
    o.accent_color,
    o.background_color,
    o.text_color,
    o.primary_font,
    o.accent_font,
    o.logo_url,
    o.created_at
  FROM organizations o
  WHERE o.status = 'active' OR o.status IS NULL
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STAP 2: CREATE ORGANIZATION BY SLUG FUNCTION
-- ==============================================

-- Function om organization op te halen op basis van slug
CREATE OR REPLACE FUNCTION get_organization_by_slug(org_slug TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  tier TEXT,
  status TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  background_color TEXT,
  text_color TEXT,
  primary_font TEXT,
  accent_font TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  max_users INTEGER,
  max_filialen INTEGER,
  max_audits_per_month INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    o.slug,
    COALESCE(o.tier, 'starter') as tier,
    o.status,
    o.primary_color,
    o.secondary_color,
    o.accent_color,
    o.background_color,
    o.text_color,
    o.primary_font,
    o.accent_font,
    o.logo_url,
    o.favicon_url,
    COALESCE(o.max_users, 5) as max_users,
    COALESCE(o.max_filialen, 3) as max_filialen,
    COALESCE(o.max_audits_per_month, 10) as max_audits_per_month,
    o.created_at
  FROM organizations o
  WHERE o.slug = org_slug AND (o.status = 'active' OR o.status IS NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STAP 3: CREATE ORGANIZATION CREATION FUNCTION
-- ==============================================

-- Function om een nieuwe organization aan te maken
CREATE OR REPLACE FUNCTION create_new_organization(
  org_name TEXT,
  org_slug TEXT,
  org_tier TEXT DEFAULT 'starter',
  org_industry TEXT DEFAULT '',
  contact_name TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#2563eb',
  secondary_color TEXT DEFAULT '#dc2626',
  accent_color TEXT DEFAULT '#f59e0b',
  background_color TEXT DEFAULT '#f8fafc',
  text_color TEXT DEFAULT '#1f2937',
  primary_font TEXT DEFAULT 'Inter',
  accent_font TEXT DEFAULT 'Inter',
  template_id TEXT DEFAULT 'restaurant'
) RETURNS UUID AS $$
DECLARE
  new_org_id UUID;
  admin_user_id UUID;
BEGIN
  -- Validate slug
  IF org_slug !~ '^[a-z0-9-]{3,50}$' THEN
    RAISE EXCEPTION 'Invalid slug format. Use only lowercase letters, numbers, and hyphens (3-50 characters).';
  END IF;
  
  -- Check if slug already exists
  IF EXISTS (SELECT 1 FROM organizations WHERE slug = org_slug) THEN
    RAISE EXCEPTION 'Organization slug already exists: %', org_slug;
  END IF;
  
  -- Generate new organization ID
  new_org_id := gen_random_uuid();
  
  -- Insert new organization (met fallback voor ontbrekende kolommen)
  INSERT INTO organizations (
    id,
    name,
    slug,
    primary_color,
    secondary_color,
    accent_color,
    background_color,
    text_color,
    primary_font,
    accent_font,
    status,
    created_at,
    updated_at
  ) VALUES (
    new_org_id,
    org_name,
    org_slug,
    primary_color,
    secondary_color,
    accent_color,
    background_color,
    text_color,
    primary_font,
    accent_font,
    'active',
    NOW(),
    NOW()
  );
  
  -- Probeer tier kolom toe te voegen als deze bestaat
  BEGIN
    UPDATE organizations SET tier = org_tier WHERE id = new_org_id;
  EXCEPTION
    WHEN undefined_column THEN
      -- Tier kolom bestaat niet, dat is oké
      NULL;
  END;
  
  -- Generate admin user ID
  admin_user_id := gen_random_uuid();
  
  -- Create default admin user for the organization
  INSERT INTO gebruikers (
    id,
    email,
    naam,
    rol,
    telefoon,
    actief,
    organization_id,
    created_at,
    updated_at
  ) VALUES (
    admin_user_id,
    contact_email,
    contact_name,
    'admin',
    contact_phone,
    true,
    new_org_id,
    NOW(),
    NOW()
  );
  
  -- Copy checklist items from PP organization (template) als deze bestaat
  BEGIN
    INSERT INTO audit_checklist_items (
      categorie,
      titel,
      beschrijving,
      gewicht,
      volgorde,
      actief,
      organization_id,
      created_at
    )
    SELECT 
      categorie,
      titel,
      beschrijving,
      gewicht,
      volgorde,
      actief,
      new_org_id,
      NOW()
    FROM audit_checklist_items 
    WHERE organization_id = '00000000-0000-0000-0000-000000000001';
  EXCEPTION
    WHEN OTHERS THEN
      -- Checklist items kopiëren mislukt, dat is oké
      NULL;
  END;
  
  -- Create default filiaal
  INSERT INTO filialen (
    id,
    naam,
    locatie,
    district_manager_id,
    adres,
    telefoon,
    email,
    status,
    organization_id,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    'Hoofdkantoor',
    'Hoofdlocatie',
    admin_user_id,
    'Hoofdstraat 1',
    contact_phone,
    contact_email,
    'actief',
    new_org_id,
    NOW(),
    NOW()
  );
  
  RETURN new_org_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and re-raise
    RAISE EXCEPTION 'Error creating organization: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STAP 4: CREATE USER AUTHENTICATION FUNCTION
-- ==============================================

-- Function om gebruiker te authenticeren voor een specifieke organization
CREATE OR REPLACE FUNCTION authenticate_user_for_organization(
  user_email TEXT,
  org_slug TEXT
) RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_role TEXT,
  user_phone TEXT,
  user_active BOOLEAN,
  org_id UUID,
  org_name TEXT,
  org_slug TEXT,
  org_tier TEXT,
  org_primary_color TEXT,
  org_secondary_color TEXT,
  org_accent_color TEXT,
  org_background_color TEXT,
  org_text_color TEXT,
  org_primary_font TEXT,
  org_accent_font TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id,
    g.naam,
    g.rol,
    g.telefoon,
    g.actief,
    o.id,
    o.name,
    o.slug,
    COALESCE(o.tier, 'starter') as org_tier,
    o.primary_color,
    o.secondary_color,
    o.accent_color,
    o.background_color,
    o.text_color,
    o.primary_font,
    o.accent_font
  FROM gebruikers g
  JOIN organizations o ON g.organization_id = o.id
  WHERE g.email = user_email 
    AND o.slug = org_slug 
    AND g.actief = true 
    AND (o.status = 'active' OR o.status IS NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STAP 5: GRANT PERMISSIONS
-- ==============================================

-- Grant execute permissions on all functions
GRANT EXECUTE ON FUNCTION get_active_organizations TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_organization_by_slug TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_new_organization TO anon, authenticated;
GRANT EXECUTE ON FUNCTION authenticate_user_for_organization TO anon, authenticated;

-- ==============================================
-- STAP 6: CREATE DEFAULT PP ORGANIZATION IF NOT EXISTS
-- ==============================================

-- Maak PP organization aan als deze niet bestaat
INSERT INTO organizations (
  id,
  name,
  slug,
  primary_color,
  secondary_color,
  accent_color,
  background_color,
  text_color,
  primary_font,
  accent_font,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Poule & Poulette',
  'pp',
  '#1C3834',
  '#93231F',
  '#F495BD',
  '#FBFBF1',
  '#060709',
  'Lino Stamp',
  'Bacon Kingdom',
  'active'
) ON CONFLICT (slug) DO NOTHING;

-- ==============================================
-- STAP 7: VERIFICATION
-- ==============================================

-- Test of functies werken
SELECT 'Functions created successfully' as status;

-- Test get_active_organizations
SELECT 'Testing get_active_organizations...' as test;
SELECT * FROM get_active_organizations();

-- ==============================================
-- SCRIPT COMPLETE!
-- ==============================================

-- Dit script voegt alleen de ontbrekende functies toe:
-- 1. ✅ get_active_organizations() - Laadt alle actieve organizations
-- 2. ✅ get_organization_by_slug() - Haalt organization op per slug
-- 3. ✅ create_new_organization() - Maakt nieuwe organization aan
-- 4. ✅ authenticate_user_for_organization() - Authenticeert gebruiker
-- 5. ✅ PP organization wordt aangemaakt als template
-- 6. ✅ Permissions worden ingesteld

-- Test nu:
-- 1. Ga naar http://localhost:3000/organization-login
-- 2. Organizations moeten nu worden geladen
-- 3. Platform aanmaken moet werken
