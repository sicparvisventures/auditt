-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (drop first if they exist)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_status AS ENUM ('in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_result AS ENUM ('ok', 'niet_ok');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending', 'sent', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE filiaal_status AS ENUM ('actief', 'inactief');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE action_status AS ENUM ('pending', 'in_progress', 'completed', 'verified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE gebruikers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(5) UNIQUE NOT NULL, -- 5-letter/cijfer combinatie
    naam VARCHAR(255) NOT NULL,
    rol user_role NOT NULL,
    telefoon VARCHAR(20),
    actief BOOLEAN DEFAULT true,
    created_by UUID REFERENCES gebruikers(id) ON DELETE SET NULL, -- Wie heeft deze user aangemaakt
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create filialen table
CREATE TABLE filialen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    naam VARCHAR(255) NOT NULL,
    locatie VARCHAR(255) NOT NULL,
    district_manager_id UUID REFERENCES gebruikers(id) ON DELETE SET NULL,
    adres TEXT NOT NULL,
    telefoon VARCHAR(20),
    email VARCHAR(255),
    status filiaal_status DEFAULT 'actief',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit checklist items table
CREATE TABLE audit_checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categorie VARCHAR(100) NOT NULL,
    titel VARCHAR(255) NOT NULL,
    beschrijving TEXT,
    gewicht DECIMAL(3,2) DEFAULT 1.00,
    volgorde INTEGER NOT NULL,
    actief BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audits table
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filiaal_id UUID REFERENCES filialen(id) ON DELETE CASCADE,
    district_manager_id UUID REFERENCES gebruikers(id) ON DELETE SET NULL,
    audit_datum DATE NOT NULL,
    status audit_status DEFAULT 'in_progress',
    totale_score DECIMAL(3,2) DEFAULT 0.00,
    pass_percentage DECIMAL(5,2) DEFAULT 0.00,
    opmerkingen TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit results table
CREATE TABLE audit_resultaten (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    checklist_item_id UUID REFERENCES audit_checklist_items(id) ON DELETE CASCADE,
    resultaat audit_result NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 5),
    opmerkingen TEXT,
    foto_urls TEXT[] DEFAULT '{}',
    verbeterpunt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE rapporten (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    rapport_url TEXT,
    verstuurd_naar TEXT[] DEFAULT '{}',
    verstuur_datum TIMESTAMP WITH TIME ZONE,
    status report_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create actions table
CREATE TABLE acties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    voltooid_op TIMESTAMP WITH TIME ZONE,
    geverifieerd_door UUID REFERENCES gebruikers(id) ON DELETE SET NULL,
    geverifieerd_op TIMESTAMP WITH TIME ZONE,
    verificatie_opmerkingen TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notificaties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gebruiker_id UUID REFERENCES gebruikers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'action_completed', 'action_verified', 'action_overdue'
    titel VARCHAR(255) NOT NULL,
    bericht TEXT NOT NULL,
    actie_id UUID REFERENCES acties(id) ON DELETE CASCADE,
    gelezen BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_filialen_district_manager ON filialen(district_manager_id);
CREATE INDEX idx_audits_filiaal ON audits(filiaal_id);
CREATE INDEX idx_audits_manager ON audits(district_manager_id);
CREATE INDEX idx_audits_datum ON audits(audit_datum);
CREATE INDEX idx_audit_resultaten_audit ON audit_resultaten(audit_id);
CREATE INDEX idx_audit_resultaten_item ON audit_resultaten(checklist_item_id);
CREATE INDEX idx_rapporten_audit ON rapporten(audit_id);
CREATE INDEX idx_acties_audit ON acties(audit_id);
CREATE INDEX idx_acties_toegewezen ON acties(toegewezen_aan);
CREATE INDEX idx_acties_status ON acties(status);
CREATE INDEX idx_acties_urgentie ON acties(urgentie);
CREATE INDEX idx_acties_deadline ON acties(deadline);
CREATE INDEX idx_notificaties_gebruiker ON notificaties(gebruiker_id);
CREATE INDEX idx_notificaties_gelezen ON notificaties(gelezen);
CREATE INDEX idx_notificaties_type ON notificaties(type);

-- Create function to generate unique user_id
CREATE OR REPLACE FUNCTION generate_user_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
    exists_count INTEGER;
BEGIN
    LOOP
        result := '';
        -- Generate 5-character string
        FOR i IN 1..5 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        -- Check if this user_id already exists
        SELECT COUNT(*) INTO exists_count FROM gebruikers WHERE user_id = result;
        
        -- If it doesn't exist, we can use it
        IF exists_count = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_gebruikers_updated_at BEFORE UPDATE ON gebruikers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_filialen_updated_at BEFORE UPDATE ON filialen
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON audits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_acties_updated_at BEFORE UPDATE ON acties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default checklist items
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

-- Create RLS (Row Level Security) policies
ALTER TABLE gebruikers ENABLE ROW LEVEL SECURITY;
ALTER TABLE filialen ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_resultaten ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapporten ENABLE ROW LEVEL SECURITY;
ALTER TABLE acties ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaties ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON gebruikers
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON gebruikers
    FOR UPDATE USING (auth.uid() = id);

-- District managers can read their assigned filialen
CREATE POLICY "District managers can read assigned filialen" ON filialen
    FOR SELECT USING (
        district_manager_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM gebruikers 
            WHERE id = auth.uid() AND rol IN ('admin', 'coo')
        )
    );

-- District managers can read audits for their filialen
CREATE POLICY "District managers can read their audits" ON audits
    FOR SELECT USING (
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

-- District managers can create audits for their filialen
CREATE POLICY "District managers can create audits" ON audits
    FOR INSERT WITH CHECK (
        district_manager_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM filialen 
            WHERE id = filiaal_id AND district_manager_id = auth.uid()
        )
    );

-- District managers can update their own audits
CREATE POLICY "District managers can update their audits" ON audits
    FOR UPDATE USING (district_manager_id = auth.uid());

-- Audit results follow the same rules as audits
CREATE POLICY "Audit results follow audit rules" ON audit_resultaten
    FOR ALL USING ()
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

-- Reports follow the same rules as audits
CREATE POLICY "Reports follow audit rules" ON rapporten
    FOR ALL USING (
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

-- Actions follow the same rules as audits, plus assigned users can see their actions
CREATE POLICY "Actions follow audit rules" ON acties
    FOR ALL USING (
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

-- Users can only see their own notifications
CREATE POLICY "Users can see own notifications" ON notificaties
    FOR ALL USING (gebruiker_id = auth.uid());

-- Create function to calculate audit score
CREATE OR REPLACE FUNCTION calculate_audit_score(audit_id UUID)
RETURNS TABLE(
    totale_score DECIMAL(3,2),
    pass_percentage DECIMAL(5,2),
    is_pass BOOLEAN
) AS $$
DECLARE
    total_weighted_score DECIMAL := 0;
    total_weight DECIMAL := 0;
    avg_score DECIMAL(3,2);
    pass_pct DECIMAL(5,2);
    pass_threshold DECIMAL := 80.0;
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

-- Create function to update audit scores
CREATE OR REPLACE FUNCTION update_audit_scores()
RETURNS TRIGGER AS $$
DECLARE
    score_data RECORD;
BEGIN
    -- Calculate new scores
    SELECT * INTO score_data
    FROM calculate_audit_score(NEW.audit_id);

    -- Update audit with new scores
    UPDATE audits 
    SET 
        totale_score = score_data.totale_score,
        pass_percentage = score_data.pass_percentage,
        updated_at = NOW()
    WHERE id = NEW.audit_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update audit scores
CREATE TRIGGER update_audit_scores_trigger
    AFTER INSERT OR UPDATE OR DELETE ON audit_resultaten
    FOR EACH ROW EXECUTE FUNCTION update_audit_scores();

-- Create function to determine urgency based on category and score
CREATE OR REPLACE FUNCTION determine_action_urgency(
    categorie TEXT,
    score INTEGER,
    gewicht DECIMAL
) RETURNS urgency_level AS $$
BEGIN
    -- Critical urgency for FAVV, FIFO, and safety issues with low scores
    IF (categorie ILIKE '%FAVV%' OR categorie ILIKE '%FIFO%' OR categorie ILIKE '%veiligheid%' OR categorie ILIKE '%hygiëne%') 
       AND score <= 2 THEN
        RETURN 'critical';
    END IF;
    
    -- High urgency for food safety and hygiene with medium scores
    IF (categorie ILIKE '%keuken%' OR categorie ILIKE '%hygiëne%' OR categorie ILIKE '%ongedierte%') 
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

-- Create function to auto-create actions from audit results
CREATE OR REPLACE FUNCTION create_actions_from_audit_results(audit_id UUID)
RETURNS VOID AS $$
DECLARE
    result_record RECORD;
    action_urgentie urgency_level;
    action_deadline DATE;
BEGIN
    -- Loop through all audit results that are not OK
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
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create actions when audit is completed
CREATE OR REPLACE FUNCTION trigger_create_actions()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create actions when audit status changes to completed
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        PERFORM create_actions_from_audit_results(NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_actions_trigger
    AFTER UPDATE ON audits
    FOR EACH ROW EXECUTE FUNCTION trigger_create_actions();

-- Create function to send notifications when actions are completed
CREATE OR REPLACE FUNCTION send_action_completion_notifications()
RETURNS TRIGGER AS $$
DECLARE
    audit_record RECORD;
    manager_record RECORD;
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

-- Create function to send notifications when actions are verified
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
