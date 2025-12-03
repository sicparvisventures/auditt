'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🔍 Dashboard: loading =', loading, 'user =', user)
    if (!loading) {
      if (!user) {
        console.log('❌ Dashboard: No user, redirecting to login')
        router.push('/pp-login')
      } else if (user.rol !== 'admin') {
        console.log('❌ Dashboard: User is not admin, redirecting to audits')
        // Only admin can access dashboard
        router.push('/audits')
      } else {
        console.log('✅ Dashboard: User is admin, showing dashboard')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <Dashboard />
}
