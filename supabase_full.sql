-- =====================================================
-- POULE & POULETTE INTERNE AUDIT TOOL - COMPLETE SUPABASE SCHEMA
-- =====================================================
-- Generated from running codebase analysis
-- This file creates the complete database schema for the audit application
-- Run this in Supabase SQL Editor to set up the entire database
-- =====================================================

-- ===== EXTENSIONS =====
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ===== SCHEMAS =====
-- Public schema is created by default

-- ===== ENUMS =====
-- Create all enums with safe guards for idempotency

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'coo', 'district_manager', 'filiaal_manager', 'inspector', 'storemanager', 'developer');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE filiaal_status AS ENUM ('actief', 'inactief');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_status AS ENUM ('in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_result AS ENUM ('ok', 'niet_ok');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE action_status AS ENUM ('pending', 'in_progress', 'completed', 'verified');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending', 'sent', 'failed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ===== TABLES =====

-- Users table (gebruikers)
CREATE TABLE IF NOT EXISTS gebruikers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email CITEXT UNIQUE NOT NULL, -- This field stores the user_id for login
    naam VARCHAR(255) NOT NULL,
    rol user_role NOT NULL,
    telefoon VARCHAR(20),
    actief BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Filialen table
CREATE TABLE IF NOT EXISTS filialen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    naam VARCHAR(255) NOT NULL,
    locatie VARCHAR(255) NOT NULL,
    district_manager_id UUID REFERENCES gebruikers(id) ON DELETE SET NULL,
    adres TEXT NOT NULL,
    telefoon VARCHAR(20),
    email CITEXT,
    status filiaal_status DEFAULT 'actief',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit checklist items table
CREATE TABLE IF NOT EXISTS audit_checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categorie VARCHAR(100) NOT NULL,
    titel VARCHAR(255) NOT NULL,
    beschrijving TEXT,
    gewicht NUMERIC(3,2) DEFAULT 1.00,
    volgorde INTEGER NOT NULL,
    actief BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audits table
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filiaal_id UUID REFERENCES filialen(id) ON DELETE CASCADE,
    district_manager_id UUID REFERENCES gebruikers(id) ON DELETE SET NULL,
    audit_datum DATE NOT NULL,
    status audit_status DEFAULT 'in_progress',
    totale_score NUMERIC(3,2) DEFAULT 0.00,
    pass_percentage NUMERIC(5,2) DEFAULT 0.00,
    opmerkingen TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit results table
CREATE TABLE IF NOT EXISTS audit_resultaten (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    checklist_item_id UUID REFERENCES audit_checklist_items(id) ON DELETE CASCADE,
    resultaat audit_result NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 5),
    opmerkingen TEXT,
    foto_urls TEXT[] DEFAULT '{}',
    verbeterpunt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS rapporten (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    rapport_url TEXT,
    verstuurd_naar TEXT[] DEFAULT '{}',
    verstuur_datum TIMESTAMPTZ,
    status report_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Actions table
CREATE TABLE IF NOT EXISTS acties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    audit_resultaat_id UUID REFERENCES audit_resultaten(id) ON DELETE CASCADE,
    titel VARCHAR(255) NOT NULL,
    beschrijving TEXT NOT NULL,
    urgentie urgency_level NOT NULL DEFAULT 'medium',
    status action_status DEFAULT 'pending',
    toegewezen_aan UUID REFERENCES gebruikers(id) ON DELETE SET NULL,
    deadline DATE,
    actie_onderneem TEXT,
    foto_urls TEXT[] DEFAULT '{}',
    voltooid_door UUID REFERENCES gebruikers(id) ON DELETE SET NULL,
    voltooid_op TIMESTAMPTZ,
    geverifieerd_door UUID REFERENCES gebruikers(id) ON DELETE SET NULL,
    geverifieerd_op TIMESTAMPTZ,
    verificatie_opmerkingen TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notificaties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gebruiker_id UUID REFERENCES gebruikers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'action_completed', 'action_verified', 'action_overdue'
    titel VARCHAR(255) NOT NULL,
    bericht TEXT NOT NULL,
    actie_id UUID REFERENCES acties(id) ON DELETE CASCADE,
    gelezen BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INDEXES =====

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_filialen_district_manager ON filialen(district_manager_id);
CREATE INDEX IF NOT EXISTS idx_filialen_status ON filialen(status);

CREATE INDEX IF NOT EXISTS idx_audits_filiaal ON audits(filiaal_id);
CREATE INDEX IF NOT EXISTS idx_audits_manager ON audits(district_manager_id);
CREATE INDEX IF NOT EXISTS idx_audits_datum ON audits(audit_datum DESC);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);

CREATE INDEX IF NOT EXISTS idx_audit_resultaten_audit ON audit_resultaten(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_resultaten_item ON audit_resultaten(checklist_item_id);
CREATE INDEX IF NOT EXISTS idx_audit_resultaten_resultaat ON audit_resultaten(resultaat);

CREATE INDEX IF NOT EXISTS idx_rapporten_audit ON rapporten(audit_id);
CREATE INDEX IF NOT EXISTS idx_rapporten_status ON rapporten(status);

CREATE INDEX IF NOT EXISTS idx_acties_audit ON acties(audit_id);
CREATE INDEX IF NOT EXISTS idx_acties_toegewezen ON acties(toegewezen_aan);
CREATE INDEX IF NOT EXISTS idx_acties_status ON acties(status);
CREATE INDEX IF NOT EXISTS idx_acties_urgentie ON acties(urgentie);
CREATE INDEX IF NOT EXISTS idx_acties_deadline ON acties(deadline);

CREATE INDEX IF NOT EXISTS idx_notificaties_gebruiker ON notificaties(gebruiker_id);
CREATE INDEX IF NOT EXISTS idx_notificaties_gelezen ON notificaties(gelezen);
CREATE INDEX IF NOT EXISTS idx_notificaties_type ON notificaties(type);
CREATE INDEX IF NOT EXISTS idx_notificaties_created_at ON notificaties(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_checklist_items_categorie ON audit_checklist_items(categorie);
CREATE INDEX IF NOT EXISTS idx_checklist_items_volgorde ON audit_checklist_items(volgorde);
CREATE INDEX IF NOT EXISTS idx_checklist_items_actief ON audit_checklist_items(actief);

-- ===== FUNCTIONS AND TRIGGERS =====

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_gebruikers_updated_at ON gebruikers;
CREATE TRIGGER update_gebruikers_updated_at 
    BEFORE UPDATE ON gebruikers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_filialen_updated_at ON filialen;
CREATE TRIGGER update_filialen_updated_at 
    BEFORE UPDATE ON filialen
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_audits_updated_at ON audits;
CREATE TRIGGER update_audits_updated_at 
    BEFORE UPDATE ON audits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_acties_updated_at ON acties;
CREATE TRIGGER update_acties_updated_at 
    BEFORE UPDATE ON acties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate audit score (drop first to handle signature changes)
DROP FUNCTION IF EXISTS calculate_audit_score;
CREATE OR REPLACE FUNCTION calculate_audit_score(audit_id UUID)
RETURNS TABLE(
    totale_score NUMERIC(3,2),
    pass_percentage NUMERIC(5,2),
    is_pass BOOLEAN
) AS $$
DECLARE
    total_weighted_score NUMERIC := 0;
    total_weight NUMERIC := 0;
    avg_score NUMERIC(3,2);
    pass_pct NUMERIC(5,2);
    pass_threshold NUMERIC := 80.0;
BEGIN
    -- Calculate weighted average score
    SELECT 
        COALESCE(SUM(ar.score * aci.gewicht), 0),
        COALESCE(SUM(aci.gewicht), 0)
    INTO total_weighted_score, total_weight
    FROM audit_resultaten ar
    JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
    WHERE ar.audit_id = calculate_audit_score.audit_id;

    -- Calculate average score (0-5 scale)
    IF total_weight > 0 THEN
        avg_score := total_weighted_score / total_weight;
    ELSE
        avg_score := 0;
    END IF;

    -- Calculate pass percentage
    pass_pct := (avg_score / 5.0) * 100.0;

    -- Return results
    RETURN QUERY SELECT 
        ROUND(avg_score, 2) as totale_score,
        ROUND(pass_pct, 2) as pass_percentage,
        (pass_pct >= pass_threshold) as is_pass;
END;
$$ LANGUAGE plpgsql;

-- Function to update audit scores automatically
CREATE OR REPLACE FUNCTION update_audit_scores()
RETURNS TRIGGER AS $$
DECLARE
    score_data RECORD;
BEGIN
    -- Get audit_id from the trigger context
    DECLARE 
        target_audit_id UUID;
    BEGIN
        IF TG_OP = 'DELETE' THEN
            target_audit_id := OLD.audit_id;
        ELSE
            target_audit_id := NEW.audit_id;
        END IF;

        -- Calculate new scores
        SELECT * INTO score_data
        FROM calculate_audit_score(target_audit_id);

        -- Update audit with new scores
        UPDATE audits 
        SET 
            totale_score = score_data.totale_score,
            pass_percentage = score_data.pass_percentage,
            updated_at = NOW()
        WHERE id = target_audit_id;

        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        ELSE
            RETURN NEW;
        END IF;
    END;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update audit scores
DROP TRIGGER IF EXISTS update_audit_scores_trigger ON audit_resultaten;
CREATE TRIGGER update_audit_scores_trigger
    AFTER INSERT OR UPDATE OR DELETE ON audit_resultaten
    FOR EACH ROW EXECUTE FUNCTION update_audit_scores();

-- Function to determine action urgency based on category and score
DROP FUNCTION IF EXISTS determine_action_urgency;
CREATE OR REPLACE FUNCTION determine_action_urgency(
    categorie TEXT,
    score INTEGER,
    gewicht NUMERIC
) RETURNS urgency_level AS $$
BEGIN
    -- Critical urgency for food safety, FIFO, and safety issues with low scores
    IF (categorie ILIKE '%FIFO%' OR categorie ILIKE '%veiligheid%' OR categorie ILIKE '%hygiëne%' OR 
        categorie ILIKE '%keuken%' OR categorie ILIKE '%ongedierte%') 
       AND score <= 2 THEN
        RETURN 'critical';
    END IF;
    
    -- High urgency for food safety and hygiene with medium scores
    IF (categorie ILIKE '%keuken%' OR categorie ILIKE '%hygiëne%' OR categorie ILIKE '%ongedierte%' OR
        categorie ILIKE '%properheid%') 
       AND score <= 3 THEN
        RETURN 'high';
    END IF;
    
    -- High urgency for high-weight items with low scores
    IF gewicht >= 1.8 AND score <= 2 THEN
        RETURN 'high';
    END IF;
    
    -- High urgency for very low scores (0-1)
    IF score <= 1 THEN
        RETURN 'high';
    END IF;
    
    -- Medium urgency for low scores (2-3) or medium-weight items
    IF score <= 3 OR gewicht >= 1.5 THEN
        RETURN 'medium';
    END IF;
    
    -- Low urgency for everything else (score 4-5)
    RETURN 'low';
END;
$$ LANGUAGE plpgsql;

-- RPC Function to auto-create actions from audit results
DROP FUNCTION IF EXISTS create_actions_from_audit_results;
CREATE OR REPLACE FUNCTION create_actions_from_audit_results(audit_id UUID)
RETURNS VOID AS $$
DECLARE
    result_record RECORD;
    action_urgentie urgency_level;
    action_deadline DATE;
BEGIN
    -- Loop through all audit results that are not OK or have low scores
    FOR result_record IN 
        SELECT 
            ar.id as result_id,
            ar.audit_id,
            ar.checklist_item_id,
            ar.score,
            ar.opmerkingen,
            ar.verbeterpunt,
            aci.categorie,
            aci.titel,
            aci.beschrijving,
            aci.gewicht
        FROM audit_resultaten ar
        JOIN audit_checklist_items aci ON ar.checklist_item_id = aci.id
        WHERE ar.audit_id = create_actions_from_audit_results.audit_id
        AND (ar.resultaat = 'niet_ok' OR ar.score < 4)
    LOOP
        -- Determine urgency
        action_urgentie := determine_action_urgency(
            result_record.categorie,
            result_record.score,
            result_record.gewicht
        );
        
        -- Set deadline based on urgency
        CASE action_urgentie
            WHEN 'critical' THEN action_deadline := CURRENT_DATE + INTERVAL '1 day';
            WHEN 'high' THEN action_deadline := CURRENT_DATE + INTERVAL '3 days';
            WHEN 'medium' THEN action_deadline := CURRENT_DATE + INTERVAL '7 days';
            WHEN 'low' THEN action_deadline := CURRENT_DATE + INTERVAL '14 days';
        END CASE;
        
        -- Create action
        INSERT INTO acties (
            audit_id,
            audit_resultaat_id,
            titel,
            beschrijving,
            urgentie,
            deadline
        ) VALUES (
            result_record.audit_id,
            result_record.result_id,
            'Actie vereist: ' || result_record.titel,
            COALESCE(result_record.verbeterpunt, result_record.beschrijving) || 
            CASE 
                WHEN result_record.opmerkingen IS NOT NULL 
                THEN ' Opmerkingen: ' || result_record.opmerkingen
                ELSE ''
            END,
            action_urgentie,
            action_deadline
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop triggers first before dropping functions
DROP TRIGGER IF EXISTS action_completion_notifications_trigger ON acties;
DROP TRIGGER IF EXISTS action_verification_notifications_trigger ON acties;

-- Function to send notifications when actions are completed
DROP FUNCTION IF EXISTS send_action_completion_notifications;
CREATE OR REPLACE FUNCTION send_action_completion_notifications()
RETURNS TRIGGER AS $$
DECLARE
    audit_record RECORD;
    admin_users RECORD;
BEGIN
    -- Only send notifications when action status changes to completed
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Get audit and filiaal information
        SELECT 
            a.district_manager_id,
            f.naam as filiaal_naam,
            f.locatie as filiaal_locatie
        INTO audit_record
        FROM audits a
        JOIN filialen f ON a.filiaal_id = f.id
        WHERE a.id = NEW.audit_id;
        
        -- Notify district manager
        IF audit_record.district_manager_id IS NOT NULL THEN
            INSERT INTO notificaties (gebruiker_id, type, titel, bericht, actie_id)
            VALUES (
                audit_record.district_manager_id,
                'action_completed',
                'Actie voltooid: ' || NEW.titel,
                'De actie "' || NEW.titel || '" is voltooid voor ' || 
                audit_record.filiaal_naam || ' - ' || audit_record.filiaal_locatie || 
                '. Controleer de uitgevoerde actie en foto''s.',
                NEW.id
            );
        END IF;
        
        -- Notify all admin users
        FOR admin_users IN 
            SELECT id FROM gebruikers WHERE rol = 'admin' AND actief = true
        LOOP
            INSERT INTO notificaties (gebruiker_id, type, titel, bericht, actie_id)
            VALUES (
                admin_users.id,
                'action_completed',
                'Actie voltooid: ' || NEW.titel,
                'De actie "' || NEW.titel || '" is voltooid voor ' || 
                audit_record.filiaal_naam || ' - ' || audit_record.filiaal_locatie || 
                '. Controleer de uitgevoerde actie en foto''s.',
                NEW.id
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for action completion notifications
CREATE TRIGGER action_completion_notifications_trigger
    AFTER UPDATE ON acties
    FOR EACH ROW EXECUTE FUNCTION send_action_completion_notifications();

-- Function to send notifications when actions are verified
DROP FUNCTION IF EXISTS send_action_verification_notifications;
CREATE OR REPLACE FUNCTION send_action_verification_notifications()
RETURNS TRIGGER AS $$
DECLARE
    audit_record RECORD;
BEGIN
    -- Only send notifications when action status changes to verified
    IF NEW.status = 'verified' AND (OLD.status IS NULL OR OLD.status != 'verified') THEN
        -- Get audit and filiaal information
        SELECT 
            a.district_manager_id,
            f.naam as filiaal_naam,
            f.locatie as filiaal_locatie
        INTO audit_record
        FROM audits a
        JOIN filialen f ON a.filiaal_id = f.id
        WHERE a.id = NEW.audit_id;
        
        -- Notify the user who completed the action
        IF NEW.voltooid_door IS NOT NULL THEN
            INSERT INTO notificaties (gebruiker_id, type, titel, bericht, actie_id)
            VALUES (
                NEW.voltooid_door,
                'action_verified',
                'Actie geverifieerd: ' || NEW.titel,
                'De actie "' || NEW.titel || '" is geverifieerd voor ' || 
                audit_record.filiaal_naam || ' - ' || audit_record.filiaal_locatie || 
                '. De actie is succesvol afgerond.',
                NEW.id
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for action verification notifications
CREATE TRIGGER action_verification_notifications_trigger
    AFTER UPDATE ON acties
    FOR EACH ROW EXECUTE FUNCTION send_action_verification_notifications();

-- ===== ROW LEVEL SECURITY (RLS) =====

-- Enable RLS on all tables
ALTER TABLE gebruikers ENABLE ROW LEVEL SECURITY;
ALTER TABLE filialen ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_resultaten ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapporten ENABLE ROW LEVEL SECURITY;
ALTER TABLE acties ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaties ENABLE ROW LEVEL SECURITY;

-- Audit checklist items are public (read-only for authenticated users)
ALTER TABLE audit_checklist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gebruikers
DROP POLICY IF EXISTS "Users can read own data" ON gebruikers;
CREATE POLICY "Users can read own data" ON gebruikers
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON gebruikers;
CREATE POLICY "Users can update own data" ON gebruikers
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all users" ON gebruikers;
CREATE POLICY "Admins can manage all users" ON gebruikers
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM gebruikers 
            WHERE id = auth.uid() AND rol IN ('admin', 'coo')
        )
    );

-- RLS Policies for filialen
DROP POLICY IF EXISTS "District managers can read assigned filialen" ON filialen;
CREATE POLICY "District managers can read assigned filialen" ON filialen
    FOR SELECT TO authenticated
    USING (
        district_manager_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM gebruikers 
            WHERE id = auth.uid() AND rol IN ('admin', 'coo')
        )
    );

DROP POLICY IF EXISTS "Admins can manage filialen" ON filialen;
CREATE POLICY "Admins can manage filialen" ON filialen
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM gebruikers 
            WHERE id = auth.uid() AND rol IN ('admin', 'coo')
        )
    );

-- RLS Policies for audits
DROP POLICY IF EXISTS "District managers can read their audits" ON audits;
CREATE POLICY "District managers can read their audits" ON audits
    FOR SELECT TO authenticated
    USING (
        district_manager_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM filialen 
            WHERE id = filiaal_id AND district_manager_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM gebruikers 
            WHERE id = auth.uid() AND rol IN ('admin', 'coo')
        )
    );

