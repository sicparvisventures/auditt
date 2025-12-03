-- ==============================================
-- LANGUAGE SUPPORT IMPLEMENTATION SCRIPT
-- ==============================================
-- Dit script voegt multi-language support toe aan de AuditFlow applicatie
-- Voer dit script uit in de Supabase SQL Editor

-- ==============================================
-- STAP 1: CREATE LANGUAGES TABLE
-- ==============================================

-- Tabel voor ondersteunde talen
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(5) NOT NULL UNIQUE, -- 'nl', 'en', etc.
  name VARCHAR(100) NOT NULL, -- 'Nederlands', 'English'
  flag VARCHAR(10) NOT NULL, -- '🇳🇱', '🇺🇸'
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- STAP 2: CREATE TRANSLATIONS TABLE
-- ==============================================

-- Tabel voor vertalingen
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
  key VARCHAR(255) NOT NULL, -- 'landing.hero.title', 'nav.dashboard', etc.
  value TEXT NOT NULL, -- De vertaalde tekst
  context VARCHAR(100), -- 'landing', 'nav', 'common', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(language_code, key)
);

-- ==============================================
-- STAP 3: CREATE USER PREFERENCES TABLE
-- ==============================================

-- Tabel voor gebruikersvoorkeuren (taal)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ==============================================
-- STAP 4: INSERT DEFAULT LANGUAGES
-- ==============================================

-- Voeg standaard talen toe
INSERT INTO languages (code, name, flag, is_active, is_default) VALUES
  ('nl', 'NL', 'NL', true, true),
  ('en', 'EN', 'EN', true, false),
  ('fr', 'FR', 'FR', true, false)
ON CONFLICT (code) DO NOTHING;

-- ==============================================
-- STAP 5: INSERT DUTCH TRANSLATIONS
-- ==============================================

