'use client'

import React from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Building2, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  user?: any
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user: propUser }) => {
  const { user: authUser, signOut } = useAuth()
  const user = propUser || authUser
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/pp-login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getRoleDisplayName = (role: string | undefined) => {
    if (!role) return 'Onbekend'
    
    switch (role) {
      case 'admin':
        return 'Administrator'
      case 'coo':
        return 'COO'
      case 'district_manager':
        return 'District Manager'
      case 'filiaal_manager':
        return 'Filiaal Manager'
      case 'manager':
        return 'Manager'
      case 'user':
        return 'Gebruiker'
      default:
        return role.replace('_', ' ')
    }
  }

  return (
    <header className="bg-olive">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-8 flex items-center justify-center">
              <img src="/logo_poule.png" alt="Poule & Poulette Logo" className="h-8 w-auto max-w-full" />
            </div>
            <div className="flex items-center">
              <img src="/logo.svg" alt="Poule & Poulette" className="h-6 w-auto max-w-full" />
            </div>
          </div>

          {/* User info and actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-ppwhite">
                {user?.naam}
              </p>
              <p className="text-xs text-primary-200">
                {getRoleDisplayName(user?.rol)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSignOut}
                className="text-olive hover:text-ppwhite bg-ppwhite hover:bg-lollypop border-ppwhite"
                style={{ borderRadius: 0 }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-bacon uppercase">UITLOGGEN</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
