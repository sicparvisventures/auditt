'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTranslation } from '@/lib/translation'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { 
  ArrowRight, 
  Check, 
  Play,
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
  Phone
} from 'lucide-react'

export default function DemoPage() {
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
              AuditFlow Demo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white">
              Ontdek hoe AuditFlow je audit processen transformeert
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/onboarding')}
                className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center hover:opacity-90"
                style={{ backgroundColor: '#132938' }}
              >
                Start gratis trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#132938' }}>
              Zie AuditFlow in actie
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek de krachtige features die AuditFlow tot het meest complete audit platform maken
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dashboard Demo */}
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
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Audits deze maand</span>
                  <span className="text-lg font-bold" style={{ color: '#132938' }}>47</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Real-time updates
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

            {/* Mobile App Demo */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Mobiele App</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Voer audits uit waar je ook bent met onze native iOS en Android apps.
              </p>
              <div className="flex justify-center space-x-4 mb-4">
                <div className="bg-gray-900 rounded-lg p-2">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <div className="bg-gray-900 rounded-lg p-2">
                  <Tablet className="h-8 w-8 text-white" />
                </div>
              </div>
              <ul className="space-y-2">
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

            {/* Security Demo */}
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
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">End-to-end encryptie</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">SOC 2 Type II</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">GDPR compliant</span>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  256-bit encryptie
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Multi-factor authenticatie
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Audit logs
                </li>
              </ul>
            </div>

            {/* Team Collaboration */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Team Samenwerking</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Werk samen als één team met real-time samenwerking en taakbeheer.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">JD</span>
                  </div>
                  <span className="text-sm text-gray-700">Jan de Vries - Audit Manager</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">MS</span>
                  </div>
                  <span className="text-sm text-gray-700">Maria Santos - Auditor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">PK</span>
                  </div>
                  <span className="text-sm text-gray-700">Peter Klaassen - Supervisor</span>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Real-time messaging
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Taak toewijzing
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Progress tracking
                </li>
              </ul>
            </div>

            {/* Reporting Demo */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Geavanceerde Rapportage</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Genereer professionele rapporten met één klik en deel ze automatisch.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Rapporten deze maand</span>
                  <span className="text-lg font-bold" style={{ color: '#132938' }}>23</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-gray-600">HACCP Audit - Restaurant A</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-gray-600">Food Safety - Locatie B</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-3 w-3 text-purple-500" />
                    <span className="text-xs text-gray-600">Quality Check - Warehouse C</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Automatische generatie
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Custom templates
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  PDF export
                </li>
              </ul>
            </div>

            {/* Photo Management */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: '#132938' }}>
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Foto Management</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Voeg foto's toe aan je audits voor complete documentatie en bewijs.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-300 rounded h-12 flex items-center justify-center">
                    <Camera className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="bg-gray-300 rounded h-12 flex items-center justify-center">
                    <Camera className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="bg-gray-300 rounded h-12 flex items-center justify-center">
                    <Camera className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">3 foto's toegevoegd</p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Onbeperkte opslag
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Automatische compressie
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  GPS metadata
                </li>
              </ul>
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