-- Nederlandse vertalingen
INSERT INTO translations (language_code, key, value, context) VALUES
  -- Navigation
  ('nl', 'nav.dashboard', 'Dashboard', 'nav'),
  ('nl', 'nav.audits', 'Audits', 'nav'),
  ('nl', 'nav.actions', 'Acties', 'nav'),
  ('nl', 'nav.reports', 'Rapporten', 'nav'),
  ('nl', 'nav.settings', 'Instellingen', 'nav'),
  ('nl', 'nav.logout', 'Uitloggen', 'nav'),
  
  -- Landing Page
  ('nl', 'landing.hero.title', 'Maak je eigen', 'landing'),
  ('nl', 'landing.hero.subtitle', 'Audit Platform', 'landing'),
  ('nl', 'landing.hero.description', 'Transformeer je audit processen met een volledig aanpasbaar platform. Van kleine restaurants tot grote retail ketens - AuditFlow schaalt met je mee.', 'landing'),
  ('nl', 'landing.hero.cta.primary', 'Start gratis trial', 'landing'),
  ('nl', 'landing.hero.cta.secondary', 'Bekijk demo', 'landing'),
  ('nl', 'landing.hero.disclaimer', 'Geen creditcard vereist • 14 dagen gratis trial • Setup in 5 minuten', 'landing'),
  
  -- Features
  ('nl', 'landing.features.title', 'Alles wat je nodig hebt voor perfecte audits', 'landing'),
  ('nl', 'landing.features.subtitle', 'Van checklist beheer tot rapportage - ons platform heeft alle tools die je nodig hebt.', 'landing'),
  ('nl', 'landing.features.liveInsights.title', 'Live Insights', 'landing'),
  ('nl', 'landing.features.liveInsights.description', 'Real-time dashboards die je audit prestaties live volgen. Zie direct waar je staat en waar je naartoe gaat.', 'landing'),
  ('nl', 'landing.features.mobileFirst.title', 'Mobiel Eerst', 'landing'),
  ('nl', 'landing.features.mobileFirst.description', 'Audits uitvoeren waar je ook bent. Onze app werkt perfect op elke locatie, zelfs offline.', 'landing'),
  ('nl', 'landing.features.security.title', 'Fort Knox Security', 'landing'),
  ('nl', 'landing.features.security.description', 'Je data is veiliger dan een bankkluis. Enterprise encryptie + GDPR = gemoedsrust.', 'landing'),
  ('nl', 'landing.features.quickSetup.title', '5-Minuten Magic', 'landing'),
  ('nl', 'landing.features.quickSetup.description', 'Van idee tot werkend platform in 5 minuten. Geen IT-afdeling nodig, gewoon doen.', 'landing'),
  ('nl', 'landing.features.teamPower.title', 'Team Power', 'landing'),
  ('nl', 'landing.features.teamPower.description', 'Samen sterker. Deel taken, volg progressie en werk als één geolied team.', 'landing'),
  ('nl', 'landing.features.globalReach.title', 'Global Reach', 'landing'),
  ('nl', 'landing.features.globalReach.description', 'Beheer 1 locatie of 1000. Alles vanuit één dashboard, overal ter wereld.', 'landing'),
  
  -- Pricing
  ('nl', 'landing.pricing.title', 'Kies het plan dat bij je past', 'landing'),
  ('nl', 'landing.pricing.subtitle', 'Start gratis en upgrade wanneer je groeit', 'landing'),
  ('nl', 'landing.pricing.monthly', 'Maandelijks', 'landing'),
  ('nl', 'landing.pricing.yearly', 'Jaarlijks', 'landing'),
  ('nl', 'landing.pricing.save', 'Bespaar 20%', 'landing'),
  ('nl', 'landing.pricing.popular', 'Meest populair', 'landing'),
  
  -- Login
  ('nl', 'login.title', 'Inloggen', 'login'),
  ('nl', 'login.email', 'E-mailadres', 'login'),
  ('nl', 'login.password', 'Wachtwoord', 'login'),
  ('nl', 'login.submit', 'Inloggen', 'login'),
  ('nl', 'login.forgot', 'Wachtwoord vergeten?', 'login'),
  ('nl', 'login.noAccount', 'Geen account?', 'login'),
  ('nl', 'login.signup', 'Registreren', 'login'),
  
  -- Dashboard
  ('nl', 'dashboard.welcome', 'Welkom terug', 'dashboard'),
  ('nl', 'dashboard.overview', 'Overzicht', 'dashboard'),
  ('nl', 'dashboard.recentAudits', 'Recente Audits', 'dashboard'),
  ('nl', 'dashboard.pendingActions', 'Openstaande Acties', 'dashboard'),
  ('nl', 'dashboard.quickStats', 'Snelle Statistieken', 'dashboard'),
  
  -- Common
  ('nl', 'common.loading', 'Laden...', 'common'),
  ('nl', 'common.error', 'Er is een fout opgetreden', 'common'),
  ('nl', 'common.save', 'Opslaan', 'common'),
  ('nl', 'common.cancel', 'Annuleren', 'common'),
  ('nl', 'common.delete', 'Verwijderen', 'common'),
  ('nl', 'common.edit', 'Bewerken', 'common'),
  ('nl', 'common.add', 'Toevoegen', 'common'),
  ('nl', 'common.search', 'Zoeken', 'common'),
  ('nl', 'common.filter', 'Filteren', 'common'),
  ('nl', 'common.sort', 'Sorteren', 'common'),
  ('nl', 'common.export', 'Exporteren', 'common'),
  ('nl', 'common.import', 'Importeren', 'common'),
  ('nl', 'common.back', 'Terug', 'common'),
  ('nl', 'common.next', 'Volgende', 'common'),
  ('nl', 'common.previous', 'Vorige', 'common'),
  ('nl', 'common.close', 'Sluiten', 'common'),
  ('nl', 'common.confirm', 'Bevestigen', 'common'),
  ('nl', 'common.yes', 'Ja', 'common'),
  ('nl', 'common.no', 'Nee', 'common'),
  ('nl', 'common.ok', 'OK', 'common')
