-- SAFE SAAS MIGRATION SCRIPT
-- Dit script migreert de bestaande database naar multi-tenant SaaS
-- Controleert eerst of tabellen bestaan voordat het ze probeert te updaten

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
-- STAP 2: CREATE SUPPORTING TABLES
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
-- STAP 3: INSERT DEFAULT DATA
-- ==============================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, tier, price_monthly, price_yearly, max_users, max_filialen, max_audits_per_month, custom_branding, api_access, priority_support) VALUES
('Starter', 'starter', 29.00, 290.00, 5, 3, 10, false, false, false),
('Professional', 'professional', 99.00, 990.00, 25, 15, 100, true, false, true),
('Enterprise', 'enterprise', 299.00, 2990.00, NULL, NULL, NULL, true, true, true)
ON CONFLICT (tier) DO NOTHING;

-- Insert Poule & Poulette organization (behoud bestaande data)
-- Only insert if organizations table exists and has the required columns
DO $$
BEGIN
    -- Check if organizations table exists and has required columns
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations') THEN
        -- Insert PP organization with all required fields
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
    END IF;
END $$;

-- Insert default organization templates
INSERT INTO organization_templates (name, description, tier, primary_color, secondary_color, accent_color, background_color, text_color, primary_font, accent_font) VALUES
('Restaurant Template', 'Standaard template voor restaurants en horeca', 'starter', '#1C3834', '#93231F', '#F495BD', '#FBFBF1', '#060709', 'Lino Stamp', 'Bacon Kingdom'),
('Retail Template', 'Template voor retail en winkelketens', 'professional', '#2563eb', '#dc2626', '#f59e0b', '#f8fafc', '#1f2937', 'Inter', 'Inter'),
('Corporate Template', 'Professionele template voor grote bedrijven', 'enterprise', '#0f172a', '#1e40af', '#059669', '#ffffff', '#0f172a', 'Inter', 'Inter')
ON CONFLICT DO NOTHING;

-- ==============================================
-- STAP 4: SAFELY ADD ORGANIZATION COLUMNS
-- ==============================================

-- Function to safely add columns
CREATE OR REPLACE FUNCTION safe_add_column_if_not_exists(
    table_name TEXT,
    column_name TEXT,
    column_type TEXT
) RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = $2
    ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', $1, $2, $3);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Safely add organization_id columns to existing tables
DO $$
BEGIN
    -- Add to gebruikers if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gebruikers') THEN
        PERFORM safe_add_column_if_not_exists('gebruikers', 'organization_id', 'UUID REFERENCES organizations(id) ON DELETE CASCADE');
        PERFORM safe_add_column_if_not_exists('gebruikers', 'subscription_status', 'VARCHAR(50) DEFAULT ''active''');
    END IF;
    
    -- Add to filialen if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'filialen') THEN
        PERFORM safe_add_column_if_not_exists('filialen', 'organization_id', 'UUID REFERENCES organizations(id) ON DELETE CASCADE');
    END IF;
    
    -- Add to audit_checklist_items if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_checklist_items') THEN
        PERFORM safe_add_column_if_not_exists('audit_checklist_items', 'organization_id', 'UUID REFERENCES organizations(id) ON DELETE CASCADE');
    END IF;
    
    -- Add to notificaties if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notificaties') THEN
        PERFORM safe_add_column_if_not_exists('notificaties', 'organization_id', 'UUID REFERENCES organizations(id) ON DELETE CASCADE');
    END IF;
END $$;

-- ==============================================
-- STAP 5: MIGRATE EXISTING DATA (SAFELY)
-- ==============================================

-- Update bestaande data om te koppelen aan PP organization
DO $$
BEGIN
    -- Update gebruikers if table exists and has organization_id column
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gebruikers' AND column_name = 'organization_id') THEN
        UPDATE gebruikers 
        SET organization_id = '00000000-0000-0000-0000-000000000001' 
        WHERE organization_id IS NULL;
    END IF;
    
    -- Update filialen if table exists and has organization_id column
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'filialen' AND column_name = 'organization_id') THEN
        UPDATE filialen 
        SET organization_id = '00000000-0000-0000-0000-000000000001' 
        WHERE organization_id IS NULL;
    END IF;
    
    -- Update audit_checklist_items if table exists and has organization_id column
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_checklist_items' AND column_name = 'organization_id') THEN
        UPDATE audit_checklist_items 
        SET organization_id = '00000000-0000-0000-0000-000000000001' 
        WHERE organization_id IS NULL;
    END IF;
    
    -- Update notificaties if table exists and has organization_id column
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notificaties' AND column_name = 'organization_id') THEN
        UPDATE notificaties 
        SET organization_id = '00000000-0000-0000-0000-000000000001' 
        WHERE organization_id IS NULL;
    END IF;
END $$;

-- ==============================================
-- STAP 6: CREATE INDEXES FOR PERFORMANCE
-- ==============================================

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_tier ON organizations(tier);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);

-- Create indexes on organization_id columns if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gebruikers' AND column_name = 'organization_id') THEN
        CREATE INDEX IF NOT EXISTS idx_gebruikers_organization_id ON gebruikers(organization_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'filialen' AND column_name = 'organization_id') THEN
        CREATE INDEX IF NOT EXISTS idx_filialen_organization_id ON filialen(organization_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_checklist_items' AND column_name = 'organization_id') THEN
        CREATE INDEX IF NOT EXISTS idx_audit_checklist_items_organization_id ON audit_checklist_items(organization_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notificaties' AND column_name = 'organization_id') THEN
        CREATE INDEX IF NOT EXISTS idx_notificaties_organization_id ON notificaties(organization_id);
    END IF;
END $$;

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
  
  -- Copy checklist items from PP template if table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_checklist_items') THEN
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
  END IF;
  
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
-- MIGRATION COMPLETE!
-- ==============================================

-- Test queries om te verifiëren dat alles werkt:

-- 1. Check organizations
-- SELECT * FROM organizations;

-- 2. Check that PP organization exists
-- SELECT * FROM organizations WHERE slug = 'pp';

-- 3. Test organization creation function
-- SELECT create_organization('Test Company', 'test-company', 'starter');

-- 4. Test slug validation
-- SELECT validate_organization_slug('test-company'); -- Should return false (already exists)
-- SELECT validate_organization_slug('new-company'); -- Should return true

COMMENT ON TABLE organizations IS 'Multi-tenant organizations table for SaaS platform';
COMMENT ON TABLE organization_settings IS 'Custom settings per organization';
COMMENT ON TABLE organization_templates IS 'Templates for new organization onboarding';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans and pricing';
