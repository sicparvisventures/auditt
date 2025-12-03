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
  Zap, 
  Users, 
  BarChart3, 
  Smartphone, 
  Globe, 
  Headphones,
  FileText,
  Camera,
  Clock,
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
  MapPin
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { t } = useTranslation()
  const [isYearly, setIsYearly] = useState(false)
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

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

  const getSavingsText = () => {
    return isYearly ? ' (20% korting)' : ''
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
      {/* Header - Crème achtergrond */}
      <header style={{ backgroundColor: '#f6f1eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Links: AuditFlow logo */}
            <div className="flex items-center">
              <img 
                src="/fulllogo.png" 
                alt="AuditFlow Logo" 
                className="h-12 w-auto"
              />
            </div>

            {/* Rechts: Knoppen en language selector */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/organization-login')}
                className="px-4 py-2 rounded-lg hover:opacity-80 transition-colors font-body"
                style={{ backgroundColor: '#f6f1eb', color: '#132938', border: '2px solid #132938' }}
              >
                {t('login.title')}
              </button>
              <button
                onClick={() => router.push('/onboarding')}
                className="text-white px-4 py-2 rounded-lg hover:opacity-80 transition-colors font-body"
                style={{ backgroundColor: '#132938' }}
              >
                Start gratis trial
              </button>
              <LanguageSelector />
              {user && (
                <button
                  onClick={() => router.push('/pp-dashboard')}
                  className="text-white px-6 py-2 rounded-lg hover:opacity-80 transition-colors font-body"
                  style={{ backgroundColor: '#132938' }}
                >
                  {t('nav.dashboard')}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Betongrijs achtergrond met gradient overlay, nbg.png, tekst links en pro.png rechts */}
      <section className="min-h-[90vh] flex items-start pt-20 relative" style={{ backgroundColor: '#8B8B8B' }}>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-gray-900/40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Tekst links */}
            <div className="flex flex-col">
              {/* nbg.png image */}
              <div className="mb-6">
                <img 
                  src="/nbg.png" 
                  alt="AuditFlow Logo" 
                  className="h-16 w-auto"
                />
              </div>
              {/* Text content that aligns with pro.png */}
              <div className="flex-1 flex flex-col justify-start min-h-0">
                <h1 className="text-4xl md:text-6xl font-light mb-6 font-display" style={{ color: 'white' }}>
                  {t('landing.hero.title')}
                  <span className="block font-medium" style={{ color: '#132938' }}>{t('landing.hero.subtitle')}</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-white font-light font-body">
                  {t('landing.hero.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push('/onboarding')}
                    className="text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors flex items-center justify-center font-body"
                    style={{ backgroundColor: '#132938' }}
                  >
                    {t('landing.hero.cta.primary')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <button
                    onClick={() => router.push('/info/demo')}
                    className="border-2 px-8 py-4 rounded-lg text-lg font-medium transition-colors font-body"
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
                    {t('landing.hero.cta.secondary')}
                  </button>
                </div>
                <p className="text-sm mt-4 text-white font-light font-body">
                  {t('landing.hero.disclaimer')}
                </p>
              </div>
            </div>

            {/* Afbeelding rechts */}
            <div className="flex justify-center lg:justify-end items-center">
              <img 
                src="/pro.png" 
                alt="AuditFlow Platform" 
                className="max-w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6 font-display" style={{ color: '#132938' }}>
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light font-body">
              {t('landing.features.subtitle')}
            </p>
          </div>

          {/* Interactive Feature Icons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {/* Live Insights Icon */}
            <div 
              className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-110"
              onClick={() => setActiveFeature(activeFeature === 0 ? null : 0)}
            >
              <div className="p-6 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl" style={{ backgroundColor: '#000813' }}>
                <img 
                  src="/icon3.png" 
                  alt="Live Insights Icon" 
                  className="h-12 w-12 transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700 text-center font-body">Live Insights</p>
            </div>

            {/* Mobile First Icon */}
            <div 
              className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-110"
              onClick={() => setActiveFeature(activeFeature === 1 ? null : 1)}
            >
              <div className="p-6 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl" style={{ backgroundColor: '#000813' }}>
                <Smartphone className="h-12 w-12 text-white transition-all duration-300 group-hover:scale-110" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700 text-center font-body">Mobiel Eerst</p>
            </div>

            {/* Security Icon */}
            <div 
              className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-110"
              onClick={() => setActiveFeature(activeFeature === 2 ? null : 2)}
            >
              <div className="p-6 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl" style={{ backgroundColor: '#000813' }}>
                <Shield className="h-12 w-12 text-white transition-all duration-300 group-hover:scale-110" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700 text-center font-body">Fort Knox Security</p>
            </div>

            {/* Quick Setup Icon */}
            <div 
              className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-110"
              onClick={() => setActiveFeature(activeFeature === 3 ? null : 3)}
            >
              <div className="p-6 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl" style={{ backgroundColor: '#000813' }}>
                <Zap className="h-12 w-12 text-white transition-all duration-300 group-hover:scale-110" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700 text-center font-body">5-Minuten Magic</p>
            </div>

            {/* Team Power Icon */}
            <div 
              className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-110"
              onClick={() => setActiveFeature(activeFeature === 4 ? null : 4)}
            >
              <div className="p-6 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl" style={{ backgroundColor: '#000813' }}>
                <Users className="h-12 w-12 text-white transition-all duration-300 group-hover:scale-110" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700 text-center font-body">Team Power</p>
            </div>

            {/* Global Reach Icon */}
            <div 
              className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-110"
              onClick={() => setActiveFeature(activeFeature === 5 ? null : 5)}
            >
              <div className="p-6 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl" style={{ backgroundColor: '#000813' }}>
                <Globe className="h-12 w-12 text-white transition-all duration-300 group-hover:scale-110" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700 text-center font-body">Global Reach</p>
            </div>
          </div>

          {/* Animated Feature Details */}
          <div className="relative">
            <div className={`transition-all duration-500 ease-in-out transform ${
              activeFeature !== null 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
            }`}>
              {activeFeature === 0 && (
                <div className="rounded-xl shadow-2xl p-8 relative overflow-hidden" style={{ backgroundColor: '#8B8B8B' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-gray-900/40 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="p-4 rounded-xl mr-6" style={{ backgroundColor: '#000813' }}>
                        <img src="/icon3.png" alt="Live Insights Icon" className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-medium text-white font-display">Live Insights</h3>
                    </div>
                    <p className="text-white mb-6 text-lg font-light font-body">
                      Real-time dashboards die je audit prestaties live volgen. Zie direct waar je staat en waar je naartoe gaat.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Real-time data</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Interactieve grafieken</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Custom dashboards</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeFeature === 1 && (
                <div className="rounded-xl shadow-2xl p-8 relative overflow-hidden" style={{ backgroundColor: '#8B8B8B' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-gray-900/40 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="p-4 rounded-xl mr-6" style={{ backgroundColor: '#000813' }}>
                        <Smartphone className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-medium text-white font-display">Mobiel Eerst</h3>
                    </div>
                    <p className="text-white mb-6 text-lg font-light font-body">
                      Audits uitvoeren waar je ook bent. Onze app werkt perfect op elke locatie, zelfs offline.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">iOS & Android apps</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Offline functionaliteit</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">GPS tracking</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeFeature === 2 && (
                <div className="rounded-xl shadow-2xl p-8 relative overflow-hidden" style={{ backgroundColor: '#8B8B8B' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-gray-900/40 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="p-4 rounded-xl mr-6" style={{ backgroundColor: '#000813' }}>
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-medium text-white font-display">Fort Knox Security</h3>
                    </div>
                    <p className="text-white mb-6 text-lg font-light font-body">
                      Je data is veiliger dan een bankkluis. Enterprise encryptie + GDPR = gemoedsrust.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">End-to-end encryptie</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">GDPR compliant</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">SOC 2 Type II</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeFeature === 3 && (
                <div className="rounded-xl shadow-2xl p-8 relative overflow-hidden" style={{ backgroundColor: '#8B8B8B' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-gray-900/40 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="p-4 rounded-xl mr-6" style={{ backgroundColor: '#000813' }}>
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-medium text-white font-display">5-Minuten Magic</h3>
                    </div>
                    <p className="text-white mb-6 text-lg font-light font-body">
                      Van idee tot werkend platform in 5 minuten. Geen IT-afdeling nodig, gewoon doen.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Snelle onboarding</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Geen technische kennis</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Direct gebruiksklaar</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeFeature === 4 && (
                <div className="rounded-xl shadow-2xl p-8 relative overflow-hidden" style={{ backgroundColor: '#8B8B8B' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-gray-900/40 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="p-4 rounded-xl mr-6" style={{ backgroundColor: '#000813' }}>
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-medium text-white font-display">Team Power</h3>
                    </div>
                    <p className="text-white mb-6 text-lg font-light font-body">
                      Samen sterker. Deel taken, volg progressie en werk als één geolied team.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Team management</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Task assignment</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">In-app messaging</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeFeature === 5 && (
                <div className="rounded-xl shadow-2xl p-8 relative overflow-hidden" style={{ backgroundColor: '#8B8B8B' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-gray-900/40 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="p-4 rounded-xl mr-6" style={{ backgroundColor: '#000813' }}>
                        <Globe className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-medium text-white font-display">Global Reach</h3>
                    </div>
                    <p className="text-white mb-6 text-lg font-light font-body">
                      Beheer 1 locatie of 1000. Alles vanuit één dashboard, overal ter wereld.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Onbeperkte schaalbaarheid</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Multi-locatie support</span>
                      </li>
                      <li className="flex items-center text-white">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-body">Enterprise ready</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16" style={{ backgroundColor: '#f6f1eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6 font-display" style={{ color: '#132938' }}>
              Kies je perfecte plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 font-light font-body">
              Van startup tot enterprise - we hebben het juiste plan voor elke organisatie
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-lg font-medium transition-colors font-body ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
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
              <span className={`text-lg font-medium transition-colors font-body ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
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
                <h3 className="text-2xl font-medium mb-2 font-display" style={{ color: '#132938' }}>Starter</h3>
                <p className="text-gray-600 mb-4 font-light font-body">Perfect voor kleine teams en startups</p>
                <div className="mb-6">
                  <span className="text-4xl font-light font-display" style={{ color: '#132938' }}>€{getPrice(29)}</span>
                  <span className="text-gray-600 font-light font-body">{getBillingText()}</span>
                  {isYearly && <div className="text-sm text-green-600 font-medium font-body">Bespaar €{Math.round(29 * 12 * 0.2)} per jaar</div>}
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
                  <span className="h-4 w-4 mr-3 flex-shrink-0">×</span>
                  Geen custom branding
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <span className="h-4 w-4 mr-3 flex-shrink-0">×</span>
                  Geen API toegang
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <span className="h-4 w-4 mr-3 flex-shrink-0">×</span>
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
                <h3 className="text-2xl font-medium mb-2 font-display" style={{ color: '#132938' }}>Professional</h3>
                <p className="text-gray-600 mb-4 font-light font-body">Ideaal voor groeiende bedrijven</p>
                <div className="mb-6">
                  <span className="text-4xl font-light font-display" style={{ color: '#132938' }}>€{getPrice(99)}</span>
                  <span className="text-gray-600 font-light font-body">{getBillingText()}</span>
                  {isYearly && <div className="text-sm text-green-600 font-medium font-body">Bespaar €{Math.round(99 * 12 * 0.2)} per jaar</div>}
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
                  <span className="h-4 w-4 mr-3 flex-shrink-0">×</span>
                  Geen API toegang
                </li>
                <li className="flex items-center text-sm text-gray-500">
                  <span className="h-4 w-4 mr-3 flex-shrink-0">×</span>
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
                <h3 className="text-2xl font-medium mb-2 font-display" style={{ color: '#132938' }}>Enterprise</h3>
                <p className="text-gray-600 mb-4 font-light font-body">Voor grote organisaties</p>
                <div className="mb-6">
                  <span className="text-4xl font-light font-display" style={{ color: '#132938' }}>€{getPrice(299)}</span>
                  <span className="text-gray-600 font-light font-body">{getBillingText()}</span>
                  {isYearly && <div className="text-sm text-green-600 font-medium font-body">Bespaar €{Math.round(299 * 12 * 0.2)} per jaar</div>}
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

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: '#f6f1eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6 font-display" style={{ color: '#132938' }}>
            Klaar om te beginnen?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-light font-body">
            Start vandaag nog met je gratis trial en ontdek hoe AuditFlow je audit processen kan transformeren.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/onboarding')}
              className="text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors flex items-center justify-center hover:opacity-90 font-body"
              style={{ backgroundColor: '#132938' }}
            >
              Start Gratis Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => router.push('/info/contact')}
              className="border-2 px-8 py-4 rounded-lg text-lg font-medium transition-colors font-body"
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
                  <h3 className="text-lg font-light text-white font-display">AuditFlow</h3>
                  <p className="text-sm text-white font-light font-body">INTERNAL AUDITS</p>
                </div>
              </div>
              <p className="text-white font-light font-body">
                Het meest complete audit platform voor moderne bedrijven.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4 font-display">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/info/features')} className="hover:text-white">Features</button></li>
                <li><button onClick={() => router.push('/info/pricing')} className="hover:text-white">Pricing</button></li>
                <li><button onClick={() => router.push('/info/demo')} className="hover:text-white">Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 font-display">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/info/documentatie')} className="hover:text-white">Documentatie</button></li>
                <li><button onClick={() => router.push('/info/help-center')} className="hover:text-white">Help Center</button></li>
                <li><button onClick={() => router.push('/info/contact')} className="hover:text-white">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 font-display">Bedrijf</h4>
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