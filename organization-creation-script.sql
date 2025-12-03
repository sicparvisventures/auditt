-- ORGANIZATION CREATION & MANAGEMENT SQL SCRIPT
-- Dit script zorgt ervoor dat nieuwe organizations daadwerkelijk worden aangemaakt in de database
-- en dat elke organization zijn eigen dashboard en pagina's krijgt

-- ==============================================
-- STAP 1: ORGANIZATION CREATION FUNCTION
-- ==============================================

-- Function om een nieuwe organization aan te maken met alle benodigde data
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
  template_checklist_items RECORD;
BEGIN
  -- Generate new organization ID
  new_org_id := gen_random_uuid();
  
  -- Insert new organization
  INSERT INTO organizations (
    id,
    name,
    slug,
    tier,
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
    org_tier,
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
  
  -- Copy checklist items from PP organization (template)
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
  
  -- Create default admin user for the organization
  INSERT INTO gebruikers (
    id,
    email,
    naam,
    rol,
    telefoon,
    actief,
    organization_id,
    subscription_status,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    contact_email,
    contact_name,
    'admin',
    contact_phone,
    true,
    new_org_id,
    'active',
    NOW(),
    NOW()
  );
  
  -- Create some default filialen based on tier
  IF org_tier = 'starter' THEN
    -- Starter: 1 default filiaal
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
      (SELECT id FROM gebruikers WHERE organization_id = new_org_id AND rol = 'admin' LIMIT 1),
      'Hoofdstraat 1',
      contact_phone,
      contact_email,
      'actief',
      new_org_id,
      NOW(),
      NOW()
    );
  ELSIF org_tier = 'professional' THEN
    -- Professional: 3 default filialen
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
    ) VALUES 
    (
      gen_random_uuid(),
      'Hoofdkantoor',
      'Hoofdlocatie',
      (SELECT id FROM gebruikers WHERE organization_id = new_org_id AND rol = 'admin' LIMIT 1),
      'Hoofdstraat 1',
      contact_phone,
      contact_email,
      'actief',
      new_org_id,
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      'Filiaal Noord',
      'Noordelijke locatie',
      (SELECT id FROM gebruikers WHERE organization_id = new_org_id AND rol = 'admin' LIMIT 1),
      'Noordstraat 2',
      contact_phone,
      contact_email,
      'actief',
      new_org_id,
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      'Filiaal Zuid',
      'Zuidelijke locatie',
      (SELECT id FROM gebruikers WHERE organization_id = new_org_id AND rol = 'admin' LIMIT 1),
      'Zuidstraat 3',
      contact_phone,
      contact_email,
      'actief',
      new_org_id,
      NOW(),
      NOW()
    );
  ELSIF org_tier = 'enterprise' THEN
    -- Enterprise: 5 default filialen
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
    ) VALUES 
    (
      gen_random_uuid(),
      'Hoofdkantoor',
      'Hoofdlocatie',
      (SELECT id FROM gebruikers WHERE organization_id = new_org_id AND rol = 'admin' LIMIT 1),
      'Hoofdstraat 1',
      contact_phone,
      contact_email,
      'actief',
      new_org_id,
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      'Filiaal Noord',
      'Noordelijke locatie',
      (SELECT id FROM gebruikers WHERE organization_id = new_org_id AND rol = 'admin' LIMIT 1),
      'Noordstraat 2',
      contact_phone,
      contact_email,
      'actief',
      new_org_id,
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      'Filiaal Zuid',
      'Zuidelijke locatie',
      (SELECT id FROM gebruikers WHERE organization_id = new_org_id AND rol = 'admin' LIMIT 1),
      'Zuidstraat 3',
      contact_phone,
      contact_email,
      'actief',
      new_org_id,
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      'Filiaal Oost',
      'Oostelijke locatie',
      (SELECT id FROM gebruikers WHERE organization_id = new_org_id AND rol = 'admin' LIMIT 1),
      'Ooststraat 4',
      contact_phone,
      contact_email,
      'actief',
      new_org_id,
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      'Filiaal West',
      'Westelijke locatie',
      (SELECT id FROM gebruikers WHERE organization_id = new_org_id AND rol = 'admin' LIMIT 1),
      'Weststraat 5',
      contact_phone,
      contact_email,
      'actief',
      new_org_id,
      NOW(),
      NOW()
    );
  END IF;
  
  -- Create welcome notification
  INSERT INTO notificaties (
    id,
    gebruiker_id,
    type,
    titel,
    bericht,
    actie_id,
    gelezen,
    organization_id,
    created_at
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM gebruikers WHERE organization_id = new_org_id AND rol = 'admin' LIMIT 1),
    'welcome',
    'Welkom bij AuditFlow!',
    'Uw ' || org_tier || ' audit platform is succesvol aangemaakt. U kunt nu beginnen met het uitvoeren van audits.',
    NULL,
    false,
    new_org_id,
    NOW()
  );
  
  RETURN new_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STAP 2: ORGANIZATION LISTING FUNCTION
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
    o.tier,
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
  WHERE o.status = 'active'
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STAP 3: ORGANIZATION BY SLUG FUNCTION
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
    o.tier,
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
    o.max_users,
    o.max_filialen,
    o.max_audits_per_month,
    o.created_at
  FROM organizations o
  WHERE o.slug = org_slug AND o.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STAP 4: USER AUTHENTICATION FOR ORGANIZATION
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
    o.tier,
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
    AND o.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STAP 5: ORGANIZATION STATISTICS