DROP POLICY IF EXISTS "District managers can create audits" ON audits;
CREATE POLICY "District managers can create audits" ON audits
    FOR INSERT TO authenticated
    WITH CHECK (
        district_manager_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM filialen 
            WHERE id = filiaal_id AND district_manager_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "District managers can update their audits" ON audits;
CREATE POLICY "District managers can update their audits" ON audits
    FOR UPDATE TO authenticated
    USING (district_manager_id = auth.uid());

-- RLS Policies for audit_resultaten
DROP POLICY IF EXISTS "Audit results follow audit rules" ON audit_resultaten;
CREATE POLICY "Audit results follow audit rules" ON audit_resultaten
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM audits 
            WHERE id = audit_id AND (
                district_manager_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM filialen 
                    WHERE id = filiaal_id AND district_manager_id = auth.uid()
                ) OR
                EXISTS (
                    SELECT 1 FROM gebruikers 
                    WHERE id = auth.uid() AND rol IN ('admin', 'coo')
                )
            )
        )
    );

-- RLS Policies for rapporten
DROP POLICY IF EXISTS "Reports follow audit rules" ON rapporten;
CREATE POLICY "Reports follow audit rules" ON rapporten
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM audits 
            WHERE id = audit_id AND (
                district_manager_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM filialen 
                    WHERE id = filiaal_id AND district_manager_id = auth.uid()
                ) OR
                EXISTS (
                    SELECT 1 FROM gebruikers 
                    WHERE id = auth.uid() AND rol IN ('admin', 'coo')
                )
            )
        )
    );

