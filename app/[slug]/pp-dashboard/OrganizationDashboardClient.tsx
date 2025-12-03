'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Organization {
  id: string
  name: string
  slug: string
  tier: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'suspended' | 'cancelled'
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  primary_font: string
  accent_font: string
  logo_url?: string
  favicon_url?: string
  max_users: number
  max_filialen: number
  max_audits_per_month: number
}

interface OrganizationDashboardClientProps {
  slug: string
}

export default function OrganizationDashboardClient({ slug }: OrganizationDashboardClientProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrganization = async () => {
      if (!slug) {
        setError('Organization slug niet gevonden')
        setLoading(false)
        return
      }

      try {
        // Simulate API call to get organization data
        // In real implementation, this would call your Supabase API
        const mockOrganization: Organization = {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Poule & Poulette',
          slug: slug,
          tier: 'enterprise',
          status: 'active',
          primary_color: '#1C3834',
          secondary_color: '#93231F',
          accent_color: '#F495BD',
          background_color: '#FBFBF1',
          text_color: '#060709',
          primary_font: 'Lino Stamp',
          accent_font: 'Bacon Kingdom',
          max_users: 100,
          max_filialen: 50,
          max_audits_per_month: 1000
        }

        // Validate that user has access to this organization
        if (user?.organization_id !== mockOrganization.id) {
          setError('Geen toegang tot deze organization')
          setLoading(false)
          return
        }

        setOrganization(mockOrganization)
        
        // Apply organization branding
        applyOrganizationBranding(mockOrganization)
        
      } catch (err) {
        console.error('Error loading organization:', err)
        setError('Fout bij het laden van organization data')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      loadOrganization()
    }
  }, [slug, user, authLoading])

  const applyOrganizationBranding = (org: Organization) => {
    // Apply CSS custom properties for organization branding
    const root = document.documentElement
    root.style.setProperty('--org-primary-color', org.primary_color)
    root.style.setProperty('--org-secondary-color', org.secondary_color)
    root.style.setProperty('--org-accent-color', org.accent_color)
    root.style.setProperty('--org-background-color', org.background_color)
    root.style.setProperty('--org-text-color', org.text_color)
    root.style.setProperty('--org-primary-font', org.primary_font)
    root.style.setProperty('--org-accent-font', org.accent_font)

    // Update page title
    document.title = `${org.name} - Audit Dashboard`

    // Update favicon if available
    if (org.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (favicon) {
        favicon.href = org.favicon_url
      }
    }
  }

  const handleNavigation = (path: string) => {
    router.push(`/${slug}${path}`)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: organization?.background_color || '#FBFBF1' }}>
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4" style={{ color: organization?.text_color || '#060709' }}>
            Laden...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Fout</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/landing')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Terug naar homepage
          </button>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Organization niet gevonden</h1>
          <button
            onClick={() => router.push('/landing')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Terug naar homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: organization.background_color,
        color: organization.text_color,
        fontFamily: organization.primary_font
      }}
    >
      {/* Header */}
      <header className="border-b" style={{ borderColor: organization.accent_color + '20' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {organization.logo_url ? (
                <img 
                  src={organization.logo_url} 
                  alt={organization.name}
                  className="h-8 w-auto mr-3"
                />
              ) : (
                <div 
                  className="h-8 w-8 rounded mr-3 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: organization.primary_color }}
                >
                  {organization.name.charAt(0)}
                </div>
              )}
              <h1 
                className="text-xl font-bold"
                style={{ fontFamily: organization.accent_font }}
              >
                {organization.name}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm px-2 py-1 rounded-full" style={{ 
                backgroundColor: organization.accent_color + '20',
                color: organization.accent_color 
              }}>
                {organization.tier.toUpperCase()}
              </span>
              <button
                onClick={() => router.push('/landing')}
                className="text-sm hover:underline"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="py-4 px-1 border-b-2 font-medium text-sm"
              style={{ 
                borderColor: organization.primary_color,
                color: organization.primary_color
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigation('/audits')}
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              Audits
            </button>
            <button
              onClick={() => handleNavigation('/filialen')}
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              Filialen
            </button>
            <button
              onClick={() => handleNavigation('/acties')}
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              Acties
            </button>
            <button
              onClick={() => handleNavigation('/rapporten')}
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              Rapporten
            </button>
            <button
              onClick={() => handleNavigation('/instellingen')}
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              Instellingen
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: organization.accent_font }}
          >
            Welkom terug, {user?.naam}!
          </h2>
          <p className="text-gray-600">
            Hier is een overzicht van je audit activiteiten.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: organization.primary_color + '20' }}
              >
                <div 
                  className="w-6 h-6"
                  style={{ backgroundColor: organization.primary_color }}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Audits</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: organization.secondary_color + '20' }}
              >
                <div 
                  className="w-6 h-6"
                  style={{ backgroundColor: organization.secondary_color }}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actieve Filialen</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: organization.accent_color + '20' }}
              >
                <div 
                  className="w-6 h-6"
                  style={{ backgroundColor: organization.accent_color }}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Openstaande Acties</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <div className="w-6 h-6 bg-green-600 rounded" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gemiddelde Score</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Recente Activiteit</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium">Nieuwe audit voltooid</p>
                  <p className="text-sm text-gray-600">Filiaal Centrum - Score: 92%</p>
                </div>
                <span className="text-sm text-gray-500">2 uur geleden</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium">Actie voltooid</p>
                  <p className="text-sm text-gray-600">Schoonmaak routine verbeterd</p>
                </div>
                <span className="text-sm text-gray-500">4 uur geleden</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Rapport verstuurd</p>
                  <p className="text-sm text-gray-600">Maandelijkse samenvatting naar management</p>
                </div>
                <span className="text-sm text-gray-500">1 dag geleden</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


