'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { AuditDetail } from '@/components/audit/AuditDetail'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import { AuditWithDetails } from '@/types'
import { clientDataService } from '@/lib/client-data'

interface AuditDetailClientProps {
  params: {
    id: string
  }
}

export default function AuditDetailClient({ params }: AuditDetailClientProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [audit, setAudit] = useState<AuditWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/pp-login')
      } else if (user.rol === 'manager') {
        // Users cannot access audits, redirect to reports
        router.push('/rapporten')
      } else {
        loadAudit()
      }
    }
  }, [user, authLoading, router, params.id])

  const loadAudit = async () => {
    try {
      setLoading(true)
      setError('')
      
      const auditData = await clientDataService.getAuditById(params.id)
      
      if (!auditData) {
        setError('Audit niet gevonden')
        return
      }

      // Get audit results
      const results = await clientDataService.getAuditResults(params.id)
      
      // Transform to AuditWithDetails format
      const auditWithDetails: AuditWithDetails = {
        ...auditData,
        resultaten: results
      }

      setAudit(auditWithDetails)
    } catch (err) {
      console.error('Error loading audit:', err)
      setError('Fout bij het laden van de audit')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="error">
            {error}
          </Alert>
        </div>
      </div>
    )
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="error">
            Audit niet gevonden
          </Alert>
        </div>
      </div>
    )
  }

  return <AuditDetail audit={audit} />
}