-- RLS Policies for acties
DROP POLICY IF EXISTS "Actions follow audit rules" ON acties;
CREATE POLICY "Actions follow audit rules" ON acties
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM audits 
            WHERE id = audit_id AND (
                district_manager_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM filialen 
                    WHERE id = filiaal_id AND district_manager_id = auth.uid()
                ) OR
                EXISTS (
                    SELECT 1 FROM gebruikers 
                    WHERE id = auth.uid() AND rol IN ('admin', 'coo')
                )
            )
        ) OR
        toegewezen_aan = auth.uid() OR
        voltooid_door = auth.uid()
    );

-- RLS Policies for notificaties
DROP POLICY IF EXISTS "Users can see own notifications" ON notificaties;
CREATE POLICY "Users can see own notifications" ON notificaties
    FOR ALL TO authenticated
    USING (gebruiker_id = auth.uid());

-- RLS Policies for audit_checklist_items (public read)
DROP POLICY IF EXISTS "Authenticated users can read checklist items" ON audit_checklist_items;
CREATE POLICY "Authenticated users can read checklist items" ON audit_checklist_items
    FOR SELECT TO authenticated
    USING (actief = true);

DROP POLICY IF EXISTS "Admins can manage checklist items" ON audit_checklist_items;
CREATE POLICY "Admins can manage checklist items" ON audit_checklist_items
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM gebruikers 
            WHERE id = auth.uid() AND rol IN ('admin', 'coo')
        )
    );

