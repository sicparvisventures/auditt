-- SaaS Multi-Tenant Database Schema
-- Dit script transformeert de huidige single-tenant app naar een multi-tenant SaaS platform

-- 1. Organizations tabel - Elke klant krijgt een eigen organization
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL, -- Bijv: 'pp', 'company-abc', 'restaurant-xyz'
  domain VARCHAR(255), -- Optioneel custom domain
  tier VARCHAR(50) NOT NULL DEFAULT 'starter', -- starter, professional, enterprise
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, suspended, cancelled
  
  -- Branding configuratie
  primary_color VARCHAR(7) DEFAULT '#1C3834', -- Olive default
  secondary_color VARCHAR(7) DEFAULT '#93231F', -- Christmas red default
  accent_color VARCHAR(7) DEFAULT '#F495BD', -- Lollypop pink default
  background_color VARCHAR(7) DEFAULT '#FBFBF1', -- PP white default
  text_color VARCHAR(7) DEFAULT '#060709', -- PP black default
  
  -- Font configuratie
  primary_font VARCHAR(100) DEFAULT 'Lino Stamp',
  accent_font VARCHAR(100) DEFAULT 'Bacon Kingdom',
  
  -- Logo en branding
  logo_url TEXT,
  favicon_url TEXT,
  
  -- Subscription info
  subscription_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'active',
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Limits per tier
  max_users INTEGER DEFAULT 5, -- Starter: 5, Professional: 25, Enterprise: unlimited
  max_filialen INTEGER DEFAULT 3, -- Starter: 3, Professional: 15, Enterprise: unlimited
  max_audits_per_month INTEGER DEFAULT 10, -- Starter: 10, Professional: 100, Enterprise: unlimited
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. Update gebruikers tabel voor multi-tenant support
ALTER TABLE gebruikers 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active';

-- 3. Update filialen tabel voor multi-tenant support
ALTER TABLE filialen 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- 4. Update audit_checklist_items voor multi-tenant support
ALTER TABLE audit_checklist_items 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- 5. Update audits tabel voor multi-tenant support (via filialen)
-- Audits zijn al gekoppeld aan filialen, dus indirect aan organization

-- 6. Update acties tabel voor multi-tenant support (via audits)
-- Acties zijn al gekoppeld aan audits, dus indirect aan organization

-- 7. Update rapporten tabel voor multi-tenant support (via audits)
-- Rapporten zijn al gekoppeld aan audits, dus indirect aan organization

-- 8. Update notificaties tabel voor multi-tenant support
ALTER TABLE notificaties 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- 9. Organization settings tabel voor extra configuratie
CREATE TABLE IF NOT EXISTS organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, setting_key)
);

-- 10. Organization templates tabel voor onboarding
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
  checklist_items JSONB, -- Vooraf ingestelde checklist items
  default_roles JSONB, -- Standaard rollen en permissions
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Subscription plans tabel
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

-- 12. Insert default subscription plans
INSERT INTO subscription_plans (name, tier, price_monthly, price_yearly, max_users, max_filialen, max_audits_per_month, custom_branding, api_access, priority_support) VALUES
('Starter', 'starter', 29.00, 290.00, 5, 3, 10, false, false, false),
('Professional', 'professional', 99.00, 990.00, 25, 15, 100, true, false, true),
('Enterprise', 'enterprise', 299.00, 2990.00, NULL, NULL, NULL, true, true, true)
ON CONFLICT (tier) DO NOTHING;

-- 13. Insert default organization template (Poule & Poulette)
INSERT INTO organizations (id, name, slug, tier, primary_color, secondary_color, accent_color, background_color, text_color, primary_font, accent_font, max_users, max_filialen, max_audits_per_month) VALUES
('00000000-0000-0000-0000-000000000001', 'Poule & Poulette', 'pp', 'enterprise', '#1C3834', '#93231F', '#F495BD', '#FBFBF1', '#060709', 'Lino Stamp', 'Bacon Kingdom', 100, 50, 1000)
ON CONFLICT (slug) DO NOTHING;

-- 14. Insert default organization templates
INSERT INTO organization_templates (name, description, tier, primary_color, secondary_color, accent_color, background_color, text_color, primary_font, accent_font) VALUES
('Restaurant Template', 'Standaard template voor restaurants en horeca', 'starter', '#1C3834', '#93231F', '#F495BD', '#FBFBF1', '#060709', 'Lino Stamp', 'Bacon Kingdom'),
('Retail Template', 'Template voor retail en winkelketens', 'professional', '#2563eb', '#dc2626', '#f59e0b', '#f8fafc', '#1f2937', 'Inter', 'Inter'),
('Corporate Template', 'Professionele template voor grote bedrijven', 'enterprise', '#0f172a', '#1e40af', '#059669', '#ffffff', '#0f172a', 'Inter', 'Inter');

-- 15. Update bestaande data om te koppelen aan PP organization
UPDATE gebruikers SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE filialen SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE audit_checklist_items SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE notificaties SET organization_id = '00000000-0000-0000-0000-000000000001' WHERE organization_id IS NULL;

-- 16. Create indexes voor performance
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_tier ON organizations(tier);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_gebruikers_organization_id ON gebruikers(organization_id);
CREATE INDEX IF NOT EXISTS idx_filialen_organization_id ON filialen(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_checklist_items_organization_id ON audit_checklist_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_notificaties_organization_id ON notificaties(organization_id);

-- 17. Row Level Security (RLS) policies voor multi-tenant isolation
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

-- 18. Functions voor organization management
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
  
  -- Copy checklist items from template
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

-- 19. Function om organization slug te valideren
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

-- 20. Trigger om updated_at te updaten
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at 
  BEFORE UPDATE ON organizations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_settings_updated_at 
  BEFORE UPDATE ON organization_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at 
  BEFORE UPDATE ON subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 21. Views voor organization data
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

-- 22. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
