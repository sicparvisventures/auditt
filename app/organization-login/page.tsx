'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, ArrowRight, Users, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function OrganizationLoginPage() {
  const router = useRouter()
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [loading, setLoading] = useState(false)

  const [organizations, setOrganizations] = useState([
    {
      id: 'pp',
      name: 'Poule & Poulette',
      slug: 'pp',
      description: 'Interne audit tool voor Poule & Poulette filialen',
      logo: '🐔',
      color: '#1C3834',
      tier: 'enterprise'
    }
    // Hier komen toekomstige organizations na onboarding
  ])

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        console.log('Loading organizations from database...')
        
        // First check if the function exists by trying to call it
        const { data, error } = await supabase.rpc('get_active_organizations')
        
        if (error) {
          console.error('Database function error:', error.message)
          // If function doesn't exist, use default organizations silently
          if (error.message.includes('Could not find the function')) {
            console.log('Database function not found, using default organizations')
            return
          }
          // For other errors, also use defaults silently
          console.log('Database error, using default organizations')
          return
        }
        
        console.log('Organizations loaded successfully:', data)
        
        if (data && data.length > 0) {
          const orgs = data.map((org: any) => ({
            id: org.id,
            name: org.name,
            slug: org.slug,
            description: `${org.tier || 'starter'} audit platform`,
            logo: org.name.charAt(0).toUpperCase(),
            color: org.primary_color || '#2563eb',
            tier: org.tier || 'starter'
          }))
          setOrganizations(orgs)
          console.log('Organizations updated from database:', orgs)
        } else {
          console.log('No organizations found in database, using default PP organization')
          // Keep default PP organization if no others found
        }
      } catch (error) {
        console.error('Unexpected error loading organizations:', error)
        // Don't show popup, just log error and use default organizations
        console.log('Using default organizations due to unexpected error')
      }
    }

    loadOrganizations()
  }, [])

  const handleOrganizationSelect = (orgSlug: string) => {
    setLoading(true)
    
    // Redirect naar organization-specific login
    if (orgSlug === 'pp') {
      // Voor PP gebruikers, redirect naar de PP-specifieke login
      router.push('/pp-login')
    } else {
      // Voor andere organizations, redirect naar hun eigen login
      router.push(`/${orgSlug}/login`)
    }
  }

  const handleCreateNew = () => {
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f6f1eb' }}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f6f1eb' }}>
            <img 
              src="/audit.png" 
              alt="Audit Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Kies je organisatie
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Selecteer je organisatie om in te loggen op je audit platform
          </p>
        </div>

        {/* Organization Selection */}
        <div className="space-y-4">
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => handleOrganizationSelect(org.slug)}
              disabled={loading}
              className="w-full p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 text-left group"
              style={{ '--hover-border-color': '#132938' } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#132938'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div className="flex items-center space-x-4">
                <div 
                  className={`w-12 h-12 flex items-center justify-center ${org.slug === 'pp' ? '' : 'rounded-lg'}`}
                  style={{ backgroundColor: org.slug === 'pp' ? '#000000' : org.color + '20' }}
                >
                  {org.slug === 'pp' ? (
                    <img 
                      src="/logo_poule.png" 
                      alt="Poule & Poulette Logo" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl">{org.logo}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#132938]">
                    {org.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {org.description}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {org.tier.toUpperCase()}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#132938]" />
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500" style={{ backgroundColor: '#f6f1eb' }}>
              Of
            </span>
          </div>
        </div>

        {/* Create New Organization */}
        <button
          onClick={handleCreateNew}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white transition-colors"
          style={{ backgroundColor: '#132938' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f1f2e'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#132938'}
        >
          <img 
            src="/nobg.png" 
            alt="New Organization" 
            className="w-4 h-4 mr-2 object-contain"
          />
          Nieuwe organisatie aanmaken
        </button>


        {/* Back to Landing */}
        <div className="text-center">
          <button
            onClick={() => router.push('/landing')}
            className="text-sm transition-colors"
            style={{ color: '#132938' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0f1f2e'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#132938'}
          >
            ← Terug naar homepage
          </button>
        </div>
      </div>
    </div>
  )
}