-- ==============================================

-- Function om organization statistieken op te halen
CREATE OR REPLACE FUNCTION get_organization_stats(org_slug TEXT)
RETURNS TABLE (
  user_count BIGINT,
  filialen_count BIGINT,
  audits_count BIGINT,
  acties_count BIGINT,
  rapporten_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM gebruikers WHERE organization_id = o.id) as user_count,
    (SELECT COUNT(*) FROM filialen WHERE organization_id = o.id) as filialen_count,
    (SELECT COUNT(*) FROM audits a JOIN filialen f ON a.filiaal_id = f.id WHERE f.organization_id = o.id) as audits_count,
    (SELECT COUNT(*) FROM acties ac JOIN audits a ON ac.audit_id = a.id JOIN filialen f ON a.filiaal_id = f.id WHERE f.organization_id = o.id) as acties_count,
    (SELECT COUNT(*) FROM rapporten r JOIN audits a ON r.audit_id = a.id JOIN filialen f ON a.filiaal_id = f.id WHERE f.organization_id = o.id) as rapporten_count
  FROM organizations o
  WHERE o.slug = org_slug AND o.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- STAP 6: TEST DATA CREATION
-- ==============================================

-- Insert some test organizations for demonstration
DO $$
DECLARE
  test_org_id UUID;
BEGIN
  -- Test Organization 1: Restaurant Chain
  SELECT create_new_organization(
    'Restaurant De Gouden Kip',
    'restaurant-de-gouden-kip',
    'professional',
    'Restaurant & Horeca',
    'Jan Janssen',
    'jan@restaurant-de-gouden-kip.nl',
    '+31 6 12345678',
    '#059669',
    '#dc2626',
    '#f59e0b',
    '#f0fdf4',
    '#064e3b',
    'Inter',
    'Inter',
    'restaurant'
  ) INTO test_org_id;
  
  -- Test Organization 2: Retail Store
  SELECT create_new_organization(
    'Retail Plus',
    'retail-plus',
    'starter',
    'Retail & Winkelketens',
    'Maria de Vries',
    'maria@retail-plus.nl',
    '+31 6 87654321',
    '#2563eb',
    '#dc2626',
    '#f59e0b',
    '#f8fafc',
    '#1f2937',
    'Inter',
    'Inter',
    'retail'
  ) INTO test_org_id;
  
  -- Test Organization 3: Corporate Company
  SELECT create_new_organization(
    'Corporate Solutions',
    'corporate-solutions',
    'enterprise',
    'Overheid',
    'Peter van der Berg',
    'peter@corporate-solutions.nl',
    '+31 6 11223344',
    '#0f172a',
    '#1e40af',
    '#059669',
    '#ffffff',
    '#0f172a',
    'Inter',
    'Inter',
    'corporate'
  ) INTO test_org_id;
END $$;

-- ==============================================
-- STAP 7: GRANT PERMISSIONS
-- ==============================================

-- Grant execute permissions on all functions
GRANT EXECUTE ON FUNCTION create_new_organization TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_active_organizations TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_organization_by_slug TO anon, authenticated;
GRANT EXECUTE ON FUNCTION authenticate_user_for_organization TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_organization_stats TO anon, authenticated;

-- ==============================================
-- STAP 8: VERIFICATION QUERIES
-- ==============================================

-- Test queries om te verifiëren dat alles werkt:

-- 1. Check all organizations
-- SELECT * FROM get_active_organizations();

-- 2. Check specific organization
-- SELECT * FROM get_organization_by_slug('restaurant-de-gouden-kip');

-- 3. Check organization stats
-- SELECT * FROM get_organization_stats('restaurant-de-gouden-kip');

-- 4. Test user authentication
-- SELECT * FROM authenticate_user_for_organization('jan@restaurant-de-gouden-kip.nl', 'restaurant-de-gouden-kip');

-- 5. Check created data
-- SELECT 
--   o.name,
--   o.slug,
--   o.tier,
--   COUNT(DISTINCT g.id) as users,
--   COUNT(DISTINCT f.id) as filialen
-- FROM organizations o
-- LEFT JOIN gebruikers g ON g.organization_id = o.id
-- LEFT JOIN filialen f ON f.organization_id = o.id
-- WHERE o.slug IN ('restaurant-de-gouden-kip', 'retail-plus', 'corporate-solutions')
-- GROUP BY o.id, o.name, o.slug, o.tier;

-- ==============================================
-- SCRIPT COMPLETE!
-- ==============================================

-- Dit script zorgt ervoor dat:
-- 1. Nieuwe organizations daadwerkelijk worden aangemaakt in de database
-- 2. Elke organization zijn eigen data krijgt (gebruikers, filialen, etc.)
-- 3. Organizations kunnen worden opgehaald via slug
-- 4. Gebruikers kunnen authenticeren voor hun organization
-- 5. Organization statistieken kunnen worden opgehaald
-- 6. Test data wordt aangemaakt voor demonstratie

COMMENT ON FUNCTION create_new_organization IS 'Creates a new organization with all necessary data and default setup';
COMMENT ON FUNCTION get_active_organizations IS 'Returns all active organizations for the organization login page';
COMMENT ON FUNCTION get_organization_by_slug IS 'Returns organization data by slug for dynamic routing';
COMMENT ON FUNCTION authenticate_user_for_organization IS 'Authenticates user for specific organization';
COMMENT ON FUNCTION get_organization_stats IS 'Returns statistics for an organization';
