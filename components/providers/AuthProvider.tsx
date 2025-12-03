'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { clientDataService } from '@/lib/client-data'
import { AuthUser } from '@/lib/auth'
import { Gebruiker } from '@/types'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (userId: string) => Promise<{ success: boolean; error?: string }>
  updateUser: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>
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
  const [loading, setLoading] = useState(true) // Start with true to show loading initially

  useEffect(() => {
    console.log('🚀 AuthProvider useEffect started')
    
    // Immediate timeout to prevent hanging
    const forceStopLoading = setTimeout(() => {
      console.log('⚠️ FORCE STOPPING LOADING - taking too long')
      setLoading(false)
    }, 100) // Very short timeout

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
        console.log('📦 Saved user:', savedUser ? 'FOUND' : 'NOT FOUND')
        
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser)
            console.log('👤 User loaded:', user.naam, user.rol)
            setUser(user)
          } catch (error) {
            console.error('❌ Invalid user data, clearing...')
            localStorage.removeItem('audit_user')
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
          updated_at: dbUser.updated_at
        }

        if (!authUser.actief) {
          return { success: false, error: 'Account is gedeactiveerd' }
        }

        // Set user and save to localStorage
        setUser(authUser)
        localStorage.setItem('audit_user', JSON.stringify(authUser))
        
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
          updated_at: new Date().toISOString()
        },
        'MAN01': {
          id: '00000000-0000-0000-0000-000000000002',
          user_id: 'MAN01',
          naam: 'COO Manager',
          rol: 'coo' as const,
          telefoon: '+32 123 456 790',
          actief: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        'MAN02': {
          id: '00000000-0000-0000-0000-000000000003',
          user_id: 'MAN02',
          naam: 'Inspector',
          rol: 'inspector' as const,
          telefoon: '+32 123 456 791',
          actief: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
       'USER1': {
         id: '00000000-0000-0000-0000-000000000004',
         user_id: 'USER1',
         naam: 'Store Manager',
         rol: 'storemanager' as any,
         telefoon: '+32 123 456 792',
         actief: true,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString()
       },
       'DIET': {
         id: '00000000-0000-0000-0000-000000000005',
         user_id: 'DIET',
         naam: 'Dietmar Lattré',
         rol: 'developer' as const,
         telefoon: '+32 123 456 793',
         actief: true,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString()
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
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Er is een fout opgetreden bij het inloggen' }
    }
  }

  const signOut = async () => {
    setUser(null)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('audit_user')
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
        updated_at: updatedUser.updated_at
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
    loading,
    signOut,
    signIn,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
