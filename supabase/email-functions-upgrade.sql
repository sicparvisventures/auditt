-- =====================================================
-- EMAIL FUNCTIES UPGRADE
-- =====================================================
-- Verbeterde email functies met PDF support
-- =====================================================

-- Functie om PDF URL te genereren voor een audit
CREATE OR REPLACE FUNCTION get_audit_pdf_url(audit_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  pdf_url TEXT;
  filiaal_naam TEXT;
  audit_datum DATE;
BEGIN
  -- Haal audit informatie op
  SELECT 
    f.naam,
    a.audit_datum
  INTO filiaal_naam, audit_datum
  FROM audits a
  JOIN filialen f ON a.filiaal_id = f.id
  WHERE a.id = audit_id_param;
  
  IF filiaal_naam IS NULL THEN
    RAISE EXCEPTION 'Audit niet gevonden: %', audit_id_param;
  END IF;
  
  -- Genereer PDF URL (wordt gegenereerd door frontend/edge function)
  -- Format: https://kauerobifkgjvddyrkuz.supabase.co/storage/v1/object/public/audit-photos/reports/{audit_id}.pdf
  pdf_url := format(
    'https://kauerobifkgjvddyrkuz.supabase.co/storage/v1/object/public/audit-photos/reports/%s.pdf',
    audit_id_param
  );
  
  RETURN pdf_url;
END;
$$ LANGUAGE plpgsql;

-- Upgrade: Verbeterde email verzend functie met PDF URL
CREATE OR REPLACE FUNCTION send_audit_report_to_relevant_emails(audit_id_param UUID)
RETURNS TABLE(
    audit_id UUID,
    filiaal_naam VARCHAR,
    filiaal_email VARCHAR,
    management_email VARCHAR,
    all_recipients TEXT[],
    rapport_id UUID,
    pdf_url TEXT,
    email_sent BOOLEAN
) AS $$
DECLARE
    filiaal_record RECORD;
    management_email VARCHAR;
    all_email_recipients TEXT[];
    new_rapport_id UUID;
    pdf_url TEXT;
    email_sent BOOLEAN := false;
BEGIN
    -- Haal filiaal informatie op voor deze audit
    SELECT 
        f.id as filiaal_id,
        f.naam as filiaal_naam,
        f.email as filiaal_email,
        f.locatie as filiaal_locatie
    INTO filiaal_record
    FROM audits a
    JOIN filialen f ON a.filiaal_id = f.id
    WHERE a.id = audit_id_param;
    
    -- Als geen filiaal gevonden, stop
    IF filiaal_record IS NULL THEN
        RAISE EXCEPTION 'Geen filiaal gevonden voor audit ID: %', audit_id_param;
    END IF;
    
    -- Bepaal het juiste management email adres op basis van het filiaal
    management_email := CASE 
        WHEN filiaal_record.filiaal_email = 'km11@poulepoulette.com' THEN 'CVH@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'pj70@poulepoulette.com' THEN 'MP@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'il36@poulepoulette.com' THEN 'JDM@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'ts15@poulepoulette.com' THEN 'DI@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'gk2@poulepoulette.com' THEN 'JC@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'll34@poulepoulette.com' THEN 'MB@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'tl24@poulepoulette.com' THEN 'JR@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'sc2@poulepoulette.com' THEN 'MF@POULEPOULETTE.COM'
        WHEN filiaal_record.filiaal_email = 'ss3@poulepoulette.com' THEN 'SM@POULEPOULETTE.COM'
        ELSE NULL
    END;
    
    -- Combineer filiaal email met het specifieke management email
    IF management_email IS NOT NULL THEN
        all_email_recipients := ARRAY[filiaal_record.filiaal_email, management_email];
    ELSE
        all_email_recipients := ARRAY[filiaal_record.filiaal_email];
    END IF;
    
    -- Genereer PDF URL
    pdf_url := get_audit_pdf_url(audit_id_param);
    
    -- Maak een nieuw rapport record aan
    INSERT INTO rapporten (audit_id, rapport_url, verstuurd_naar, verstuur_datum, status)
    VALUES (
        audit_id_param,
        pdf_url,
        all_email_recipients,
        NOW(),
        'sent'
    )
    RETURNING id INTO new_rapport_id;
    
    -- Note: Email wordt daadwerkelijk verstuurd via Edge Function of externe service
    -- Deze functie bereidt alleen de data voor
    email_sent := true;
    
    -- Return de resultaten
    RETURN QUERY SELECT 
        audit_id_param,
        filiaal_record.filiaal_naam,
        filiaal_record.filiaal_email,
        management_email,
        all_email_recipients,
        new_rapport_id,
        pdf_url,
        email_sent;
END;
$$ LANGUAGE plpgsql;

-- Functie om email verzending te loggen
CREATE OR REPLACE FUNCTION log_email_sent(
    audit_id_param UUID,
    recipients TEXT[],
    pdf_url TEXT,
    success BOOLEAN,
    error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    -- Update rapport status
    UPDATE rapporten
    SET 
        status = CASE WHEN success THEN 'sent' ELSE 'failed' END,
        updated_at = NOW()
    WHERE audit_id = audit_id_param;
    
    -- Log kan worden uitgebreid met een email_logs tabel indien gewenst
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Functie om rapport status te verifiëren
CREATE OR REPLACE FUNCTION verify_audit_report_status(audit_id_param UUID)
RETURNS TABLE(
    audit_id UUID,
    rapport_id UUID,
    status report_status,
    pdf_url TEXT,
    verstuurd_naar TEXT[],
    verstuur_datum TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.audit_id,
        r.id as rapport_id,
        r.status,
        r.rapport_url as pdf_url,
        r.verstuurd_naar,
        r.verstuur_datum
    FROM rapporten r
    WHERE r.audit_id = audit_id_param
    ORDER BY r.verstuur_datum DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

