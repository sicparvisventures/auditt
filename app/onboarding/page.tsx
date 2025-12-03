'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Building2, Users, Settings, Shield, Zap, BarChart3 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface OnboardingData {
  // Basic Info
  organizationName: string
  organizationSlug: string
  industry: string
  
  // Contact Info
  contactName: string
  contactEmail: string
  contactPhone: string
  
  // Branding & Template (combined)
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  primaryFont: string
  accentFont: string
  templateId: string
  
  // Subscription
  tier: 'starter' | 'professional' | 'enterprise'
  billingCycle: 'monthly' | 'yearly'
}

const industryOptions = [
  'Restaurant & Horeca',
  'Retail & Winkelketens',
  'Zorg & Gezondheid',
  'Onderwijs',
  'Manufacturing',
  'Logistiek & Transport',
  'Overheid',
  'Anders'
]

const fontOptions = [
  { name: 'Inter', value: 'Inter', category: 'Modern' },
  { name: 'Lino Stamp', value: 'Lino Stamp', category: 'Custom' },
  { name: 'Bacon Kingdom', value: 'Bacon Kingdom', category: 'Playful' },
  { name: 'Roboto', value: 'Roboto', category: 'Clean' },
  { name: 'Open Sans', value: 'Open Sans', category: 'Friendly' },
  { name: 'Montserrat', value: 'Montserrat', category: 'Elegant' }
]

