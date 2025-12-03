'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTranslation } from '@/lib/translation'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { 
  ArrowRight, 
  Check, 
  Star,
  Shield,
  Users,
  Zap,
  Globe,
  Headphones,
  Award,
  BarChart3,
  Smartphone,
  FileText,
  Camera,
  Settings,
  Database,
  Lock,
  Download,
  Upload,
  Bell,
  Target,
  TrendingUp,
  Eye,
  MessageSquare,
  Calendar,
  MapPin,
  Monitor,
  Tablet,
  Phone,
  Workflow,
  GitBranch,
  Layers,
  Cloud,
  Server,
  Wifi,
  WifiOff,
  X
} from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { t } = useTranslation()
  const [isYearly, setIsYearly] = useState(false)

  // Pricing calculations
  const getPrice = (monthlyPrice: number) => {
    if (isYearly) {
      const yearlyPrice = monthlyPrice * 12 * 0.8 // 20% discount
      return Math.round(yearlyPrice)
    }
    return monthlyPrice
  }

  const getBillingText = () => {
    return isYearly ? '/jaar' : '/maand'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f6f1eb' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#132938' }}></div>
          <p className="mt-4" style={{ color: '#132938' }}>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f1eb' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#f6f1eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/landing')}
                className="text-left"
              >
                <h1 className="text-2xl font-bold" style={{ color: '#132938' }}>
                  AuditFlow
                </h1>
                <p className="text-sm" style={{ color: '#132938' }}>
                  INTERNAL AUDITS
                </p>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/organization-login')}
                className="px-4 py-2 rounded-lg hover:opacity-80 transition-colors"
                style={{ backgroundColor: '#f6f1eb', color: '#132938', border: '2px solid #132938' }}
              >
                {t('login.title')}
              </button>
              <button
                onClick={() => router.push('/onboarding')}
                className="text-white px-4 py-2 rounded-lg hover:opacity-80 transition-colors"
                style={{ backgroundColor: '#132938' }}
              >
                Start gratis trial
              </button>
              <LanguageSelector />
              {user && (
                <button
                  onClick={() => router.push('/pp-dashboard')}
                  className="text-white px-6 py-2 rounded-lg hover:opacity-80 transition-colors"
                  style={{ backgroundColor: '#132938' }}
                >
                  {t('nav.dashboard')}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: '#8B8B8B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              AuditFlow Pricing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white">
              Kies het perfecte plan voor jouw organisatie
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/onboarding')}
                className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center hover:opacity-90"
                style={{ backgroundColor: '#132938' }}
              >
                Start gratis trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => router.push('/info/demo')}
                className="border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                style={{ 
                  borderColor: 'white', 
                  color: 'white',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.color = '#132938'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'white'
                }}
              >
                Bekijk demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#132938' }}>
              Kies je perfecte plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Van startup tot enterprise - we hebben het juiste plan voor elke organisatie
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Maandelijks
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isYearly ? 'bg-gray-600' : 'bg-gray-200'
                }`}
                style={isYearly ? { backgroundColor: '#132938' } : {}}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Jaarlijks
              </span>
              {isYearly && (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  20% korting
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100 relative flex flex-col">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#132938' }}>Starter</h3>
                <p className="text-gray-600 mb-4">Perfect voor kleine teams en startups</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: '#132938' }}>€{getPrice(29)}</span>
                  <span className="text-gray-600">{getBillingText()}</span>
                  {isYearly && <div className="text-sm text-green-600 font-medium">Bespaar €{Math.round(29 * 12 * 0.2)} per jaar</div>}
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Tot 5 gebruikers
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Tot 3 locaties
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  10 audits per maand
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Basis rapportage
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Email support
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Mobiele app toegang
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <X className="h-4 w-4 mr-3 flex-shrink-0" />
                  Geen custom branding
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <X className="h-4 w-4 mr-3 flex-shrink-0" />
                  Geen API toegang
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <X className="h-4 w-4 mr-3 flex-shrink-0" />
                  Basis support
                </li>
              </ul>
              
              <button
                onClick={() => router.push('/onboarding')}
                className="w-full text-white px-6 py-3 rounded-lg font-semibold transition-colors mt-auto"
                style={{ backgroundColor: '#132938' }}
              >
                Start gratis trial
              </button>
            </div>

            {/* Professional Plan - Most Popular */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 relative flex flex-col" style={{ borderColor: '#132938' }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="text-white px-4 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: '#132938' }}>
                  Meest populair
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#132938' }}>Professional</h3>
                <p className="text-gray-600 mb-4">Ideaal voor groeiende bedrijven</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: '#132938' }}>€{getPrice(99)}</span>
                  <span className="text-gray-600">{getBillingText()}</span>
                  {isYearly && <div className="text-sm text-green-600 font-medium">Bespaar €{Math.round(99 * 12 * 0.2)} per jaar</div>}
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Tot 25 gebruikers
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Tot 15 locaties
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  100 audits per maand
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Geavanceerde rapportage
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Custom branding
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Priority support
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Mobiele app toegang
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Dashboard analytics
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <X className="h-4 w-4 mr-3 flex-shrink-0" />
                  Geen API toegang
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <X className="h-4 w-4 mr-3 flex-shrink-0" />
                  Beperkte integraties
                </li>
              </ul>
              
              <button
                onClick={() => router.push('/onboarding')}
                className="w-full text-white px-6 py-3 rounded-lg font-semibold transition-colors mt-auto"
                style={{ backgroundColor: '#132938' }}
              >
                Start gratis trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100 relative flex flex-col">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#132938' }}>Enterprise</h3>
                <p className="text-gray-600 mb-4">Voor grote organisaties</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: '#132938' }}>€{getPrice(299)}</span>
                  <span className="text-gray-600">{getBillingText()}</span>
                  {isYearly && <div className="text-sm text-green-600 font-medium">Bespaar €{Math.round(299 * 12 * 0.2)} per jaar</div>}
                </div>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Onbeperkte gebruikers
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Onbeperkte locaties
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Onbeperkte audits
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Volledige custom branding
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  API toegang
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  24/7 premium support
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  White-label oplossing
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  SSO integratie
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  Dedicated account manager
                </li>
              </ul>
              
              <button
                onClick={() => router.push('/info/contact')}
                className="w-full text-white px-6 py-3 rounded-lg font-semibold transition-colors mt-auto"
                style={{ backgroundColor: '#132938' }}
              >
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16" style={{ backgroundColor: '#f6f1eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#132938' }}>
              Vergelijk alle features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bekijk welke features beschikbaar zijn in elk plan
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Starter</th>
                    <th className="text-center py-4 px-6 font-semibold" style={{ color: '#132938' }}>Professional</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">Gebruikers</td>
                    <td className="py-4 px-6 text-center text-gray-600">Tot 5</td>
                    <td className="py-4 px-6 text-center text-gray-600">Tot 25</td>
                    <td className="py-4 px-6 text-center text-gray-600">Onbeperkt</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">Locaties</td>
                    <td className="py-4 px-6 text-center text-gray-600">Tot 3</td>
                    <td className="py-4 px-6 text-center text-gray-600">Tot 15</td>
                    <td className="py-4 px-6 text-center text-gray-600">Onbeperkt</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">Audits per maand</td>
                    <td className="py-4 px-6 text-center text-gray-600">10</td>
                    <td className="py-4 px-6 text-center text-gray-600">100</td>
                    <td className="py-4 px-6 text-center text-gray-600">Onbeperkt</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">Custom branding</td>
                    <td className="py-4 px-6 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">API toegang</td>
                    <td className="py-4 px-6 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">24/7 Support</td>
                    <td className="py-4 px-6 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">White-label</td>
                    <td className="py-4 px-6 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Dedicated account manager</td>
                    <td className="py-4 px-6 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="py-4 px-6 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#132938' }}>
              Veelgestelde vragen
            </h2>
            <p className="text-xl text-gray-600">
              Alles wat je wilt weten over AuditFlow pricing
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#132938' }}>
                Kan ik mijn plan later upgraden?
              </h3>
              <p className="text-gray-600">
                Ja, je kunt op elk moment upgraden naar een hoger plan. Je betaalt alleen het verschil voor de resterende periode.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#132938' }}>
                Is er een opzegtermijn?
              </h3>
              <p className="text-gray-600">
                Nee, je kunt je abonnement op elk moment opzeggen zonder opzegtermijn. Je behoudt toegang tot het einde van je betaalperiode.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#132938' }}>
                Wat gebeurt er met mijn data als ik opzeg?
              </h3>
              <p className="text-gray-600">
                Je kunt je data op elk moment exporteren. Na opzegging bewaren we je data 30 dagen, daarna wordt deze definitief verwijderd.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#132938' }}>
                Zijn er verborgen kosten?
              </h3>
              <p className="text-gray-600">
                Nee, de prijzen zijn all-inclusive. Geen setup kosten, geen verborgen fees. Je betaalt alleen wat je ziet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: '#f6f1eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#132938' }}>
            Klaar om te beginnen?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start vandaag nog met je gratis trial en ontdek hoe AuditFlow je audit processen kan transformeren.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/onboarding')}
              className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center hover:opacity-90"
              style={{ backgroundColor: '#132938' }}
            >
              Start Gratis Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => router.push('/info/contact')}
              className="border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              style={{ 
                borderColor: '#132938', 
                color: '#132938',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#132938'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#132938'
              }}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">AuditFlow</h3>
                  <p className="text-sm text-white">INTERNAL AUDITS</p>
                </div>
              </div>
              <p className="text-white">
                Het meest complete audit platform voor moderne bedrijven.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/info/features')} className="hover:text-white">Features</button></li>
                <li><button onClick={() => router.push('/info/pricing')} className="hover:text-white">Pricing</button></li>
                <li><button onClick={() => router.push('/info/demo')} className="hover:text-white">Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/info/documentatie')} className="hover:text-white">Documentatie</button></li>
                <li><button onClick={() => router.push('/info/help-center')} className="hover:text-white">Help Center</button></li>
                <li><button onClick={() => router.push('/info/contact')} className="hover:text-white">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Bedrijf</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/info/over-ons')} className="hover:text-white">Over ons</button></li>
                <li><button onClick={() => router.push('/info/blog')} className="hover:text-white">Blog</button></li>
                <li><button onClick={() => router.push('/info/carrieres')} className="hover:text-white">Carrières</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SPM Ventures. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


