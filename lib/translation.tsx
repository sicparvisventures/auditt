'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'nl' | 'en' | 'fr'

interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Translation data
const translations = {
  nl: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.audits': 'Audits',
    'nav.actions': 'Acties',
    'nav.reports': 'Rapporten',
    'nav.settings': 'Instellingen',
    'nav.logout': 'Uitloggen',
    
    // Landing Page
    'landing.hero.title': 'Maak je eigen',
    'landing.hero.subtitle': 'Audit Platform',
    'landing.hero.description': 'Transformeer je audit processen met een volledig aanpasbaar platform. Van kleine restaurants tot grote retail ketens - AuditFlow schaalt met je mee.',
    'landing.hero.cta.primary': 'Start gratis trial',
    'landing.hero.cta.secondary': 'Bekijk demo',
    'landing.hero.disclaimer': 'Geen creditcard vereist • 14 dagen gratis trial • Setup in 5 minuten',
    
    // Features
    'landing.features.title': 'Alles wat je nodig hebt voor perfecte audits',
    'landing.features.subtitle': 'Van checklist beheer tot rapportage - ons platform heeft alle tools die je nodig hebt.',
    'landing.features.liveInsights.title': 'Live Insights',
    'landing.features.liveInsights.description': 'Real-time dashboards die je audit prestaties live volgen. Zie direct waar je staat en waar je naartoe gaat.',
    'landing.features.mobileFirst.title': 'Mobiel Eerst',
    'landing.features.mobileFirst.description': 'Audits uitvoeren waar je ook bent. Onze app werkt perfect op elke locatie, zelfs offline.',
    'landing.features.security.title': 'Fort Knox Security',
    'landing.features.security.description': 'Je data is veiliger dan een bankkluis. Enterprise encryptie + GDPR = gemoedsrust.',
    'landing.features.quickSetup.title': '5-Minuten Magic',
    'landing.features.quickSetup.description': 'Van idee tot werkend platform in 5 minuten. Geen IT-afdeling nodig, gewoon doen.',
    'landing.features.teamPower.title': 'Team Power',
    'landing.features.teamPower.description': 'Samen sterker. Deel taken, volg progressie en werk als één geolied team.',
    'landing.features.globalReach.title': 'Global Reach',
    'landing.features.globalReach.description': 'Beheer 1 locatie of 1000. Alles vanuit één dashboard, overal ter wereld.',
    
    // Pricing
    'landing.pricing.title': 'Kies het plan dat bij je past',
    'landing.pricing.subtitle': 'Start gratis en upgrade wanneer je groeit',
    'landing.pricing.monthly': 'Maandelijks',
    'landing.pricing.yearly': 'Jaarlijks',
    'landing.pricing.save': 'Bespaar 20%',
    'landing.pricing.popular': 'Meest populair',
    
    // Login
    'login.title': 'Inloggen',
    'login.email': 'E-mailadres',
    'login.password': 'Wachtwoord',
    'login.submit': 'Inloggen',
    'login.forgot': 'Wachtwoord vergeten?',
    'login.noAccount': 'Geen account?',
    'login.signup': 'Registreren',
    
    // Dashboard
    'dashboard.welcome': 'Welkom terug',
    'dashboard.overview': 'Overzicht',
    'dashboard.recentAudits': 'Recente Audits',
    'dashboard.pendingActions': 'Openstaande Acties',
    'dashboard.quickStats': 'Snelle Statistieken',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Er is een fout opgetreden',
    'common.save': 'Opslaan',
    'common.cancel': 'Annuleren',
    'common.delete': 'Verwijderen',
    'common.edit': 'Bewerken',
    'common.add': 'Toevoegen',
    'common.search': 'Zoeken',
    'common.filter': 'Filteren',
    'common.sort': 'Sorteren',
    'common.export': 'Exporteren',
    'common.import': 'Importeren',
    'common.back': 'Terug',
    'common.next': 'Volgende',
    'common.previous': 'Vorige',
    'common.close': 'Sluiten',
    'common.confirm': 'Bevestigen',
    'common.yes': 'Ja',
    'common.no': 'Nee',
    'common.ok': 'OK',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.audits': 'Audits',
    'nav.actions': 'Actions',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Landing Page
    'landing.hero.title': 'Create your own',
    'landing.hero.subtitle': 'Audit Platform',
    'landing.hero.description': 'Transform your audit processes with a fully customizable platform. From small restaurants to large retail chains - AuditFlow scales with you.',
    'landing.hero.cta.primary': 'Start free trial',
    'landing.hero.cta.secondary': 'View demo',
    'landing.hero.disclaimer': 'No credit card required • 14 days free trial • Setup in 5 minutes',
    
    // Features
    'landing.features.title': 'Everything you need for perfect audits',
    'landing.features.subtitle': 'From checklist management to reporting - our platform has all the tools you need.',
    'landing.features.liveInsights.title': 'Live Insights',
    'landing.features.liveInsights.description': 'Real-time dashboards that track your audit performance live. See exactly where you stand and where you\'re going.',
    'landing.features.mobileFirst.title': 'Mobile First',
    'landing.features.mobileFirst.description': 'Conduct audits wherever you are. Our app works perfectly at any location, even offline.',
    'landing.features.security.title': 'Fort Knox Security',
    'landing.features.security.description': 'Your data is safer than a bank vault. Enterprise encryption + GDPR = peace of mind.',
    'landing.features.quickSetup.title': '5-Minute Magic',
    'landing.features.quickSetup.description': 'From idea to working platform in 5 minutes. No IT department needed, just do it.',
    'landing.features.teamPower.title': 'Team Power',
    'landing.features.teamPower.description': 'Stronger together. Share tasks, track progress and work as one well-oiled team.',
    'landing.features.globalReach.title': 'Global Reach',
    'landing.features.globalReach.description': 'Manage 1 location or 1000. Everything from one dashboard, anywhere in the world.',
    
    // Pricing
    'landing.pricing.title': 'Choose the plan that fits you',
    'landing.pricing.subtitle': 'Start free and upgrade when you grow',
    'landing.pricing.monthly': 'Monthly',
    'landing.pricing.yearly': 'Yearly',
    'landing.pricing.save': 'Save 20%',
    'landing.pricing.popular': 'Most popular',
    
    // Login
    'login.title': 'Login',
    'login.email': 'Email address',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.forgot': 'Forgot password?',
    'login.noAccount': 'No account?',
    'login.signup': 'Sign up',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview': 'Overview',
    'dashboard.recentAudits': 'Recent Audits',
    'dashboard.pendingActions': 'Pending Actions',
    'dashboard.quickStats': 'Quick Stats',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.audits': 'Audits',
    'nav.actions': 'Actions',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    
    // Landing Page
    'landing.hero.title': 'Créez votre propre',
    'landing.hero.subtitle': 'Plateforme d\'Audit',
    'landing.hero.description': 'Transformez vos processus d\'audit avec une plateforme entièrement personnalisable. Des petits restaurants aux grandes chaînes de vente au détail - AuditFlow s\'adapte à vous.',
    'landing.hero.cta.primary': 'Commencer l\'essai gratuit',
    'landing.hero.cta.secondary': 'Voir la démo',
    'landing.hero.disclaimer': 'Aucune carte de crédit requise • Essai gratuit de 14 jours • Configuration en 5 minutes',
    
    // Features
    'landing.features.title': 'Tout ce dont vous avez besoin pour des audits parfaits',
    'landing.features.subtitle': 'De la gestion des listes de contrôle aux rapports - notre plateforme a tous les outils dont vous avez besoin.',
    'landing.features.liveInsights.title': 'Insights en Temps Réel',
    'landing.features.liveInsights.description': 'Tableaux de bord en temps réel qui suivent vos performances d\'audit en direct. Voyez exactement où vous en êtes et où vous allez.',
    'landing.features.mobileFirst.title': 'Mobile d\'Abord',
    'landing.features.mobileFirst.description': 'Effectuez des audits où que vous soyez. Notre application fonctionne parfaitement à tout endroit, même hors ligne.',
    'landing.features.security.title': 'Sécurité Fort Knox',
    'landing.features.security.description': 'Vos données sont plus sûres qu\'un coffre-fort bancaire. Chiffrement d\'entreprise + RGPD = tranquillité d\'esprit.',
    'landing.features.quickSetup.title': 'Magie 5 Minutes',
    'landing.features.quickSetup.description': 'De l\'idée à la plateforme fonctionnelle en 5 minutes. Pas besoin de département IT, faites-le simplement.',
    'landing.features.teamPower.title': 'Puissance d\'Équipe',
    'landing.features.teamPower.description': 'Plus forts ensemble. Partagez les tâches, suivez les progrès et travaillez comme une équipe bien huilée.',
    'landing.features.globalReach.title': 'Portée Mondiale',
    'landing.features.globalReach.description': 'Gérez 1 emplacement ou 1000. Tout depuis un tableau de bord, partout dans le monde.',
    
    // Pricing
    'landing.pricing.title': 'Choisissez le plan qui vous convient',
    'landing.pricing.subtitle': 'Commencez gratuitement et passez à la version supérieure quand vous grandissez',
    'landing.pricing.monthly': 'Mensuel',
    'landing.pricing.yearly': 'Annuel',
    'landing.pricing.save': 'Économisez 20%',
    'landing.pricing.popular': 'Le plus populaire',
    
    // Login
    'login.title': 'Connexion',
    'login.email': 'Adresse e-mail',
    'login.password': 'Mot de passe',
    'login.submit': 'Se connecter',
    'login.forgot': 'Mot de passe oublié ?',
    'login.noAccount': 'Pas de compte ?',
    'login.signup': 'S\'inscrire',
    
    // Dashboard
    'dashboard.welcome': 'Bon retour',
    'dashboard.overview': 'Aperçu',
    'dashboard.recentAudits': 'Audits Récents',
    'dashboard.pendingActions': 'Actions en Attente',
    'dashboard.quickStats': 'Statistiques Rapides',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur s\'est produite',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.export': 'Exporter',
    'common.import': 'Importer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.close': 'Fermer',
    'common.confirm': 'Confirmer',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.ok': 'OK',
  }
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('nl')

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('auditflow-language') as Language
    if (savedLanguage && (savedLanguage === 'nl' || savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('auditflow-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}
