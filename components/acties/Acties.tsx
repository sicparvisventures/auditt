'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { FiliaalSelector } from '@/components/dashboard/FiliaalSelector'
import { MobileNavigation } from '@/components/dashboard/MobileNavigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import { ActionList } from './ActionList'
import { ActionFilters } from './ActionFilters'
import { Filiaal } from '@/types'
import { clientDataService } from '@/lib/client-data'

interface Action {
  id: string
  audit_id: string
  audit_resultaat_id: string
  titel: string
  beschrijving: string
  urgentie: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_progress' | 'completed' | 'verified'
  toegewezen_aan: string | null
  deadline: string | null
  actie_onderneem: string | null
  foto_urls: string[]
  voltooid_door: string | null
  voltooid_op: string | null
  geverifieerd_door: string | null
  geverifieerd_op: string | null
  verificatie_opmerkingen: string | null
  created_at: string
  updated_at: string
  // Joined data
  audit?: {
    id: string
    filiaal_id: string
    audit_datum: string
    totale_score: number
    pass_percentage: number
    filialen?: {
      naam: string
      locatie: string
    }
  }
  audit_resultaat?: {
    checklist_item_id: string
    resultaat: 'ok' | 'niet_ok'
    score: number
    opmerkingen: string | null
    verbeterpunt: string | null
    audit_checklist_items?: {
      categorie: string
      titel: string
      beschrijving: string
      gewicht: number
    }
  }
  toegewezen_gebruiker?: {
    naam: string
    rol: string
  }
  voltooid_gebruiker?: {
    naam: string
  }
  geverifieerd_gebruiker?: {
    naam: string
  }
}

interface ActionFilters {
  status: string
  urgentie: string
  search: string
}

