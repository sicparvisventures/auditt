-- =====================================================
-- COMPLETE BACKEND UPGRADE SCRIPT
-- =====================================================
-- Run dit script in Supabase SQL Editor om alle upgrades toe te passen
-- =====================================================

-- STAP 1: Storage Bucket Setup
\i storage-setup.sql

-- STAP 2: Email Functies Upgrade
\i email-functions-upgrade.sql

-- STAP 3: Triggers Upgrade
\i triggers-upgrade.sql

-- STAP 4: Verificatie
DO $$
DECLARE
    bucket_exists BOOLEAN;
    function_exists BOOLEAN;
    trigger_exists BOOLEAN;
BEGIN
    -- Verifieer storage bucket
    SELECT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'audit-photos'
    ) INTO bucket_exists;
    
    -- Verifieer email functie
    SELECT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'send_audit_report_to_relevant_emails'
    ) INTO function_exists;
    
    -- Verifieer trigger
    SELECT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'auto_create_audit_report_trigger'
    ) INTO trigger_exists;
    
    -- Report status
    RAISE NOTICE '========================================';
    RAISE NOTICE 'UPGRADE VERIFICATIE:';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Storage Bucket: %', CASE WHEN bucket_exists THEN '✅ OK' ELSE '❌ MISSING' END;
    RAISE NOTICE 'Email Functie: %', CASE WHEN function_exists THEN '✅ OK' ELSE '❌ MISSING' END;
    RAISE NOTICE 'Auto Report Trigger: %', CASE WHEN trigger_exists THEN '✅ OK' ELSE '❌ MISSING' END;
    RAISE NOTICE '========================================';
    
    IF NOT bucket_exists THEN
        RAISE EXCEPTION 'Storage bucket niet gevonden! Run storage-setup.sql eerst.';
    END IF;
    
    IF NOT function_exists THEN
        RAISE EXCEPTION 'Email functie niet gevonden! Run email-functions-upgrade.sql eerst.';
    END IF;
END $$;

-- STAP 5: Test queries
SELECT '✅ Upgrade voltooid!' as status;

