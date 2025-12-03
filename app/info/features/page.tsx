'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTranslation } from '@/lib/translation'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { 
  ArrowRight, 
  Check, 
  BarChart3,
  Smartphone,
  Shield,
  Users,
  Clock,
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
  Zap,
  Globe,
  Headphones,
  Star,
  Award,
  CheckCircle,
  ArrowUpRight,
  Layers,
  Workflow,
  GitBranch,
  Cloud,
  Server,
  Wifi,
  WifiOff
} from 'lucide-react'

export default function FeaturesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { t } = useTranslation()

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
              AuditFlow Features
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white">
              Ontdek alle krachtige features die AuditFlow tot het meest complete audit platform maken
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

      {/* Core Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#132938' }}>
              Kern Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Alles wat je nodig hebt voor perfecte audits, van planning tot rapportage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Live Dashboard */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Live Dashboard</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Real-time inzichten in je audit prestaties met interactieve grafieken en KPI's.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Real-time data updates
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Interactieve grafieken
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Custom dashboards
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Export mogelijkheden
                </li>
              </ul>
            </div>

            {/* Mobile First */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Mobiel Eerst</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Voer audits uit waar je ook bent met onze native iOS en Android apps.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  iOS & Android apps
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Offline functionaliteit
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  GPS tracking
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Foto uploads
                </li>
              </ul>
            </div>

            {/* Enterprise Security */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Enterprise Security</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Je data is veiliger dan een bankkluis met enterprise-grade beveiliging.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  End-to-end encryptie
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  GDPR compliant
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  SOC 2 Type II
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  256-bit encryptie
                </li>
              </ul>
            </div>

            {/* Quick Setup */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">5-Minuten Magic</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Van idee tot werkend platform in 5 minuten. Geen IT-afdeling nodig.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Snelle onboarding
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Geen technische kennis
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Direct gebruiksklaar
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Template library
                </li>
              </ul>
            </div>

            {/* Team Power */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Team Power</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Werk samen als één team met real-time samenwerking en taakbeheer.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Team management
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Task assignment
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  In-app messaging
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Progress tracking
                </li>
              </ul>
            </div>

            {/* Global Reach */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Global Reach</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Onbeperkte schaalbaarheid voor organisaties van elke grootte.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Onbeperkte schaalbaarheid
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Multi-locatie support
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Enterprise ready
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Cloud infrastructure
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16" style={{ backgroundColor: '#f6f1eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#132938' }}>
              Geavanceerde Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Krachtige tools voor professionele audit teams en enterprise organisaties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Advanced Reporting */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Geavanceerde Rapportage</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Genereer professionele rapporten met één klik en deel ze automatisch met stakeholders.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Automatische rapport generatie
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Custom templates en branding
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  PDF, Excel en Word export
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Automatische email distributie
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Compliance tracking
                </li>
              </ul>
            </div>

            {/* Photo Management */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Foto Management</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Voeg foto's toe aan je audits voor complete documentatie en bewijs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Onbeperkte foto opslag
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Automatische compressie
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  GPS metadata tracking
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Foto annotaties
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Bulk upload functionaliteit
                </li>
              </ul>
            </div>

            {/* Workflow Automation */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <Workflow className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Workflow Automatisering</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Automatiseer repetitieve taken en stroomlijn je audit processen.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Automatische taak toewijzing
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Escalatie workflows
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Deadline herinneringen
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Status updates
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Custom triggers
                </li>
              </ul>
            </div>

            {/* API & Integrations */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <GitBranch className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">API & Integraties</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Koppel AuditFlow aan je bestaande systemen en tools.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  RESTful API
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Webhook support
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  ERP integraties
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  SSO authenticatie
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Custom connectors
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#132938' }}>
              Enterprise Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Krachtige tools voor grote organisaties en enterprise klanten
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* White Label */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="p-3 rounded-lg mx-auto mb-4 w-fit" style={{ backgroundColor: '#132938' }}>
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">White Label</h3>
              <p className="text-gray-600 text-sm">Volledige custom branding en white-label oplossing</p>
            </div>

            {/* Dedicated Support */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="p-3 rounded-lg mx-auto mb-4 w-fit" style={{ backgroundColor: '#132938' }}>
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Premium support met dedicated account manager</p>
            </div>

            {/* Advanced Analytics */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="p-3 rounded-lg mx-auto mb-4 w-fit" style={{ backgroundColor: '#132938' }}>
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 text-sm">Diepgaande inzichten en predictive analytics</p>
            </div>

            {/* Custom Workflows */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="p-3 rounded-lg mx-auto mb-4 w-fit" style={{ backgroundColor: '#132938' }}>
                <Layers className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Custom Workflows</h3>
              <p className="text-gray-600 text-sm">Aangepaste processen en workflows</p>
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
            Start vandaag nog met je gratis trial en ontdek alle krachtige features van AuditFlow.
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