export const Acties: React.FC = () => {
  const { user } = useAuth()
  const [filialen, setFilialen] = useState<Filiaal[]>([])
  const [selectedFiliaal, setSelectedFiliaal] = useState<string>('')
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<ActionFilters>({
    status: 'all',
    urgentie: 'all',
    search: ''
  })

  const loadFilialen = async () => {
    try {
      const filialenData = await clientDataService.getFilialen()
      setFilialen(filialenData)
      
      if (filialenData.length > 0) {
        // For admin and management users, default to "all" filialen, otherwise first filiaal
        if (user?.rol === 'admin' || user?.rol === 'inspector' || user?.rol === 'coo' || user?.rol === 'district_manager') {
          setSelectedFiliaal('all')
        } else {
          setSelectedFiliaal(filialenData[0].id)
        }
      }
    } catch (err) {
      setError('Fout bij het laden van filialen')
      console.error('Error loading filialen:', err)
    }
  }

  const fetchActions = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get actions from Supabase with all related data
      const actionsData = await clientDataService.getActions(selectedFiliaal === 'all' ? undefined : selectedFiliaal)
      
      console.log('🔍 Debug - Selected filiaal:', selectedFiliaal)
      console.log('🔍 Debug - Actions data:', actionsData)
      console.log('🔍 Debug - Actions count:', actionsData?.length || 0)

      if (!actionsData || actionsData.length === 0) {
        console.log('⚠️ No actions found')
        setActions([])
        setLoading(false)
        return
      }

      // Transform the data to match our Action interface
      const transformedActions: Action[] = actionsData.map((action: any) => ({
        id: action.id,
        audit_id: action.audit_id,
        audit_resultaat_id: action.audit_resultaat_id,
        titel: action.titel,
        beschrijving: action.beschrijving,
        urgentie: action.urgentie,
        status: action.status,
        toegewezen_aan: action.toegewezen_aan,
        deadline: action.deadline,
        actie_onderneem: action.actie_onderneem,
        foto_urls: action.foto_urls || [],
        voltooid_door: action.voltooid_door,
        voltooid_op: action.voltooid_op,
        geverifieerd_door: action.geverifieerd_door,
        geverifieerd_op: action.geverifieerd_op,
        verificatie_opmerkingen: action.verificatie_opmerkingen,
        created_at: action.created_at,
        updated_at: action.updated_at,
        // Enriched data from joins
        audit: action.audits ? {
          id: action.audits.id,
          filiaal_id: action.audits.filiaal_id,
          audit_datum: action.audits.audit_datum,
          totale_score: action.audits.totale_score,
          pass_percentage: action.audits.pass_percentage,
          filialen: action.audits.filialen
        } : undefined,
        audit_resultaat: action.audit_resultaten ? {
          checklist_item_id: action.audit_resultaten.checklist_item_id,
          resultaat: action.audit_resultaten.resultaat,
          score: action.audit_resultaten.score,
          opmerkingen: action.audit_resultaten.opmerkingen,
          verbeterpunt: action.audit_resultaten.verbeterpunt,
          audit_checklist_items: action.audit_resultaten.audit_checklist_items
        } : undefined
      }))

      // Apply filters
      let filteredActions = transformedActions

      if (filters.status !== 'all') {
        filteredActions = filteredActions.filter(action => action.status === filters.status)
      }
      
      if (filters.urgentie !== 'all') {
        filteredActions = filteredActions.filter(action => action.urgentie === filters.urgentie)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredActions = filteredActions.filter(action => 
          action.titel.toLowerCase().includes(searchLower) ||
          action.beschrijving.toLowerCase().includes(searchLower)
        )
      }
      
      setActions(filteredActions)
    } catch (error) {
      console.error('Error fetching actions:', error)
      setError(`Fout bij het laden van acties: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadFilialen()
    }
  }, [user])

  useEffect(() => {
    if (selectedFiliaal) {
      fetchActions()
    }
  }, [selectedFiliaal, filters])

  const handleActionUpdate = () => {
    fetchActions()
  }

  const getUrgencyColor = (urgentie: string) => {
    switch (urgentie) {
      case 'critical': return 'text-christmas bg-accent-50 border-accent-200'
      case 'high': return 'text-warning-600 bg-warning-50 border-warning-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-success-600 bg-success-50 border-success-200'
      default: return 'text-primary-600 bg-primary-50 border-primary-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-primary-600 bg-primary-50 border-primary-200'
      case 'in_progress': return 'text-olive bg-primary-100 border-primary-300'
      case 'completed': return 'text-success-600 bg-success-50 border-success-200'
      case 'verified': return 'text-lollypop bg-pink-50 border-pink-200'
      default: return 'text-primary-600 bg-primary-50 border-primary-200'
    }
  }

  const getUrgencyLabel = (urgentie: string) => {
    switch (urgentie) {
      case 'critical': return 'Kritiek'
      case 'high': return 'Hoog'
      case 'medium': return 'Gemiddeld'
      case 'low': return 'Laag'
      default: return 'Onbekend'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'In afwachting'
      case 'in_progress': return 'Bezig'
      case 'completed': return 'Voltooid'
      case 'verified': return 'Geverifieerd'
      default: return 'Onbekend'
    }
  }

  const getKPIData = () => {
    const totalActions = actions.length
    const pendingActions = actions.filter(a => a.status === 'pending').length
    const inProgressActions = actions.filter(a => a.status === 'in_progress').length
    const completedActions = actions.filter(a => a.status === 'completed').length
    const verifiedActions = actions.filter(a => a.status === 'verified').length
    const criticalActions = actions.filter(a => a.urgentie === 'critical').length
    const overdueActions = actions.filter(a => 
      a.deadline && 
      new Date(a.deadline) < new Date() && 
      a.status !== 'completed' && 
      a.status !== 'verified'
    ).length

    return {
      totalActions,
      pendingActions,
      inProgressActions,
      completedActions,
      verifiedActions,
      criticalActions,
      overdueActions
    }
  }

  const kpiData = getKPIData()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert variant="error">
            {error}
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
        {/* Title Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="text-center">
              <h1 className="text-3xl font-lino-caps text-neutral-900 mb-2">Acties</h1>
              <p className="text-neutral-600 font-lino">Beheer en volg acties die voortvloeien uit audits</p>
            </div>
          </CardHeader>
        </Card>

        {/* Filiaal Selector */}
        <div className="mb-6">
          <FiliaalSelector
            filialen={filialen}
            selectedFiliaal={selectedFiliaal}
            onFiliaalChange={setSelectedFiliaal}
            userRole={user?.rol}
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <Card>
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">Totaal Acties</p>
                <p className="text-lg font-semibold text-gray-900 mb-1">{kpiData.totalActions}</p>
                <p className="text-xs text-gray-500 leading-tight">Alle acties</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">Kritiek</p>
                <p className="text-lg font-semibold text-red-600 mb-1">{kpiData.criticalActions}</p>
                <p className="text-xs text-gray-500 leading-tight">Urgente acties</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">In Behandeling</p>
                <p className="text-lg font-semibold mb-1" style={{ color: '#132938' }}>{kpiData.pendingActions + kpiData.inProgressActions}</p>
                <p className="text-xs text-gray-500 leading-tight">Openstaande acties</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">Verlopen</p>
                <p className="text-lg font-semibold text-orange-600 mb-1">{kpiData.overdueActions}</p>
                <p className="text-xs text-gray-500 leading-tight">Deadline overschreden</p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <ActionFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
            
            <ActionList
              actions={actions}
              selectedAction={null}
              onActionSelect={() => {}}
              getUrgencyColor={getUrgencyColor}
              getStatusColor={getStatusColor}
              getUrgencyLabel={getUrgencyLabel}
              getStatusLabel={getStatusLabel}
            />
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  )
}