const colorPresets = [
  {
    name: 'Professional Blue',
    primary: '#132938',
    secondary: '#dc2626',
    accent: '#f59e0b',
    background: '#f8fafc',
    text: '#1f2937'
  },
  {
    name: 'Restaurant Green',
    primary: '#059669',
    secondary: '#dc2626',
    accent: '#f59e0b',
    background: '#f0fdf4',
    text: '#064e3b'
  },
  {
    name: 'Corporate Dark',
    primary: '#0f172a',
    secondary: '#1e40af',
    accent: '#059669',
    background: '#ffffff',
    text: '#0f172a'
  },
  {
    name: 'Poule & Poulette',
    primary: '#1C3834',
    secondary: '#93231F',
    accent: '#F495BD',
    background: '#FBFBF1',
    text: '#060709'
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier') as 'starter' | 'professional' | 'enterprise' || 'starter'
  
  const [currentStep, setCurrentStep] = useState(0) // Start with welcome screen
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    organizationName: '',
    organizationSlug: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    primaryColor: '#2563eb',
    secondaryColor: '#dc2626',
    accentColor: '#f59e0b',
    backgroundColor: '#f8fafc',
    textColor: '#1f2937',
    primaryFont: 'Inter',
    accentFont: 'Inter',
    templateId: '',
    tier,
    billingCycle: 'monthly'
  })

  const totalSteps = tier === 'starter' ? 4 : 5 // Different number of steps per tier

  const tierInfo = {
    starter: {
      name: 'Starter',
      price: { monthly: 29, yearly: 290 },
      description: 'Perfect voor kleine teams en startups',
      features: [
        'Tot 5 gebruikers',
        'Tot 3 locaties', 
        '10 audits per maand',
        'Basis rapportage',
        'Email support'
      ],
      color: '#2563eb'
    },
    professional: {
      name: 'Professional',
      price: { monthly: 99, yearly: 990 },
      description: 'Ideaal voor groeiende bedrijven',
      features: [
        'Tot 25 gebruikers',
        'Tot 15 locaties',
        '100 audits per maand',
        'Geavanceerde rapportage',
        'Custom branding',
        'Priority support',
        'Dashboard analytics'
      ],
      color: '#059669'
    },
    enterprise: {
      name: 'Enterprise',
      price: { monthly: 299, yearly: 2990 },
      description: 'Voor grote organisaties',
      features: [
        'Onbeperkte gebruikers',
        'Onbeperkte locaties',
        'Onbeperkte audits',
        'Volledige custom branding',
        'API toegang',
        '24/7 premium support',
        'White-label oplossing'
      ],
      color: '#7c3aed'
    }
  }

  const steps = tier === 'starter' ? [
    { number: 1, title: 'Bedrijfsinformatie', description: 'Basis informatie over uw organisatie' },
    { number: 2, title: 'Contactgegevens', description: 'Uw contactgegevens voor support' },
    { number: 3, title: 'Branding & Template', description: 'Kies uw kleurenschema en template' },
    { number: 4, title: 'Voltooiing', description: 'Uw platform wordt aangemaakt' }
  ] : [
    { number: 1, title: 'Bedrijfsinformatie', description: 'Uitgebreide informatie over uw organisatie' },
    { number: 2, title: 'Contactgegevens', description: 'Uw contactgegevens voor support' },
    { number: 3, title: 'Branding & Template', description: 'Custom branding en template configuratie' },
    { number: 4, title: 'Geavanceerde Instellingen', description: 'Extra configuratie opties' },
    { number: 5, title: 'Voltooiing', description: 'Uw platform wordt aangemaakt' }
  ]

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Auto-generate slug when organization name changes
      if (field === 'organizationName') {
        newData.organizationSlug = generateSlug(value)
      }
      
      return newData
    })
  }

  const handleColorPreset = (preset: typeof colorPresets[0]) => {
    setData(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      backgroundColor: preset.background,
      textColor: preset.text
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return data.organizationName.length > 0 && data.organizationSlug.length > 0 && data.industry.length > 0
      case 2:
        return data.contactName.length > 0 && data.contactEmail.length > 0
      case 3:
        return true // Colors always valid
      case 4:
        return true // Fonts always valid
      case 5:
        return true // Template always valid
      case 6:
        return true // Final step
      default:
        return false
    }
  }

  const nextStep = () => {
    if (currentStep === 0) {
      // Welcome screen - always allow to proceed
      setCurrentStep(currentStep + 1)
    } else if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      console.log('Creating organization with data:', data)
      
      // Validate required fields
      if (!data.organizationName || !data.organizationSlug || !data.contactEmail) {
        alert('Vul alle verplichte velden in')
        setLoading(false)
        return
      }
      
      // Validate slug format
      if (!/^[a-z0-9-]{3,50}$/.test(data.organizationSlug)) {
        alert('Organisatie slug moet 3-50 karakters zijn, alleen kleine letters, cijfers en streepjes')
        setLoading(false)
        return
      }
      
      // Call Supabase function to create organization
      const { data: orgData, error } = await supabase.rpc('create_new_organization', {
        org_name: data.organizationName,
        org_slug: data.organizationSlug,
        org_tier: data.tier,
        org_industry: data.industry,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        primary_color: data.primaryColor,
        secondary_color: data.secondaryColor,
        accent_color: data.accentColor,
        background_color: data.backgroundColor,
        text_color: data.textColor,
        primary_font: data.primaryFont,
        accent_font: data.accentFont,
        template_id: data.templateId || 'restaurant'
      })
      
      if (error) {
        console.error('Error creating organization:', error)
        // Check if it's a function not found error
        if (error.message.includes('Could not find the function')) {
          alert('Database functie niet gevonden. Voer eerst het database script uit.')
        } else {
          alert(`Fout bij aanmaken organisatie: ${error.message}`)
        }
        setLoading(false)
        return
      }
      
      console.log('Organization created successfully:', orgData)
      
      // Show success message
      alert('Organisatie succesvol aangemaakt! U wordt doorgestuurd naar de login pagina.')
      
      // Redirect to the new organization's login page
      router.push(`/${data.organizationSlug}/login`)
    } catch (error) {
      console.error('Error creating organization:', error)
      alert(`Onverwachte fout: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    // Welcome screen
    if (currentStep === 0) {
      return (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Welkom bij {tierInfo[tier].name}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {tierInfo[tier].description}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900">
                €{tierInfo[tier].price.monthly}
                <span className="text-lg font-normal text-gray-600">/maand</span>
              </div>
              <div className="text-sm text-gray-500">
                of €{tierInfo[tier].price.yearly}/jaar (bespaar 20%)
              </div>
            </div>
            
            <div className="space-y-3">
              {tierInfo[tier].features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              Laten we uw {tierInfo[tier].name.toLowerCase()} platform configureren. 
              Dit duurt slechts {totalSteps} stappen.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>14 dagen gratis trial • Geen creditcard vereist</span>
            </div>
          </div>
        </div>
      )
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tier === 'starter' ? 'Basis Bedrijfsinformatie' : 'Uitgebreide Bedrijfsinformatie'}
              </h3>
              <p className="text-gray-600">
                {tier === 'starter' 
                  ? 'Vertel ons meer over uw organisatie voor een snelle setup.'
                  : 'Geef ons uitgebreide informatie over uw organisatie voor een op maat gemaakte oplossing.'
                }
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrijfsnaam *
              </label>
              <input
                type="text"
                value={data.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                placeholder="Bijv. Restaurant De Gouden Kip"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 py-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  auditflow.com/
                </span>
                <input
                  type="text"
                  value={data.organizationSlug}
                  onChange={(e) => handleInputChange('organizationSlug', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="restaurant-de-gouden-kip"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Dit wordt uw unieke URL. Alleen letters, cijfers en streepjes toegestaan.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branche *
              </label>
              <select
                value={data.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <option value="">Selecteer uw branche</option>
                {industryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {tier !== 'starter' && (
              <div className="rounded-lg p-4" style={{ backgroundColor: '#f0f4f8', border: '1px solid #132938' }}>
                <div className="flex items-start space-x-3">
                  <BarChart3 className="w-5 h-5 mt-0.5" style={{ color: '#132938' }} />
                  <div>
                    <h4 className="text-sm font-medium" style={{ color: '#132938' }}>Extra Configuratie</h4>
                    <p className="text-sm mt-1" style={{ color: '#132938' }}>
                      Als {tier} klant krijgt u toegang tot geavanceerde configuratie opties in de volgende stappen.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Contactgegevens
              </h3>
              <p className="text-gray-600">
                {tier === 'starter' 
                  ? 'Uw contactgegevens voor support en communicatie.'
                  : 'Uw contactgegevens voor premium support en account management.'
                }
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contactpersoon *
              </label>
              <input
                type="text"
                value={data.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                placeholder="Jan Janssen"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email adres *
              </label>
              <input
                type="email"
                value={data.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                placeholder="jan@restaurant.nl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefoonnummer
              </label>
              <input
                type="tel"
                value={data.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                placeholder="+31 6 12345678"
              />
            </div>

            {tier !== 'starter' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900">Priority Support</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Als {tier} klant krijgt u toegang tot priority support en een dedicated account manager.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tier === 'starter' ? 'Branding & Template' : 'Custom Branding & Template'}
              </h3>
              <p className="text-gray-600">
                {tier === 'starter' 
                  ? 'Kies een vooraf ingesteld kleurenschema en template voor uw platform.'
                  : 'Configureer uw custom branding met geavanceerde opties en templates.'
                }
              </p>
            </div>

            {/* Template Selection */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Kies een template</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 transition-colors cursor-pointer"
                     onMouseEnter={(e) => e.currentTarget.style.borderColor = '#132938'}
                     onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">Restaurant Template</h5>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Aanbevolen</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Perfect voor restaurants en horeca. Inclusief voedselveiligheid checklisten en horeca-specifieke audits.
                  </p>
                  <div className="flex space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#059669' }}></div>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 transition-colors cursor-pointer"
                     onMouseEnter={(e) => e.currentTarget.style.borderColor = '#132938'}
                     onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                  <h5 className="font-medium text-gray-900 mb-3">Retail Template</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Ideaal voor winkels en retail ketens. Focus op klantenservice, voorraad en winkelpresentatie.
                  </p>
                  <div className="flex space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2563eb' }}></div>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                  </div>
                </div>
                
                {tier !== 'starter' && (
                  <div className="border border-gray-200 rounded-lg p-4 transition-colors cursor-pointer"
                     onMouseEnter={(e) => e.currentTarget.style.borderColor = '#132938'}
                     onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                    <h5 className="font-medium text-gray-900 mb-3">Corporate Template</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      Professioneel template voor grote bedrijven. Uitgebreide compliance checklists en enterprise features.
                    </p>
                    <div className="flex space-x-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0f172a' }}></div>
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1e40af' }}></div>
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: '#059669' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Kleurenschema</h4>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorPreset(preset)}
                    className="p-4 border border-gray-200 rounded-lg transition-colors text-left"
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#132938'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  >
                    <div className="flex space-x-2 mb-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }}></div>
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.secondary }}></div>
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.accent }}></div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{preset.name}</p>
                  </button>
                ))}
              </div>
              
              {tier !== 'starter' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primaire kleur</label>
                    <input
                      type="color"
                      value={data.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-full h-12 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secundaire kleur</label>
                    <input
                      type="color"
                      value={data.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-full h-12 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Preview</h4>
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: data.backgroundColor,
                  color: data.textColor,
                  fontFamily: data.primaryFont
                }}
              >
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ 
                    fontFamily: data.accentFont,
                    color: data.primaryColor
                  }}
                >
                  {data.organizationName || 'Uw Organisatie'}
                </h3>
                <p className="mb-4">Dit is hoe uw audit platform eruit zal zien met het gekozen kleurenschema.</p>
                <div className="flex space-x-3">
                  <button 
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: data.primaryColor }}
                  >
                    Primaire knop
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: data.secondaryColor }}
                  >
                    Secundaire knop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        // Geavanceerde instellingen (alleen voor professional/enterprise)
        if (tier === 'starter') {
          // Voor starter, dit is de voltooiing stap
          return renderCompletionStep()
        }
        
        return (
          <div className="space-y-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Geavanceerde Instellingen
              </h3>
              <p className="text-gray-600">
                Configureer extra opties en instellingen voor uw {tier} platform.
              </p>
            </div>

            {/* Lettertypes */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Lettertypes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primaire lettertype
                  </label>
                  <select
                    value={data.primaryFont}
                    onChange={(e) => handleInputChange('primaryFont', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    {fontOptions.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.name} ({font.category})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent lettertype
                  </label>
                  <select
                    value={data.accentFont}
                    onChange={(e) => handleInputChange('accentFont', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    {fontOptions.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.name} ({font.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* API & Integrations */}
            {tier === 'enterprise' && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">API & Integraties</h4>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-purple-900">API Toegang</h5>
                      <p className="text-sm text-purple-700 mt-1">
                        Als Enterprise klant krijgt u volledige API toegang voor custom integraties en automatisering.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* White-label Options */}
            {tier === 'enterprise' && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">White-label Opties</h4>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Settings className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-indigo-900">Volledige White-label</h5>
                      <p className="text-sm text-indigo-700 mt-1">
                        Uw platform kan volledig worden aangepast met uw eigen branding, logo en domein.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Preview</h4>
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: data.backgroundColor,
                  color: data.textColor,
                  fontFamily: data.primaryFont
                }}
              >
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ 
                    fontFamily: data.accentFont,
                    color: data.primaryColor
                  }}
                >
                  {data.organizationName || 'Uw Organisatie'}
                </h3>
                <p className="mb-4">Dit is hoe uw audit platform eruit zal zien met alle gekozen instellingen.</p>
                <div className="flex space-x-3">
                  <button 
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: data.primaryColor }}
                  >
                    Primaire knop
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: data.secondaryColor }}
                  >
                    Secundaire knop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        // Voltooiing stap voor professional/enterprise
        return renderCompletionStep()

      default:
        return renderCompletionStep()
    }
  }

  const renderCompletionStep = () => {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Uw {tierInfo[tier].name} platform is klaar!
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Uw audit platform wordt nu aangemaakt met alle gekozen instellingen. 
            Dit duurt slechts een paar minuten.
          </p>
        </div>
        
        {/* Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Samenvatting</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Bedrijfsnaam:</span>
                <span className="font-medium text-gray-900">{data.organizationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">URL:</span>
                <span className="font-medium text-gray-900">auditflow.com/{data.organizationSlug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium text-gray-900 capitalize">{data.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Branche:</span>
                <span className="font-medium text-gray-900">{data.industry}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Contactpersoon:</span>
                <span className="font-medium text-gray-900">{data.contactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{data.contactEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kleurenschema:</span>
                <div className="flex space-x-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: data.primaryColor }}></div>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: data.secondaryColor }}></div>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: data.accentColor }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg p-6" style={{ backgroundColor: '#f0f4f8', border: '1px solid #132938' }}>
          <h4 className="text-lg font-semibold mb-3" style={{ color: '#132938' }}>Volgende stappen</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5" style={{ backgroundColor: '#132938' }}>1</div>
              <div>
                <p className="font-medium" style={{ color: '#132938' }}>Platform wordt aangemaakt</p>
                <p className="text-sm" style={{ color: '#132938' }}>Uw audit platform wordt geconfigureerd met alle gekozen instellingen.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5" style={{ backgroundColor: '#132938' }}>2</div>
              <div>
                <p className="font-medium" style={{ color: '#132938' }}>Welkom email</p>
                <p className="text-sm" style={{ color: '#132938' }}>U ontvangt een welkom email met inloggegevens en instructies.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <div>
                <p className="font-medium text-blue-900">Start met auditen</p>
                <p className="text-sm text-blue-700">Log in op uw platform en begin met het uitvoeren van audits.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Info */}
        {tier !== 'starter' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Users className="w-6 h-6 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-lg font-semibold text-green-900 mb-2">Priority Support</h4>
                <p className="text-green-700 mb-3">
                  Als {tier} klant krijgt u toegang tot priority support en een dedicated account manager.
                </p>
                <p className="text-sm text-green-600">
                  Uw account manager neemt binnen 24 uur contact met u op voor een persoonlijke onboarding sessie.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/landing')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar homepage
          </button>
          
          {currentStep === 0 ? (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <img 
                  src="/nbg.png" 
                  alt="AuditFlow Logo" 
                  className="h-16 w-auto"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-4">
                <img 
                  src="/nbg.png" 
                  alt="AuditFlow Logo" 
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-gray-600 text-center">
                Stap {currentStep} van {totalSteps}: {steps[currentStep - 1]?.title}
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {currentStep > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.number <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-20 h-1 mx-3 ${
                        step.number < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStep <= steps.length ? steps[currentStep - 1]?.title : 'Voltooiing'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentStep <= steps.length ? steps[currentStep - 1]?.description : 'Uw platform wordt aangemaakt'}
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Vorige
          </button>

          {currentStep === 0 ? (
            <button
              onClick={nextStep}
              className="flex items-center px-8 py-3 text-white rounded-lg hover:opacity-90 font-medium transition-opacity"
              style={{ backgroundColor: tierInfo[tier].color }}
            >
              Start Setup
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Volgende
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Aanmaken...' : 'Platform aanmaken'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
