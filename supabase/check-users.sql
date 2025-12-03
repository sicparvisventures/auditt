-- Check alle gebruikers en hun user_id's
-- Run dit in je Supabase SQL Editor

SELECT 
    id,
    user_id,
    naam,
    rol,
    telefoon,
    actief,
    created_at
FROM gebruikers
ORDER BY created_at;

-- Check of er gebruikers zijn zonder user_id
SELECT 
    COUNT(*) as users_without_user_id
FROM gebruikers 
WHERE user_id IS NULL OR user_id = '';

-- Check alle user_id's
SELECT DISTINCT user_id FROM gebruikers WHERE user_id IS NOT NULL;
