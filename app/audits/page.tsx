'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Audits } from '@/components/audits/Audits'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AuditsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/pp-login')
       } else if (user.rol === 'storemanager') {
        // Users cannot access audits, redirect to reports
        router.push('/rapporten')
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

  return <Audits />
}
