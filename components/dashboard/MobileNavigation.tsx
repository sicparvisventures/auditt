'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { 
  Home, 
  ClipboardList, 
  BarChart3, 
  Settings,
  Plus,
  CheckSquare,
  Database
} from 'lucide-react'

interface MobileNavigationProps {
  filiaalId?: string
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ filiaalId }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const getNavItems = () => {
    // Role-specific navigation
    if (user?.rol === 'admin') {
      // Admin sees everything
      return [
        {
          name: 'Dashboard',
          href: '/pp-dashboard',
          icon: Home,
          active: pathname.startsWith('/pp-dashboard')
        },
        {
          name: 'Audits',
          href: '/audits',
          icon: ClipboardList,
          active: pathname.startsWith('/audits')
        },
        {
          name: 'Acties',
          href: '/acties',
          icon: CheckSquare,
          active: pathname.startsWith('/acties')
        },
        {
          name: 'Rapporten',
          href: '/rapporten',
          icon: BarChart3,
          active: pathname.startsWith('/rapporten')
        },
        {
          name: 'Instellingen',
          href: '/instellingen',
          icon: Settings,
          active: pathname.startsWith('/instellingen')
        }
      ]
    } else if (user?.rol === 'inspector') {
      // Manager, COO, and District Manager see audits, actions, and reports
      return [
        {
          name: 'Audits',
          href: '/audits',
          icon: ClipboardList,
          active: pathname.startsWith('/audits')
        },
        {
          name: 'Acties',
          href: '/acties',
          icon: CheckSquare,
          active: pathname.startsWith('/acties')
        },
        {
          name: 'Rapporten',
          href: '/rapporten',
          icon: BarChart3,
          active: pathname.startsWith('/rapporten')
        }
      ]
       } else if (user?.rol === 'storemanager') {
      // User and Filiaal Manager see actions and reports
      return [
        {
          name: 'Acties',
          href: '/acties',
          icon: CheckSquare,
          active: pathname.startsWith('/acties')
        },
        {
          name: 'Rapporten',
          href: '/rapporten',
          icon: BarChart3,
          active: pathname.startsWith('/rapporten')
        }
      ]
    } else if (user?.rol === 'developer') {
      // Developer sees test-db and all other functionality
      return [
        {
          name: 'Test DB',
          href: '/test-db',
          icon: Database,
          active: pathname.startsWith('/test-db')
        },
        {
          name: 'Dashboard',
          href: '/pp-dashboard',
          icon: Home,
          active: pathname.startsWith('/pp-dashboard')
        },
        {
          name: 'Audits',
          href: '/audits',
          icon: ClipboardList,
          active: pathname.startsWith('/audits')
        },
        {
          name: 'Acties',
          href: '/acties',
          icon: CheckSquare,
          active: pathname.startsWith('/acties')
        },
        {
          name: 'Rapporten',
          href: '/rapporten',
          icon: BarChart3,
          active: pathname.startsWith('/rapporten')
        }
      ]
    }

    // Default fallback
    return []
  }

  const navItems = getNavItems()

  const handleNewAudit = () => {
    if (filiaalId && filiaalId !== 'all') {
      router.push(`/audits/new?filiaal=${filiaalId}`)
    } else {
      router.push('/audits/new')
    }
  }

  const canCreateAudit = user?.rol === 'admin' || user?.rol === 'inspector' || user?.rol === 'developer'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-ppwhite border-t border-primary-200 px-4 py-4 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center py-3 px-4 transition-colors duration-200 min-h-[64px] ${
                item.active 
                  ? 'bg-olive text-ppwhite' 
                  : 'text-primary-600 hover:text-olive hover:bg-creme'
              }`}
              style={{ borderRadius: 0 }}
            >
              <Icon className={`h-6 w-6 transition-colors duration-200 ${
                item.active ? 'text-ppwhite' : 'text-primary-600'
              }`} />
              <span className={`text-sm font-medium transition-colors duration-200 hidden sm:block ${
                item.active ? 'text-ppwhite' : 'text-primary-600'
              }`}>
                {item.name}
              </span>
            </button>
          )
        })}
        
        {canCreateAudit && (
          <button
            onClick={handleNewAudit}
            className="flex flex-col items-center justify-center py-3 px-4 transition-colors duration-200 bg-olive text-ppwhite hover:bg-christmas min-h-[64px]"
            style={{ borderRadius: 0 }}
          >
            <Plus className="h-6 w-6 transition-colors duration-200" />
            <span className="text-sm font-medium transition-colors duration-200 hidden sm:block">
              Audit
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
