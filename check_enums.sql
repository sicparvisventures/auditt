-- Check what enum values exist for user_role
SELECT enumlabel as enum_value 
FROM pg_enum 
WHERE enumtypid = (
    SELECT oid 
    FROM pg_type 
    WHERE typname = 'user_role'
)
ORDER BY enumsortorder;

-- Also check all enum types
SELECT t.typname as enum_name, e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typtype = 'e'
ORDER BY t.typname, e.enumsortorder;

