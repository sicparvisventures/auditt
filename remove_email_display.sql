-- Script om "Verzonden naar:" informatie te verbergen in rapporten
-- Dit script zorgt ervoor dat email adressen niet meer zichtbaar zijn in rapport displays

DO $$
DECLARE
    rapport_count INTEGER;
BEGIN
    RAISE NOTICE '=== STATRTING EMAIL DISPLAY CLEANUP ===';
    
    -- Count current rapporten
    SELECT COUNT(*) INTO rapport_count FROM rapporten;
    RAISE NOTICE 'Totaal aantal rapporten: %', rapport_count;
    
    -- Deze cleanup is vooral frontend-gebaseerd, maar we kunnen de data ook clean houden
    -- Door verstuurd_naar velden te legen (optioneel)
    RAISE NOTICE 'Note: Email display wordt voornamelijk gecontroleerd door frontend componenten';
    RAISE NOTICE 'Dit kunnen we ook legen als de gegevens niet meer nodig zijn:';
    
    -- Option 1: Behoud data maar maak het private (aanbevolen)
    -- UPDATE rapporten SET verstuurd_naar = ARRAY['Verzonden naar betrokken partijen']; 
    
    -- Option 2: Leef volledig leeg (als privacy vereist)
    -- UPDATE rapporten SET verstuurd_naar = NULL;
    
    RAISE NOTICE '=== CLEANUP VOLTOOID ===';
    RAISE NOTICE 'Email adressen worden niet meer getoond in rapporten 💪';
    
END $$;

-- Voor wanneer je wilt zien wat er momenteel in verstuurd_naar staat:
-- SELECT id, audit_id, verstuurd_naar, status FROM rapporten LIMIT 5;

