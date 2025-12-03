'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { clientDataService } from '@/lib/client-data'
import { AuthUser } from '@/lib/auth'
import { Gebruiker } from '@/types'

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

interface AuthContextType {
  user: AuthUser | null
  organization: Organization | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (userId: string) => Promise<{ success: boolean; error?: string }>
  updateUser: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>
  loadOrganization: (organizationId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🚀 AuthProvider useEffect started')
    
    // Immediate timeout to prevent hanging
    const forceStopLoading = setTimeout(() => {
      console.log('⚠️ FORCE STOPPING LOADING - taking too long')
      setLoading(false)
    }, 100)

    // Check for existing session in localStorage
    const checkExistingSession = () => {
      try {
        console.log('🔍 Quick localStorage check...')
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
          console.log('🌐 Server-side rendering detected')
          return
        }

        const savedUser = localStorage.getItem('audit_user')
        const savedOrganization = localStorage.getItem('audit_organization')
        
        console.log('📦 Saved user:', savedUser ? 'FOUND' : 'NOT FOUND')
        console.log('📦 Saved organization:', savedOrganization ? 'FOUND' : 'NOT FOUND')
        
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser)
            console.log('👤 User loaded:', user.naam, user.rol)
            setUser(user)
            
            // Load organization if available
            if (savedOrganization) {
              const org = JSON.parse(savedOrganization)
              console.log('🏢 Organization loaded:', org.name)
              setOrganization(org)
              applyOrganizationBranding(org)
            } else if (user.organization_id) {
              // Load organization from user data
              loadOrganization(user.organization_id)
            }
          } catch (error) {
            console.error('❌ Invalid user data, clearing...')
            localStorage.removeItem('audit_user')
            localStorage.removeItem('audit_organization')
          }
        }
      } catch (error) {
        console.error('❌ Error in auth check:', error)
      } finally {
        console.log('✅ Auth check complete, stopping loading')
        setLoading(false)
        clearTimeout(forceStopLoading)
      }
    }

    // Execute immediately
    checkExistingSession()

    // Cleanup
    return () => {
      clearTimeout(forceStopLoading)
    }
  }, [])

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

  const loadOrganization = async (organizationId: string) => {
    try {
      // In real implementation, this would call your Supabase API
      // For now, we'll use mock data
      const mockOrganization: Organization = {
        id: organizationId,
        name: 'Poule & Poulette',
        slug: 'pp',
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

      setOrganization(mockOrganization)
      applyOrganizationBranding(mockOrganization)
      
      // Save to localStorage
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('audit_organization', JSON.stringify(mockOrganization))
      }
    } catch (error) {
      console.error('Error loading organization:', error)
    }
  }

  const signIn = async (userId: string) => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return { success: false, error: 'Server-side rendering not supported' }
      }

      // First try to get user from database (this will have the latest profile data)
      const dbUser = await clientDataService.getUserByEmail(userId)
      
      if (dbUser) {
        // Convert database user to AuthUser format
        const authUser: AuthUser = {
          id: dbUser.id,
          user_id: dbUser.email, // email field contains the user_id
          naam: dbUser.naam,
          rol: dbUser.rol,
          telefoon: dbUser.telefoon,
          actief: dbUser.actief,
          created_at: dbUser.created_at,
          updated_at: dbUser.updated_at,
          organization_id: dbUser.organization_id
        }

        if (!authUser.actief) {
          return { success: false, error: 'Account is gedeactiveerd' }
        }

        // Set user and save to localStorage
        setUser(authUser)
        localStorage.setItem('audit_user', JSON.stringify(authUser))
        
        // Load organization if user has one
        if (authUser.organization_id) {
          await loadOrganization(authUser.organization_id)
        }
        
        return { success: true }
      }

      // Fallback to hardcoded users if not found in database
      const hardcodedUsers = {
        'ADMIN': {
          id: '00000000-0000-0000-0000-000000000001',
          user_id: 'ADMIN',
          naam: 'Admin User',
          rol: 'admin' as const,
          telefoon: '+32 123 456 789',
          actief: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          organization_id: '00000000-0000-0000-0000-000000000001'
        },
        'MAN01': {
          id: '00000000-0000-0000-0000-000000000002',
          user_id: 'MAN01',
          naam: 'COO Manager',
          rol: 'coo' as const,
          telefoon: '+32 123 456 790',
          actief: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          organization_id: '00000000-0000-0000-0000-000000000001'
        },
        'MAN02': {
          id: '00000000-0000-0000-0000-000000000003',
          user_id: 'MAN02',
          naam: 'Inspector',
          rol: 'inspector' as const,
          telefoon: '+32 123 456 791',
          actief: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          organization_id: '00000000-0000-0000-0000-000000000001'
        },
       'USER1': {
         id: '00000000-0000-0000-0000-000000000004',
         user_id: 'USER1',
         naam: 'Store Manager',
         rol: 'storemanager' as any,
         telefoon: '+32 123 456 792',
         actief: true,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         organization_id: '00000000-0000-0000-0000-000000000001'
       },
       'DIET': {
         id: '00000000-0000-0000-0000-000000000005',
         user_id: 'DIET',
         naam: 'Dietmar Lattré',
         rol: 'developer' as const,
         telefoon: '+32 123 456 793',
         actief: true,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         organization_id: '00000000-0000-0000-0000-000000000001'
       }
      }

      // Check if user exists in hardcoded users
      const user = hardcodedUsers[userId as keyof typeof hardcodedUsers]
      if (!user) {
        return { success: false, error: 'User ID niet gevonden' }
      }

      if (!user.actief) {
        return { success: false, error: 'Account is gedeactiveerd' }
      }

      // Set user and save to localStorage
      setUser(user)
      localStorage.setItem('audit_user', JSON.stringify(user))
      
      // Load organization
      if (user.organization_id) {
        await loadOrganization(user.organization_id)
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Er is een fout opgetreden bij het inloggen' }
    }
  }

  const signOut = async () => {
    setUser(null)
    setOrganization(null)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('audit_user')
      localStorage.removeItem('audit_organization')
    }
  }

  const updateUser = async (updates: Partial<AuthUser>) => {
    try {
      console.log('🔄 updateUser called with updates:', updates)
      
      if (!user) {
        console.log('❌ No user logged in')
        return { success: false, error: 'Geen gebruiker ingelogd' }
      }

      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return { success: false, error: 'Server-side rendering not supported' }
      }

      console.log('👤 Current user:', user)
      console.log('🔍 Updating user in database with ID:', user.id)

      // Update user in local database
      const updatedUser = await clientDataService.updateUser(user.id, updates)
      console.log('💾 Database update result:', updatedUser)
      
      if (!updatedUser) {
        console.log('❌ User not found in database')
        return { success: false, error: 'Gebruiker niet gevonden' }
      }

      // Convert to AuthUser format
      const authUser: AuthUser = {
        id: updatedUser.id,
        user_id: updatedUser.email, // email field contains the user_id
        naam: updatedUser.naam,
        rol: updatedUser.rol,
        telefoon: updatedUser.telefoon,
        actief: updatedUser.actief,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
        organization_id: updatedUser.organization_id
      }

      console.log('✅ Converted to authUser:', authUser)
      console.log('💾 Updating localStorage...')

      // Update local state and localStorage
      setUser(authUser)
      localStorage.setItem('audit_user', JSON.stringify(authUser))
      
      console.log('✅ User updated successfully in both state and localStorage')

      return { success: true }
    } catch (error) {
      console.error('❌ Error updating user:', error)
      return { success: false, error: 'Er is een fout opgetreden bij het bijwerken van het profiel' }
    }
  }

  const value = {
    user,
    organization,
    loading,
    signOut,
    signIn,
    updateUser,
    loadOrganization
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