ON CONFLICT (language_code, key) DO NOTHING;

-- ==============================================
-- STAP 6: INSERT ENGLISH TRANSLATIONS
-- ==============================================

-- Engelse vertalingen
INSERT INTO translations (language_code, key, value, context) VALUES
  -- Navigation
  ('en', 'nav.dashboard', 'Dashboard', 'nav'),
  ('en', 'nav.audits', 'Audits', 'nav'),
  ('en', 'nav.actions', 'Actions', 'nav'),
  ('en', 'nav.reports', 'Reports', 'nav'),
  ('en', 'nav.settings', 'Settings', 'nav'),
  ('en', 'nav.logout', 'Logout', 'nav'),
  
  -- Landing Page
  ('en', 'landing.hero.title', 'Create your own', 'landing'),
  ('en', 'landing.hero.subtitle', 'Audit Platform', 'landing'),
  ('en', 'landing.hero.description', 'Transform your audit processes with a fully customizable platform. From small restaurants to large retail chains - AuditFlow scales with you.', 'landing'),
  ('en', 'landing.hero.cta.primary', 'Start free trial', 'landing'),
  ('en', 'landing.hero.cta.secondary', 'View demo', 'landing'),
  ('en', 'landing.hero.disclaimer', 'No credit card required • 14 days free trial • Setup in 5 minutes', 'landing'),
  
  -- Features
  ('en', 'landing.features.title', 'Everything you need for perfect audits', 'landing'),
  ('en', 'landing.features.subtitle', 'From checklist management to reporting - our platform has all the tools you need.', 'landing'),
  ('en', 'landing.features.liveInsights.title', 'Live Insights', 'landing'),
  ('en', 'landing.features.liveInsights.description', 'Real-time dashboards that track your audit performance live. See exactly where you stand and where you''re going.', 'landing'),
  ('en', 'landing.features.mobileFirst.title', 'Mobile First', 'landing'),
  ('en', 'landing.features.mobileFirst.description', 'Conduct audits wherever you are. Our app works perfectly at any location, even offline.', 'landing'),
  ('en', 'landing.features.security.title', 'Fort Knox Security', 'landing'),
  ('en', 'landing.features.security.description', 'Your data is safer than a bank vault. Enterprise encryption + GDPR = peace of mind.', 'landing'),
  ('en', 'landing.features.quickSetup.title', '5-Minute Magic', 'landing'),
  ('en', 'landing.features.quickSetup.description', 'From idea to working platform in 5 minutes. No IT department needed, just do it.', 'landing'),
  ('en', 'landing.features.teamPower.title', 'Team Power', 'landing'),
  ('en', 'landing.features.teamPower.description', 'Stronger together. Share tasks, track progress and work as one well-oiled team.', 'landing'),
  ('en', 'landing.features.globalReach.title', 'Global Reach', 'landing'),
  ('en', 'landing.features.globalReach.description', 'Manage 1 location or 1000. Everything from one dashboard, anywhere in the world.', 'landing'),
  
  -- Pricing
  ('en', 'landing.pricing.title', 'Choose the plan that fits you', 'landing'),
  ('en', 'landing.pricing.subtitle', 'Start free and upgrade when you grow', 'landing'),
  ('en', 'landing.pricing.monthly', 'Monthly', 'landing'),
  ('en', 'landing.pricing.yearly', 'Yearly', 'landing'),
  ('en', 'landing.pricing.save', 'Save 20%', 'landing'),
  ('en', 'landing.pricing.popular', 'Most popular', 'landing'),
  
  -- Login
  ('en', 'login.title', 'Login', 'login'),
  ('en', 'login.email', 'Email address', 'login'),
  ('en', 'login.password', 'Password', 'login'),
  ('en', 'login.submit', 'Login', 'login'),
  ('en', 'login.forgot', 'Forgot password?', 'login'),
  ('en', 'login.noAccount', 'No account?', 'login'),
  ('en', 'login.signup', 'Sign up', 'login'),
  
  -- Dashboard
  ('en', 'dashboard.welcome', 'Welcome back', 'dashboard'),
  ('en', 'dashboard.overview', 'Overview', 'dashboard'),
  ('en', 'dashboard.recentAudits', 'Recent Audits', 'dashboard'),
  ('en', 'dashboard.pendingActions', 'Pending Actions', 'dashboard'),
  ('en', 'dashboard.quickStats', 'Quick Stats', 'dashboard'),
  
  -- Common
  ('en', 'common.loading', 'Loading...', 'common'),
  ('en', 'common.error', 'An error occurred', 'common'),
  ('en', 'common.save', 'Save', 'common'),
  ('en', 'common.cancel', 'Cancel', 'common'),
  ('en', 'common.delete', 'Delete', 'common'),
  ('en', 'common.edit', 'Edit', 'common'),
  ('en', 'common.add', 'Add', 'common'),
  ('en', 'common.search', 'Search', 'common'),
  ('en', 'common.filter', 'Filter', 'common'),
  ('en', 'common.sort', 'Sort', 'common'),
  ('en', 'common.export', 'Export', 'common'),
  ('en', 'common.import', 'Import', 'common'),
  ('en', 'common.back', 'Back', 'common'),
  ('en', 'common.next', 'Next', 'common'),
  ('en', 'common.previous', 'Previous', 'common'),
  ('en', 'common.close', 'Close', 'common'),
  ('en', 'common.confirm', 'Confirm', 'common'),
  ('en', 'common.yes', 'Yes', 'common'),
  ('en', 'common.no', 'No', 'common'),
  ('en', 'common.ok', 'OK', 'common')
