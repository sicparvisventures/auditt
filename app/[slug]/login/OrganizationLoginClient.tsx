'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { Building2, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Organization {
  id: string
  name: string
  slug: string
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  primary_font: string
  accent_font: string
  logo_url?: string
}

interface OrganizationLoginClientProps {
  slug: string
}

export default function OrganizationLoginClient({ slug }: OrganizationLoginClientProps) {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [organization, setOrganization] = useState<Organization | null>(null)
  const router = useRouter()
  const { signIn } = useAuth()

  useEffect(() => {
    const loadOrganization = async () => {
      if (!slug) {
        setError('Organization slug niet gevonden')
        return
      }

      try {
        // Load organization from Supabase
        const { data, error } = await supabase.rpc('get_organization_by_slug', {
          org_slug: slug
        })
        
        if (error) {
          console.error('Error loading organization:', error)
          setError('Fout bij het laden van organization data')
          return
        }
        
        if (!data || data.length === 0) {
          setError('Organization niet gevonden')
          return
        }
        
        const org = data[0]
        const organization: Organization = {
          id: org.id,
          name: org.name,
          slug: org.slug,
          primary_color: org.primary_color,
          secondary_color: org.secondary_color,
          accent_color: org.accent_color,
          background_color: org.background_color,
          text_color: org.text_color,
          primary_font: org.primary_font,
          accent_font: org.accent_font,
          logo_url: org.logo_url
        }

        setOrganization(organization)
        
        // Apply organization branding
        applyOrganizationBranding(organization)
        
      } catch (err) {
        console.error('Error loading organization:', err)
        setError('Fout bij het laden van organization data')
      }
    }

    loadOrganization()
  }, [slug])

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
    document.title = `${org.name} - Login`
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Authenticate user for this specific organization
      const { data, error } = await supabase.rpc('authenticate_user_for_organization', {
        user_email: userId,
        org_slug: slug
      })
      
      if (error) {
        console.error('Authentication error:', error)
        setError('Fout bij authenticatie')
        return
      }
      
      if (!data || data.length === 0) {
        setError('Gebruiker niet gevonden voor deze organization')
        return
      }
      
      const userData = data[0]
      
      // Create user session
      const authUser = {
        id: userData.user_id,
        user_id: userId,
        naam: userData.user_name,
        rol: userData.user_role,
        telefoon: userData.user_phone,
        actief: userData.user_active,
        organization_id: userData.org_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // Store in localStorage
      localStorage.setItem('audit_user', JSON.stringify(authUser))
      localStorage.setItem('audit_organization', JSON.stringify({
        id: userData.org_id,
        name: userData.org_name,
        slug: userData.org_slug,
        tier: userData.org_tier,
        primary_color: userData.org_primary_color,
        secondary_color: userData.org_secondary_color,
        accent_color: userData.org_accent_color,
        background_color: userData.org_background_color,
        text_color: userData.org_text_color,
        primary_font: userData.org_primary_font,
        accent_font: userData.org_accent_font
      }))
      
      // Redirect naar organization-specific dashboard
      router.push(`/${slug}/pp-dashboard`)
      router.refresh()
      
    } catch (err) {
      console.error('Login error:', err)
      setError('Er is een onverwachte fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderBottomColor: '#132938' }}></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: organization.background_color }}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {organization.logo_url ? (
              <img 
                src={organization.logo_url} 
                alt={organization.name}
                className="h-16 w-auto"
              />
            ) : (
              <div 
                className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: organization.primary_color }}
              >
                {organization.name.charAt(0)}
              </div>
            )}
          </div>
          
          <button
            onClick={() => router.push('/organization-login')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Terug naar organisatie selectie
          </button>
          
          <h2 
            className="text-3xl font-bold"
            style={{ 
              color: organization.text_color,
              fontFamily: organization.accent_font
            }}
          >
            {organization.name}
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: organization.text_color + '80' }}
          >
            Log in op je audit platform
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert type="error" message={error} />
            )}
            
            <div>
              <label 
                htmlFor="userId" 
                className="block text-sm font-medium mb-2"
                style={{ color: organization.text_color }}
              >
                Gebruikers ID
              </label>
              <Input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Voer je gebruikers ID in"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              style={{ 
                backgroundColor: organization.primary_color,
                borderColor: organization.primary_color
              }}
            >
              {loading ? 'Inloggen...' : 'Inloggen'}
            </Button>
          </form>

          {/* Demo Users */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 
              className="text-sm font-medium mb-3"
              style={{ color: organization.text_color }}
            >
              Demo gebruikers:
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setUserId(slug === 'pp' ? 'ADMIN' : `admin@${slug}.nl`)}
                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-50"
              >
                {slug === 'pp' ? 'ADMIN' : `admin@${slug}.nl`} - Admin User
              </button>
              <button
                onClick={() => setUserId(slug === 'pp' ? 'MAN01' : `manager@${slug}.nl`)}
                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-50"
              >
                {slug === 'pp' ? 'MAN01' : `manager@${slug}.nl`} - Manager
              </button>
              <button
                onClick={() => setUserId(slug === 'pp' ? 'MAN02' : `inspector@${slug}.nl`)}
                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-50"
              >
                {slug === 'pp' ? 'MAN02' : `inspector@${slug}.nl`} - Inspector
              </button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p 
            className="text-xs"
            style={{ color: organization.text_color + '60' }}
          >
            Powered by AuditFlow
          </p>
        </div>
      </div>
    </div>
  )
}


