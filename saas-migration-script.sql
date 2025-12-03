-- MIGRATION SCRIPT: Transform Single-Tenant to Multi-Tenant SaaS
-- Dit script migreert de bestaande Poule & Poulette app naar een multi-tenant SaaS platform
-- 
-- STAP 1: Backup maken (DOE DIT EERST!)
-- CREATE SCHEMA backup_before_saas_migration;
-- 
-- STAP 2: Dit script uitvoeren in Supabase SQL Editor
-- 
-- STAP 3: Testen met bestaande data
-- 
-- STAP 4: Frontend updaten voor nieuwe structuur

-- ==============================================
-- STAP 1: CREATE ORGANIZATIONS TABLE
-- ==============================================

-- Organizations tabel voor multi-tenant support
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  tier VARCHAR(50) NOT NULL DEFAULT 'starter',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  
  -- Branding configuratie
  primary_color VARCHAR(7) DEFAULT '#1C3834',
  secondary_color VARCHAR(7) DEFAULT '#93231F',
  accent_color VARCHAR(7) DEFAULT '#F495BD',
  background_color VARCHAR(7) DEFAULT '#FBFBF1',
  text_color VARCHAR(7) DEFAULT '#060709',
  primary_font VARCHAR(100) DEFAULT 'Lino Stamp',
  accent_font VARCHAR(100) DEFAULT 'Bacon Kingdom',
  
  -- Assets
  logo_url TEXT,
  favicon_url TEXT,
  
  -- Subscription info
  subscription_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'active',
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Limits per tier
  max_users INTEGER DEFAULT 5,
  max_filialen INTEGER DEFAULT 3,
  max_audits_per_month INTEGER DEFAULT 10,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ==============================================
-- STAP 2: ADD ORGANIZATION COLUMNS TO EXISTING TABLES
-- ==============================================

-- Add organization_id to gebruikers
ALTER TABLE gebruikers 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active';

-- Add organization_id to filialen
ALTER TABLE filialen 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Add organization_id to audit_checklist_items
ALTER TABLE audit_checklist_items 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- Add organization_id to notificaties
ALTER TABLE notificaties 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- ==============================================
-- STAP 3: CREATE SUPPORTING TABLES
-- ==============================================

-- Organization settings voor extra configuratie
CREATE TABLE IF NOT EXISTS organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, setting_key)
);

-- Organization templates voor onboarding
CREATE TABLE IF NOT EXISTS organization_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tier VARCHAR(50) NOT NULL,
  
  -- Template configuratie
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  accent_color VARCHAR(7),
  background_color VARCHAR(7),
  text_color VARCHAR(7),
  primary_font VARCHAR(100),
  accent_font VARCHAR(100),
  
  -- Template data
  checklist_items JSONB,
  default_roles JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  tier VARCHAR(50) UNIQUE NOT NULL,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  
  -- Features per plan
  max_users INTEGER,
  max_filialen INTEGER,
  max_audits_per_month INTEGER,
  custom_branding BOOLEAN DEFAULT false,
  api_access BOOLEAN DEFAULT false,
  priority_support BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- STAP 4: INSERT DEFAULT DATA
-- ==============================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, tier, price_monthly, price_yearly, max_users, max_filialen, max_audits_per_month, custom_branding, api_access, priority_support) VALUES
('Starter', 'starter', 29.00, 290.00, 5, 3, 10, false, false, false),
('Professional', 'professional', 99.00, 990.00, 25, 15, 100, true, false, true),
('Enterprise', 'enterprise', 299.00, 2990.00, NULL, NULL, NULL, true, true, true)
ON CONFLICT (tier) DO NOTHING;

-- Insert Poule & Poulette organization (behoud bestaande data)
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
  max_users, 
  max_filialen, 
  max_audits_per_month
) VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'Poule & Poulette', 
  'pp', 
  'enterprise', 
  '#1C3834', 
  '#93231F', 
  '#F495BD', 
  '#FBFBF1', 
  '#060709', 
  'Lino Stamp', 
  'Bacon Kingdom', 
  100, 
  50, 
  1000
) ON CONFLICT (slug) DO NOTHING;

-- Insert default organization templates
INSERT INTO organization_templates (name, description, tier, primary_color, secondary_color, accent_color, background_color, text_color, primary_font, accent_font) VALUES
('Restaurant Template', 'Standaard template voor restaurants en horeca', 'starter', '#1C3834', '#93231F', '#F495BD', '#FBFBF1', '#060709', 'Lino Stamp', 'Bacon Kingdom'),
('Retail Template', 'Template voor retail en winkelketens', 'professional', '#2563eb', '#dc2626', '#f59e0b', '#f8fafc', '#1f2937', 'Inter', 'Inter'),
('Corporate Template', 'Professionele template voor grote bedrijven', 'enterprise', '#0f172a', '#1e40af', '#059669', '#ffffff', '#0f172a', 'Inter', 'Inter')
ON CONFLICT DO NOTHING;

-- ==============================================
-- STAP 5: MIGRATE EXISTING DATA
-- ==============================================

-- Update bestaande gebruikers om te koppelen aan PP organization
UPDATE gebruikers 
SET organization_id = '00000000-0000-0000-0000-000000000001' 
WHERE organization_id IS NULL;

-- Update bestaande filialen om te koppelen aan PP organization
UPDATE filialen 
SET organization_id = '00000000-0000-0000-0000-000000000001' 
WHERE organization_id IS NULL;

-- Update bestaande audit_checklist_items om te koppelen aan PP organization
UPDATE audit_checklist_items 
SET organization_id = '00000000-0000-0000-0000-000000000001' 
WHERE organization_id IS NULL;

-- Update bestaande notificaties om te koppelen aan PP organization
UPDATE notificaties 
SET organization_id = '00000000-0000-0000-0000-000000000001' 
WHERE organization_id IS NULL;