ON CONFLICT (language_code, key) DO NOTHING;

-- ==============================================
-- STAP 6.5: INSERT FRENCH TRANSLATIONS
-- ==============================================

-- Franse vertalingen
INSERT INTO translations (language_code, key, value, context) VALUES
  -- Navigation
  ('fr', 'nav.dashboard', 'Tableau de bord', 'nav'),
  ('fr', 'nav.audits', 'Audits', 'nav'),
  ('fr', 'nav.actions', 'Actions', 'nav'),
  ('fr', 'nav.reports', 'Rapports', 'nav'),
  ('fr', 'nav.settings', 'Paramètres', 'nav'),
  ('fr', 'nav.logout', 'Déconnexion', 'nav'),
  
  -- Landing Page
  ('fr', 'landing.hero.title', 'Créez votre propre', 'landing'),
  ('fr', 'landing.hero.subtitle', 'Plateforme d''Audit', 'landing'),
  ('fr', 'landing.hero.description', 'Transformez vos processus d''audit avec une plateforme entièrement personnalisable. Des petits restaurants aux grandes chaînes de vente au détail - AuditFlow s''adapte à vous.', 'landing'),
  ('fr', 'landing.hero.cta.primary', 'Commencer l''essai gratuit', 'landing'),
  ('fr', 'landing.hero.cta.secondary', 'Voir la démo', 'landing'),
  ('fr', 'landing.hero.disclaimer', 'Aucune carte de crédit requise • Essai gratuit de 14 jours • Configuration en 5 minutes', 'landing'),
  
  -- Features
  ('fr', 'landing.features.title', 'Tout ce dont vous avez besoin pour des audits parfaits', 'landing'),
  ('fr', 'landing.features.subtitle', 'De la gestion des listes de contrôle aux rapports - notre plateforme a tous les outils dont vous avez besoin.', 'landing'),
  ('fr', 'landing.features.liveInsights.title', 'Insights en Temps Réel', 'landing'),
  ('fr', 'landing.features.liveInsights.description', 'Tableaux de bord en temps réel qui suivent vos performances d''audit en direct. Voyez exactement où vous en êtes et où vous allez.', 'landing'),
  ('fr', 'landing.features.mobileFirst.title', 'Mobile d''Abord', 'landing'),
  ('fr', 'landing.features.mobileFirst.description', 'Effectuez des audits où que vous soyez. Notre application fonctionne parfaitement à tout endroit, même hors ligne.', 'landing'),
  ('fr', 'landing.features.security.title', 'Sécurité Fort Knox', 'landing'),
  ('fr', 'landing.features.security.description', 'Vos données sont plus sûres qu''un coffre-fort bancaire. Chiffrement d''entreprise + RGPD = tranquillité d''esprit.', 'landing'),
  ('fr', 'landing.features.quickSetup.title', 'Magie 5 Minutes', 'landing'),
  ('fr', 'landing.features.quickSetup.description', 'De l''idée à la plateforme fonctionnelle en 5 minutes. Pas besoin de département IT, faites-le simplement.', 'landing'),
  ('fr', 'landing.features.teamPower.title', 'Puissance d''Équipe', 'landing'),
  ('fr', 'landing.features.teamPower.description', 'Plus forts ensemble. Partagez les tâches, suivez les progrès et travaillez comme une équipe bien huilée.', 'landing'),
  ('fr', 'landing.features.globalReach.title', 'Portée Mondiale', 'landing'),
  ('fr', 'landing.features.globalReach.description', 'Gérez 1 emplacement ou 1000. Tout depuis un tableau de bord, partout dans le monde.', 'landing'),
  
  -- Pricing
  ('fr', 'landing.pricing.title', 'Choisissez le plan qui vous convient', 'landing'),
  ('fr', 'landing.pricing.subtitle', 'Commencez gratuitement et passez à la version supérieure quand vous grandissez', 'landing'),
  ('fr', 'landing.pricing.monthly', 'Mensuel', 'landing'),
  ('fr', 'landing.pricing.yearly', 'Annuel', 'landing'),
  ('fr', 'landing.pricing.save', 'Économisez 20%', 'landing'),
  ('fr', 'landing.pricing.popular', 'Le plus populaire', 'landing'),
  
  -- Login
  ('fr', 'login.title', 'Connexion', 'login'),
  ('fr', 'login.email', 'Adresse e-mail', 'login'),
  ('fr', 'login.password', 'Mot de passe', 'login'),
  ('fr', 'login.submit', 'Se connecter', 'login'),
  ('fr', 'login.forgot', 'Mot de passe oublié ?', 'login'),
  ('fr', 'login.noAccount', 'Pas de compte ?', 'login'),
  ('fr', 'login.signup', 'S''inscrire', 'login'),
  
  -- Dashboard
  ('fr', 'dashboard.welcome', 'Bon retour', 'dashboard'),
  ('fr', 'dashboard.overview', 'Aperçu', 'dashboard'),
  ('fr', 'dashboard.recentAudits', 'Audits Récents', 'dashboard'),
  ('fr', 'dashboard.pendingActions', 'Actions en Attente', 'dashboard'),
  ('fr', 'dashboard.quickStats', 'Statistiques Rapides', 'dashboard'),
  
  -- Common
  ('fr', 'common.loading', 'Chargement...', 'common'),
  ('fr', 'common.error', 'Une erreur s''est produite', 'common'),
  ('fr', 'common.save', 'Enregistrer', 'common'),
  ('fr', 'common.cancel', 'Annuler', 'common'),
  ('fr', 'common.delete', 'Supprimer', 'common'),
  ('fr', 'common.edit', 'Modifier', 'common'),
  ('fr', 'common.add', 'Ajouter', 'common'),
  ('fr', 'common.search', 'Rechercher', 'common'),
  ('fr', 'common.filter', 'Filtrer', 'common'),
  ('fr', 'common.sort', 'Trier', 'common'),
  ('fr', 'common.export', 'Exporter', 'common'),
  ('fr', 'common.import', 'Importer', 'common'),
  ('fr', 'common.back', 'Retour', 'common'),
  ('fr', 'common.next', 'Suivant', 'common'),
  ('fr', 'common.previous', 'Précédent', 'common'),
  ('fr', 'common.close', 'Fermer', 'common'),
  ('fr', 'common.confirm', 'Confirmer', 'common'),
  ('fr', 'common.yes', 'Oui', 'common'),
  ('fr', 'common.no', 'Non', 'common'),
  ('fr', 'common.ok', 'OK', 'common')