-- ===== STORAGE BUCKETS =====

-- Create storage bucket for audit photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('audit-photos', 'audit-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for audit-photos bucket
DROP POLICY IF EXISTS "Public read audit photos" ON storage.objects;
CREATE POLICY "Public read audit photos" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'audit-photos');

DROP POLICY IF EXISTS "Authenticated users can upload audit photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload audit photos" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'audit-photos' AND
        (storage.foldername(name))[1] = 'audit-photos'
    );

DROP POLICY IF EXISTS "Users can update their audit photos" ON storage.objects;
CREATE POLICY "Users can update their audit photos" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'audit-photos');

DROP POLICY IF EXISTS "Users can delete their audit photos" ON storage.objects;
CREATE POLICY "Users can delete their audit photos" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'audit-photos');

-- ===== SEED DATA =====

-- Insert default checklist items (guarded for idempotency)
DO $$ BEGIN
    IF (SELECT COUNT(*) FROM audit_checklist_items) = 0 THEN
        INSERT INTO audit_checklist_items (categorie, titel, beschrijving, gewicht, volgorde) VALUES
        -- 1. BUITENKANT ZAAK
        ('Buitenkant Zaak', 'Terras uitnodigend (tafels ingedekt - operationeel)', 'Controleer of de tafels netjes zijn gedekt, het terras netjes wordt gepresenteerd en gereed is voor gasten', 1.5, 1),
        ('Buitenkant Zaak', 'Terras proper (vloer/meubilair)', 'Vloer en meubilair moeten schoon zijn en er mag geen rommel liggen', 1.3, 2),
        ('Buitenkant Zaak', 'Plantenbakken ok', 'Planten mogen niet verwelkt of vuil zijn, dit draagt bij aan een verzorgde uitstraling', 1.0, 3),

        -- 2. Spotchecks (bij aankomst)
        ('Spotchecks', 'Inkomzone proper en ordelijk', 'De ingang moet netjes en opgeruimd zijn. Geen rommel, schone vloeren en geen obstakels', 1.5, 4),
        ('Spotchecks', 'Geen sporen van ongedierte (vallen, uitwerpselen, vliegen)', 'Controleer op tekenen van ongedierte. Dit kan vallen voor insecten zijn, of sporen van muizen of andere dieren', 2.0, 5),
        ('Spotchecks', 'Vuil- of risicoplaatsen proper (achter toestellen, onder meubels, afvalzone, schoonmaakruimte, ventilatieroosters)', 'Deze plekken worden vaak over het hoofd gezien, maar ze kunnen ophoping van vuil of ongedierte veroorzaken', 1.8, 6),

        -- 3. Algemene properheid per zone
        ('Algemene Properheid', 'Keuken', 'Werkbladen moeten schoon zijn zonder etensresten, en alle producten moeten goed afgesloten zijn om besmetting te voorkomen', 2.0, 7),
        ('Algemene Properheid', 'Zaal', 'Tafels en stoelen moeten schoon zijn, de vloer mag geen vuil bevatten', 1.5, 8),
        ('Algemene Properheid', 'Toiletten', 'Ze moeten goed voorzien zijn (papier, zeep), geurvrij en hygiënisch', 1.8, 9),
        ('Algemene Properheid', 'Kelder', 'De kelder moet schoon, droog en georganiseerd zijn om risico''s van schimmel of vuil te vermijden', 1.3, 10),
        ('Algemene Properheid', 'Extra ruimtes/kleedkamers', 'Persoonlijke spullen moeten opgeborgen zijn en de ruimte moet netjes zijn', 1.0, 11),

        -- 4. FIFO-controle
        ('FIFO Controle', 'Frigo keuken', 'In de koelkasten moet volgens het FIFO-principe (First In, First Out) gewerkt worden en mogen er geen verlopen producten zijn', 2.0, 12),
        ('FIFO Controle', 'Vriezer keuken', 'Vriezer moet goed gelabeld zijn met datums en producten moeten goed georganiseerd zijn', 1.8, 13),
        ('FIFO Controle', 'Frigo''s bar', 'Ook hier moet FIFO gevolgd worden en de frigo moet ordelijk zijn zonder verlopen producten', 1.5, 14),

        -- 5. Overige operationele checks
        ('Operationele Checks', 'Personeelsbezetting & planning', 'Is het personeel voldoende en goed ingepland voor de drukte? Zorg voor een goede balans tussen rust en piekuren', 1.5, 15),
        ('Operationele Checks', 'Kassaprocedures en dagrapporten', 'Is alles correct geregistreerd en zijn de dagrapporten accuraat?', 1.3, 16),
        ('Operationele Checks', 'Voorraadniveaus', 'Zorg ervoor dat de voorraad op peil is en er geen tekorten zijn voor de operationele uren', 1.2, 17),
        ('Operationele Checks', 'Acties en promoties correct uitgevoerd', 'Zijn de promoties correct gepromoot en uitgevoerd volgens de afspraken?', 1.0, 18),
        ('Operationele Checks', 'Gastbeleving en servicekwaliteit', 'Hoe wordt de service ervaren door de gasten? Is er ruimte voor verbetering?', 1.8, 19),
        ('Operationele Checks', 'Veiligheid (brandblussers, nooduitgangen, EHBO)', 'Controleer of de veiligheidsmaatregelen op hun plaats zijn en goed werken', 1.5, 20);
        
        RAISE NOTICE 'Checklist items inserted successfully.';
    ELSE
        RAISE NOTICE 'Checklist items already exist, skipping insertion.';
    END IF;