-- ==============================================
-- STAP 6: CREATE INDEXES FOR PERFORMANCE
-- ==============================================

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_tier ON organizations(tier);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_gebruikers_organization_id ON gebruikers(organization_id);
CREATE INDEX IF NOT EXISTS idx_filialen_organization_id ON filialen(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_checklist_items_organization_id ON audit_checklist_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_notificaties_organization_id ON notificaties(organization_id);

-- ==============================================
-- STAP 7: SETUP ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS on new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their own organization" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM gebruikers 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all organizations" ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM gebruikers 
      WHERE id = auth.uid() 
      AND rol = 'admin' 
      AND organization_id = organizations.id
    )
  );

-- Organization settings policies
CREATE POLICY "Users can view their organization settings" ON organization_settings
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM gebruikers 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage organization settings" ON organization_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM gebruikers 
      WHERE id = auth.uid() 
      AND rol = 'admin' 
      AND organization_id = organization_settings.organization_id
    )
  );

-- Templates policies (public read)
CREATE POLICY "Anyone can view templates" ON organization_templates
  FOR SELECT USING (true);

-- Subscription plans policies (public read)
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans
  FOR SELECT USING (true);

-- ==============================================
-- STAP 8: CREATE HELPER FUNCTIONS
-- ==============================================

-- Function om nieuwe organization aan te maken
CREATE OR REPLACE FUNCTION create_organization(
  org_name TEXT,
  org_slug TEXT,
  org_tier TEXT DEFAULT 'starter',
  created_by_user_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Generate new organization ID
  new_org_id := gen_random_uuid();
  
  -- Insert new organization
  INSERT INTO organizations (
    id,
    name,
    slug,
    tier,
    created_by
  ) VALUES (
    new_org_id,
    org_name,
    org_slug,
    org_tier,
    created_by_user_id
  );
  
  -- Copy checklist items from PP template
  INSERT INTO audit_checklist_items (
    categorie,
    titel,
    beschrijving,
    gewicht,
    volgorde,
    actief,
    organization_id
  )
  SELECT 
    categorie,
    titel,
    beschrijving,
    gewicht,
    volgorde,
    actief,
    new_org_id
  FROM audit_checklist_items 
  WHERE organization_id = '00000000-0000-0000-0000-000000000001';
  
  RETURN new_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function om organization slug te valideren
CREATE OR REPLACE FUNCTION validate_organization_slug(slug TEXT) RETURNS BOOLEAN AS $$
BEGIN
  -- Check if slug is valid (alphanumeric + hyphens, 3-50 chars)
  IF slug !~ '^[a-z0-9-]{3,50}$' THEN
    RETURN FALSE;
  END IF;
  
  -- Check if slug is not already taken
  IF EXISTS (SELECT 1 FROM organizations WHERE organizations.slug = slug) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- STAP 9: CREATE TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_organizations_updated_at 
  BEFORE UPDATE ON organizations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_settings_updated_at 
  BEFORE UPDATE ON organization_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at 
  BEFORE UPDATE ON subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- STAP 10: CREATE VIEWS FOR ANALYTICS
-- ==============================================

-- Organization stats view
CREATE OR REPLACE VIEW organization_stats AS
SELECT 
  o.id,
  o.name,
  o.slug,
  o.tier,
  o.status,
  COUNT(DISTINCT g.id) as user_count,
  COUNT(DISTINCT f.id) as filialen_count,
  COUNT(DISTINCT a.id) as audits_count,
  o.max_users,
  o.max_filialen,
  o.max_audits_per_month,
  o.created_at
FROM organizations o
LEFT JOIN gebruikers g ON g.organization_id = o.id
LEFT JOIN filialen f ON f.organization_id = o.id
LEFT JOIN audits a ON a.filiaal_id = f.id
GROUP BY o.id, o.name, o.slug, o.tier, o.status, o.max_users, o.max_filialen, o.max_audits_per_month, o.created_at;

-- ==============================================
-- STAP 11: GRANT PERMISSIONS
-- ==============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ==============================================
-- STAP 12: VERIFICATION QUERIES
-- ==============================================

-- Test queries om te verifiëren dat alles werkt:

-- 1. Check organizations
-- SELECT * FROM organizations;

-- 2. Check that PP organization has all data
-- SELECT 
--   o.name,
--   COUNT(DISTINCT g.id) as users,
--   COUNT(DISTINCT f.id) as filialen,
--   COUNT(DISTINCT a.id) as audits
-- FROM organizations o
-- LEFT JOIN gebruikers g ON g.organization_id = o.id
-- LEFT JOIN filialen f ON f.organization_id = o.id
-- LEFT JOIN audits a ON a.filiaal_id = f.id
-- WHERE o.slug = 'pp'
-- GROUP BY o.id, o.name;

-- 3. Test organization creation function
-- SELECT create_organization('Test Company', 'test-company', 'starter');

-- 4. Test slug validation
-- SELECT validate_organization_slug('test-company'); -- Should return false (already exists)
-- SELECT validate_organization_slug('new-company'); -- Should return true

-- ==============================================
-- MIGRATION COMPLETE!
-- ==============================================

-- De volgende stappen:
-- 1. Test de database met bovenstaande verification queries
-- 2. Update de frontend om organization-based routing te gebruiken
-- 3. Update AuthProvider om organization context te ondersteunen
-- 4. Test de volledige flow met een nieuwe organization
-- 5. Deploy naar productie

COMMENT ON TABLE organizations IS 'Multi-tenant organizations table for SaaS platform';
COMMENT ON TABLE organization_settings IS 'Custom settings per organization';
COMMENT ON TABLE organization_templates IS 'Templates for new organization onboarding';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans and pricing';