ON CONFLICT (language_code, key) DO NOTHING;

-- ==============================================
-- STAP 7: CREATE HELPER FUNCTIONS
-- ==============================================

-- Functie om vertalingen op te halen
CREATE OR REPLACE FUNCTION get_translations(lang_code VARCHAR(5))
RETURNS TABLE(key VARCHAR(255), value TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT t.key, t.value
  FROM translations t
  WHERE t.language_code = lang_code
  ORDER BY t.key;
END;
$$ LANGUAGE plpgsql;

-- Functie om gebruikersvoorkeur op te slaan
CREATE OR REPLACE FUNCTION set_user_language(user_uuid UUID, lang_code VARCHAR(5))
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO user_preferences (user_id, language_code)
  VALUES (user_uuid, lang_code)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    language_code = EXCLUDED.language_code,
    updated_at = NOW();
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Functie om gebruikersvoorkeur op te halen
CREATE OR REPLACE FUNCTION get_user_language(user_uuid UUID)
RETURNS VARCHAR(5) AS $$
DECLARE
  user_lang VARCHAR(5);
BEGIN
  SELECT language_code INTO user_lang
  FROM user_preferences
  WHERE user_id = user_uuid;
  
  -- Als geen voorkeur gevonden, retourneer standaard taal
  IF user_lang IS NULL THEN
    SELECT code INTO user_lang
    FROM languages
    WHERE is_default = true
    LIMIT 1;
  END IF;
  
  RETURN COALESCE(user_lang, 'nl');
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- STAP 8: CREATE INDEXES FOR PERFORMANCE
-- ==============================================

-- Indexen voor betere performance
CREATE INDEX IF NOT EXISTS idx_translations_language_key ON translations(language_code, key);
CREATE INDEX IF NOT EXISTS idx_translations_context ON translations(context);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_languages_active ON languages(is_active);
CREATE INDEX IF NOT EXISTS idx_languages_default ON languages(is_default);

-- ==============================================
-- STAP 9: ENABLE RLS (ROW LEVEL SECURITY)
-- ==============================================

-- RLS inschakelen voor user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: gebruikers kunnen alleen hun eigen voorkeuren zien/bewerken
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- RLS voor languages en translations (publiek leesbaar)
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Policy: iedereen kan talen en vertalingen lezen
CREATE POLICY "Languages are publicly readable" ON languages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Translations are publicly readable" ON translations
  FOR SELECT USING (true);

-- ==============================================
-- STAP 10: CREATE TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Trigger functie voor updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers toevoegen
CREATE TRIGGER update_languages_updated_at
  BEFORE UPDATE ON languages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- SCRIPT VOLTOOID
-- ==============================================

-- Controleer of alles correct is geïnstalleerd
SELECT 
  'Languages installed: ' || COUNT(*) as status
FROM languages;

SELECT 
  'Dutch translations: ' || COUNT(*) as status
FROM translations 
WHERE language_code = 'nl';

SELECT 
  'English translations: ' || COUNT(*) as status
FROM translations 
WHERE language_code = 'en';

-- Toon alle geïnstalleerde talen
SELECT code, name, flag, is_default
FROM languages
WHERE is_active = true
ORDER BY is_default DESC, name;