END $$;

-- Insert seed users (guarded for idempotency)
DO $$ BEGIN
    IF (SELECT COUNT(*) FROM gebruikers) = 0 THEN
        INSERT INTO gebruikers (id, email, naam, rol, telefoon, actief, created_at, updated_at)
        VALUES 
        ('00000000-0000-0000-0000-000000000001', 'ADMIN', 'Filip Van Hoeck', 'admin', '+32 123 456 789', true, NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000002', 'COO01', 'Sarah De Vries', 'coo', '+32 123 456 790', true, NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000003', 'DM001', 'Tom Janssen', 'district_manager', '+32 123 456 791', true, NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000004', 'DM002', 'Lisa Peeters', 'district_manager', '+32 123 456 792', true, NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000005', 'DM003', 'Marc Van Der Berg', 'district_manager', '+32 123 456 793', true, NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000006', 'FM001', 'Anna De Smet', 'filiaal_manager', '+32 123 456 794', true, NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000007', 'INSP1', 'Inspector User', 'inspector', '+32 123 456 795', true, NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000008', 'STORE', 'Store Manager', 'storemanager', '+32 123 456 796', true, NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000009', 'DEV01', 'Developer User', 'developer', '+32 123 456 797', true, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email, naam = EXCLUDED.naam, rol = EXCLUDED.rol, 
        telefoon = EXCLUDED.telefoon, actief = EXCLUDED.actief, updated_at = NOW();
        
        RAISE NOTICE 'Seed users inserted successfully.';
    ELSE
        RAISE NOTICE 'Users already exist, skipping insertion.';
    END IF;
END $$;

-- Insert seed filialen (guarded for idempotency)
DO $$ BEGIN
    IF (SELECT COUNT(*) FROM filialen) = 0 THEN
        INSERT INTO filialen (id, naam, locatie, district_manager_id, adres, telefoon, email, status, created_at, updated_at)
        VALUES 
        ('11111111-1111-1111-1111-111111111111', 'Gent - KM11', 'Gent', '00000000-0000-0000-0000-000000000003', 'Korenmarkt 11, 9000 Gent', '+32 9 245 75 85', 'km11@poulepoulette.com', 'actief', NOW(), NOW()),
        ('22222222-2222-2222-2222-222222222222', 'Etterbeek - PJ70', 'Etterbeek', '00000000-0000-0000-0000-000000000003', 'Place Jourdan 70, 1040 Etterbeek', '+32 2 759 42 97', 'pj70@poulepoulette.com', 'actief', NOW(), NOW()),
        ('33333333-3333-3333-3333-333333333333', 'Mechelen - IL36', 'Mechelen', '00000000-0000-0000-0000-000000000004', 'Ijzerenleen 36, 2800 Mechelen', '+32 15 528 35 1', 'il36@poulepoulette.com', 'actief', NOW(), NOW()),
        ('44444444-4444-4444-4444-444444444444', 'Leuven - TS15', 'Leuven', '00000000-0000-0000-0000-000000000004', 'Tiensestraat 15, 3000 Leuven', '+32 16 792 15 2', 'ts15@poulepoulette.com', 'actief', NOW(), NOW()),
        ('55555555-5555-5555-5555-555555555555', 'Antwerpen - GK2', 'Antwerpen', '00000000-0000-0000-0000-000000000005', 'Godfrieduskaai 2, 2000 Antwerpen', '+32 3 828 38 22', 'gk2@poulepoulette.com', 'actief', NOW(), NOW()),
        ('66666666-6666-6666-6666-666666666666', 'Oostende - IL34', 'Oostende', '00000000-0000-0000-0000-000000000005', 'Leopold II Laan 34, 8400 Oostende', '+32 59 709 25 55', 'il34@poulepoulette.com', 'actief', NOW(), NOW()),
        ('77777777-7777-7777-7777-777777777777', 'Brussel - TL24', 'Brussel', '00000000-0000-0000-0000-000000000003', 'Tervurenlaan 24a, 1040 Brussel', '+32 2 895 57 00', 'tl24@poulepoulette.com', 'actief', NOW(), NOW()),
        ('88888888-8888-8888-8888-888888888888', 'Brussel - SC2', 'Brussel', '00000000-0000-0000-0000-000000000004', 'Place Saint-Catherine 2, 1000 Brussel', '+32 2 895 57 01', 'sc2@poulepoulette.com', 'actief', NOW(), NOW()),
        ('99999999-9999-9999-9999-999999999999', 'Brugge - SS3', 'Brugge', '00000000-0000-0000-0000-000000000005', 'Simon Stevinplein 3, 8000 Brugge', '+32 50 893 70 00', 'ss3@poulepoulette.com', 'actief', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
        naam = EXCLUDED.naam, locatie = EXCLUDED.locatie, district_manager_id = EXCLUDED.district_manager_id, 
        adres = EXCLUDED.adres, telefoon = EXCLUDED.telefoon, email = EXCLUDED.email, 
        status = EXCLUDED.status, updated_at = NOW();
        
        RAISE NOTICE 'Seed filialen inserted successfully.';
    ELSE
        RAISE NOTICE 'Filialen already exist, skipping insertion.';
    END IF;
END $$;

-- ===== VERIFICATION QUERIES =====
-- Uncomment these to verify the setup

/*
-- Verify table counts
SELECT 
    'gebruikers' as table_name, COUNT(*) as count FROM gebruikers
UNION ALL
SELECT 
    'filialen' as table_name, COUNT(*) as count FROM filialen
UNION ALL
SELECT 
    'audit_checklist_items' as table_name, COUNT(*) as count FROM audit_checklist_items
UNION ALL
SELECT 
    'audits' as table_name, COUNT(*) as count FROM audits
UNION ALL
SELECT 
    'audit_resultaten' as table_name, COUNT(*) as count FROM audit_resultaten
UNION ALL
SELECT 
    'acties' as table_name, COUNT(*) as count FROM acties
UNION ALL
SELECT 
    'rapporten' as table_name, COUNT(*) as count FROM rapporten
UNION ALL
SELECT 
    'notificaties' as table_name, COUNT(*) as count FROM notificaties;

-- Verify functions exist
SELECT 
    routine_name, 
    routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'calculate_audit_score', 
    'create_actions_from_audit_results',
    'determine_action_urgency',
    'update_audit_scores',
    'send_action_completion_notifications',
    'send_action_verification_notifications'
);

-- Verify storage bucket
SELECT * FROM storage.buckets WHERE id = 'audit-photos';
*/

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- The database is now ready for the Poule & Poulette audit application.
-- All tables, functions, triggers, RLS policies, and seed data have been created.
-- 
-- Next steps:
-- 1. Verify the setup by uncommenting and running the verification queries above
-- 2. Test authentication with the seed users (ADMIN, DM001, etc.)
-- 3. Deploy your Cloudflare Pages application
-- 4. Test file uploads to the audit-photos storage bucket
-- =====================================================
