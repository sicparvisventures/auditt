-- MINIMAL FIX: Voeg alleen get_active_organizations functie toe
-- Dit is de snelste fix voor het "function not found" probleem

-- ==============================================
-- CREATE ORGANIZATION LISTING FUNCTION
-- ==============================================

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
    COALESCE(o.status, 'active') as status,
    COALESCE(o.primary_color, '#2563eb') as primary_color,
    COALESCE(o.secondary_color, '#dc2626') as secondary_color,
    COALESCE(o.accent_color, '#f59e0b') as accent_color,
    COALESCE(o.background_color, '#f8fafc') as background_color,
    COALESCE(o.text_color, '#1f2937') as text_color,
    COALESCE(o.primary_font, 'Inter') as primary_font,
    COALESCE(o.accent_font, 'Inter') as accent_font,
    o.logo_url,
    COALESCE(o.created_at, NOW()) as created_at
  FROM organizations o
  WHERE o.status = 'active' OR o.status IS NULL
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_active_organizations TO anon, authenticated;

-- Create default PP organization if it doesn't exist
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

-- Test the function
SELECT 'get_active_organizations function created successfully!' as status;
SELECT * FROM get_active_organizations();
