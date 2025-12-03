'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { DashboardHeader } from './DashboardHeader'
import { KPICards } from './KPICards'
import { AuditList } from './AuditList'
import { FiliaalSelector } from './FiliaalSelector'
// import { DashboardFilters } from './DashboardFilters'
import { MobileNavigation } from './MobileNavigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import { Card, CardHeader } from '@/components/ui/Card'
import { Filiaal, Audit, KPIData } from '@/types'
import { clientDataService } from '@/lib/client-data'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [filialen, setFilialen] = useState<Filiaal[]>([])
  const [selectedFiliaal, setSelectedFiliaal] = useState<string>('')
  const [audits, setAudits] = useState<Audit[]>([])
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    datum_van: '',
    datum_tot: '',
    score_min: '',
    score_max: '',
    status: ''
  })

  useEffect(() => {
    if (user) {
      loadFilialen()
    }
  }, [user])

  useEffect(() => {
    if (selectedFiliaal) {
      loadAudits()
      loadKPIData()
    }
  }, [selectedFiliaal, filters])

  // Refresh data when component becomes visible (e.g., after returning from audit creation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && selectedFiliaal) {
        loadAudits()
        loadKPIData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [selectedFiliaal])

  const loadFilialen = async () => {
    try {
      setLoading(true)
      
      // Use client data service (Supabase)
      const data = await clientDataService.getFilialen()
      setFilialen(data)
      if (data.length > 0) {
        // For admin and management users, default to "all" filialen, otherwise first filiaal
        if (user?.rol === 'admin' || user?.rol === 'inspector') {
          setSelectedFiliaal('all')
        } else {
          setSelectedFiliaal(data[0].id)
        }
      }
    } catch (err) {
      setError('Fout bij het laden van filialen')
      console.error('Error loading filialen:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadAudits = async () => {
    try {
      // Use client data service (Supabase)
      let filteredAudits = await clientDataService.getAudits({
        filiaalId: selectedFiliaal === 'all' ? undefined : selectedFiliaal
      })
      
      // Apply filters
      if (filters.datum_van) {
        filteredAudits = filteredAudits.filter(audit => audit.audit_datum >= filters.datum_van)
      }
      if (filters.datum_tot) {
        filteredAudits = filteredAudits.filter(audit => audit.audit_datum <= filters.datum_tot)
      }
      if (filters.score_min) {
        filteredAudits = filteredAudits.filter(audit => audit.totale_score >= parseFloat(filters.score_min))
      }
      if (filters.score_max) {
        filteredAudits = filteredAudits.filter(audit => audit.totale_score <= parseFloat(filters.score_max))
      }
      if (filters.status) {
        if (filters.status === 'pass') {
          filteredAudits = filteredAudits.filter(audit => audit.pass_percentage >= 80)
        } else if (filters.status === 'fail') {
          filteredAudits = filteredAudits.filter(audit => audit.pass_percentage < 80)
        }
      }
      
      setAudits(filteredAudits)
    } catch (err) {
      setError('Fout bij het laden van audits')
      console.error('Error loading audits:', err)
    }
  }

  const loadKPIData = async () => {
    try {
      // Use client data service (Supabase)
      const kpiData = await clientDataService.getKPIData(selectedFiliaal === 'all' ? undefined : selectedFiliaal)
      setKpiData(kpiData)
    } catch (err) {
      console.error('Error loading KPI data:', err)
    }
  }

  const handleFiliaalChange = (filiaalId: string) => {
    setSelectedFiliaal(filiaalId)
  }

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  if (loading) {
    return <LoadingSpinner />
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

  const selectedFiliaalData = selectedFiliaal === 'all' ? null : filialen.find(f => f.id === selectedFiliaal)

  return (
    <div className="min-h-screen bg-ppwhite">
      <DashboardHeader user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
        {/* Title Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="text-center">
              <h1 className="text-3xl font-lino-caps text-ppblack mb-2">Dashboard</h1>
              <p className="text-olive font-lino">Overzicht van alle audit activiteiten</p>
            </div>
          </CardHeader>
        </Card>

        <div className="mb-8">
          <FiliaalSelector
            filialen={filialen}
            selectedFiliaal={selectedFiliaal}
            onFiliaalChange={handleFiliaalChange}
            userRole={user?.rol}
          />
        </div>

        <div className="mb-8">
          <KPICards
            kpiData={kpiData}
            filiaalNaam={selectedFiliaal === 'all' ? 'Alle Filialen' : selectedFiliaalData?.naam || ''}
          />
        </div>

        <div className="mb-20">
          <AuditList
            audits={audits}
            filiaalId={selectedFiliaal}
            onAuditDeleted={() => {
              loadAudits()
              loadKPIData()
            }}
          />
        </div>
      </main>

      <MobileNavigation filiaalId={selectedFiliaal} />
    </div>
  )
}
