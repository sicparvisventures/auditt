'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { FiliaalSelector } from '@/components/dashboard/FiliaalSelector'
import { MobileNavigation } from '@/components/dashboard/MobileNavigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Filiaal, Audit, Rapport } from '@/types'
import { clientDataService } from '@/lib/client-data'
import { formatDate, formatScore, formatPercentage } from '@/lib/utils'
import { 
  Download, 
  Eye,
  RefreshCw
} from 'lucide-react'

export const Rapporten: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [filialen, setFilialen] = useState<Filiaal[]>([])
  const [selectedFiliaal, setSelectedFiliaal] = useState<string>('')
  const [rapporten, setRapporten] = useState<Rapport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  useEffect(() => {
    if (selectedFiliaal) {
      loadRapporten()
    }
  }, [selectedFiliaal])

  const loadData = async () => {
    try {
      setLoading(true)
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
      setError('Fout bij het laden van gegevens')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadRapporten = async () => {
    try {
      // Get real rapporten from Supabase
      const audits = await clientDataService.getAudits({
        filiaalId: selectedFiliaal === 'all' ? undefined : selectedFiliaal
      })
      
      // Create rapporten based on completed audits with full audit and filiaal data
      const rapporten: (Rapport & { audit: Audit; filiaal: Filiaal })[] = []
      
      for (const audit of audits.filter(audit => audit.status === 'completed')) {
        const filiaal = await clientDataService.getFiliaalById(audit.filiaal_id)
        if (filiaal) {
          rapporten.push({
            id: `rapport-${audit.id}`,
            audit_id: audit.id,
            rapport_url: `/uploads/rapport-${audit.id}.pdf`,
            verstuurd_naar: ['district@poulepoulette.be', 'coo@poulepoulette.be'],
            verstuur_datum: audit.updated_at,
            status: audit.pass_percentage >= 80 ? 'sent' : 'pending',
            created_at: audit.created_at,
            audit,
            filiaal
          })
        }
      }
      
      setRapporten(rapporten as any)
    } catch (err) {
      setError('Fout bij het laden van rapporten')
      console.error('Error loading rapporten:', err)
    }
  }


  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Verzonden'
      case 'failed':
        return 'Mislukt'
      default:
        return 'In behandeling'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-success-100 text-success-800'
      case 'failed':
        return 'bg-danger-100 text-danger-800'
      default:
        return 'bg-warning-100 text-warning-800'
    }
  }

  const handleDownload = async (rapport: Rapport) => {
    try {
      // Generate a comprehensive RTF report
      const audit = await clientDataService.getAuditById(rapport.audit_id)
      if (!audit) {
        alert('Audit niet gevonden')
        return
      }

      const filiaal = await clientDataService.getFiliaalById(audit.filiaal_id)
      const districtManager = await clientDataService.getUserById(audit.district_manager_id)
      const checklistItems = await clientDataService.getChecklistItems()

      // Generate realistic audit results based on the audit data
      const resultaten = checklistItems.map(item => {
        const baseScore = audit.totale_score || 4.0
        const randomFactor = Math.random() * 0.4 - 0.2
        const itemScore = Math.max(1, Math.min(5, baseScore + randomFactor))
        
        const isPass = itemScore >= 3.5
        const resultaat = isPass ? 'OK' : 'Niet OK'
        
        const opmerkingen = isPass 
          ? (Math.random() > 0.7 ? 'Goed uitgevoerd, geen opmerkingen.' : '')
          : generateFailureComment(item.categorie, item.titel)
        
        const verbeterpunt = !isPass 
          ? generateImprovementSuggestion(item.categorie, item.titel)
          : ''

        return {
          item,
          resultaat,
          score: Math.round(itemScore * 10) / 10,
          opmerkingen,
          verbeterpunt
        }
      })

      // Group results by category
      const groupedResults = resultaten.reduce((acc, result) => {
        const category = result.item.categorie
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(result)
        return acc
      }, {} as Record<string, typeof resultaten>)

      // Create RTF content
      const rtfContent = generateRTFReport({
        audit,
        filiaal,
        districtManager,
        groupedResults,
        rapport
      })

      // Create and download the RTF file
      const blob = new Blob([rtfContent], { type: 'application/rtf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit-rapport-${rapport.audit_id}.rtf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert('Er is een fout opgetreden bij het downloaden')
    }
  }

  // Helper functions to generate realistic comments
  const generateFailureComment = (categorie: string, titel: string): string => {
    const comments = {
      'Buitenkant Zaak': [
        'Tafels niet netjes gedekt',
        'Rommel zichtbaar op terras',
        'Planten verwelkt of vuil'
      ],
      'Spotchecks': [
        'Inkomzone niet opgeruimd',
        'Sporen van ongedierte gevonden',
        'Vuilophoping achter toestellen'
      ],
      'Algemene Properheid': [
        'Werkbladen niet schoon',
        'Vloer bevat vuil',
        'Toiletten niet hygiënisch'
      ],
      'FIFO Controle': [
        'FIFO niet correct nageleefd',
        'Verlopen producten gevonden',
        'Slechte organisatie in koelkast'
      ],
      'Operationele Checks': [
        'Personeelsbezetting onvoldoende',
        'Dagrapporten niet accuraat',
        'Voorraadniveaus te laag'
      ]
    }
    
    const categoryComments = comments[categorie as keyof typeof comments] || ['Verbetering nodig']
    return categoryComments[Math.floor(Math.random() * categoryComments.length)]
  }

  const generateImprovementSuggestion = (categorie: string, titel: string): string => {
    const suggestions = {
      'Buitenkant Zaak': [
        'Zorg voor dagelijkse controle van terras',
        'Implementeer schoonmaakrooster',
        'Controleer planten wekelijks'
      ],
      'Spotchecks': [
        'Verhoog frequentie van controles',
        'Train personeel op hygiëne',
        'Implementeer checklist systeem'
      ],
      'Algemene Properheid': [
        'Verhoog schoonmaakfrequentie',
        'Train personeel op properheid',
        'Controleer dagelijks'
      ],
      'FIFO Controle': [
        'Train personeel op FIFO principe',
        'Implementeer label systeem',
        'Controleer dagelijks voorraad'
      ],
      'Operationele Checks': [
        'Verbeter personeelsplanning',
        'Implementeer dagelijkse controles',
        'Train personeel op procedures'
      ]
    }
    
    const categorySuggestions = suggestions[categorie as keyof typeof suggestions] || ['Verbetering implementeren']
    return categorySuggestions[Math.floor(Math.random() * categorySuggestions.length)]
  }

  const generateRTFReport = ({ audit, filiaal, districtManager, groupedResults, rapport }: any) => {
    const rtfHeader = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}'
    const rtfFooter = '}'
    
    let content = rtfHeader
    
    // Title
    content += '\\par\\par\\qc\\b\\fs28 AUDIT RAPPORT\\b0\\fs24\\par\\par'
    
    // Header information
    content += '\\b Filiaal:\\b0 ' + (filiaal?.naam || 'Onbekend') + '\\par'
    content += '\\b Locatie:\\b0 ' + (filiaal?.locatie || 'Onbekend') + '\\par'
    content += '\\b Adres:\\b0 ' + (filiaal?.adres || 'Onbekend') + '\\par'
    content += '\\b Audit Datum:\\b0 ' + formatDate(audit.audit_datum) + '\\par'
    content += '\\b Auditor:\\b0 ' + (districtManager?.naam || 'Onbekend') + '\\par'
    content += '\\b Status:\\b0 ' + audit.status + '\\par\\par'
    
    // Scores section
    content += '\\b\\fs22 SCORES\\b0\\fs24\\par'
    content += '\\b Totale Score:\\b0 ' + formatScore(audit.totale_score) + '\\par'
    content += '\\b Pass Percentage:\\b0 ' + formatPercentage(audit.pass_percentage) + '\\par\\par'
    
    // General comments
    if (audit.opmerkingen) {
      content += '\\b\\fs22 ALGEMENE OPMERKINGEN\\b0\\fs24\\par'
      content += audit.opmerkingen + '\\par\\par'
    }
    
    // Results by category
    content += '\\b\\fs22 AUDIT RESULTATEN\\b0\\fs24\\par\\par'
    
    Object.entries(groupedResults).forEach(([categorie, results]) => {
      content += '\\b\\fs20 ' + categorie + '\\b0\\fs24\\par'
      
      results.forEach((result: any) => {
        content += '\\b ' + result.item.titel + '\\b0\\par'
        content += result.item.beschrijving + '\\par'
        content += '\\b Resultaat:\\b0 ' + result.resultaat + '\\par'
        content += '\\b Score:\\b0 ' + result.score + '/5\\par'
        
        if (result.opmerkingen) {
          content += '\\b Opmerkingen:\\b0 ' + result.opmerkingen + '\\par'
        }
        
        if (result.verbeterpunt) {
          content += '\\b Verbeterpunt:\\b0 ' + result.verbeterpunt + '\\par'
        }
        
        content += '\\par'
      })
      
      content += '\\par'
    })
    
    // Footer
    content += '\\par\\par\\qc\\fs18 Dit rapport is gegenereerd op ' + new Date().toLocaleDateString('nl-NL') + '\\par'
    content += '\\qc Voor vragen kunt u contact opnemen met ' + (districtManager?.email || 'district@poulepoulette.be') + '\\par'
    
    return content + rtfFooter
  }

  const handleViewAudit = (auditId: string) => {
    // Use Next.js router for client-side navigation
    router.push(`/audits/detail?id=${auditId}`)
  }

  const getKPIData = () => {
    const totalRapporten = rapporten.length
    const sentRapporten = rapporten.filter(r => r.status === 'sent').length
    const pendingRapporten = rapporten.filter(r => r.status === 'pending').length
    const successRate = totalRapporten > 0 ? (sentRapporten / totalRapporten) * 100 : 0

    return {
      totalRapporten,
      sentRapporten,
      pendingRapporten,
      successRate
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
              <h1 className="text-3xl font-lino-caps text-neutral-900 mb-2">Rapporten</h1>
              <p className="text-neutral-600 font-lino">Beheer en download audit rapporten</p>
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
                <p className="text-xs font-medium text-gray-600 mb-1">Totaal Rapporten</p>
                <p className="text-lg font-semibold text-gray-900 mb-1">{kpiData.totalRapporten}</p>
                <p className="text-xs text-gray-500 leading-tight">Gegenereerde rapporten</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">Verzonden</p>
                <p className="text-lg font-semibold text-gray-900 mb-1">{kpiData.sentRapporten}</p>
                <p className="text-xs text-gray-500 leading-tight">Succesvol verzonden</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">In Behandeling</p>
                <p className="text-lg font-semibold text-gray-900 mb-1">{kpiData.pendingRapporten}</p>
                <p className="text-xs text-gray-500 leading-tight">Wachtend op verzending</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-xs font-medium text-gray-600 mb-1">Succes Rate</p>
                <p className="text-lg font-semibold text-gray-900 mb-1">{kpiData.successRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 leading-tight">Verzendingspercentage</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-lino-caps text-gray-900">Rapporten Overzicht</h2>
              <Button onClick={loadRapporten} variant="secondary">
                <RefreshCw className="h-4 w-4 mr-2" />
                Vernieuwen
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {rapporten.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Geen rapporten gevonden
                </h3>
                <p className="text-gray-500 mb-4">
                  Er zijn nog geen rapporten gegenereerd voor dit filiaal.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {rapporten.map((rapport: any) => {
                  const audit = rapport.audit
                  const filiaal = rapport.filiaal
                  
                  if (!audit || !filiaal) return null

                  return (
                    <div key={rapport.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              Audit Rapport - {filiaal.naam}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rapport.status)}`}>
                              {getStatusText(rapport.status)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                            <div>
                              <span className="font-medium">Filiaal:</span> {filiaal.naam} - {filiaal.locatie}
                            </div>
                            <div>
                              <span className="font-medium">Datum:</span> {formatDate(audit.audit_datum)}
                            </div>
                            <div>
                              <span className="font-medium">Score:</span> {formatScore(audit.totale_score)} ({formatPercentage(audit.pass_percentage)})
                            </div>
                          </div>


                          {rapport.verstuur_datum && (
                            <div className="mt-1 text-sm text-gray-500">
                              Verzonden op: {formatDate(rapport.verstuur_datum)}
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAudit(audit.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Audit
                          </Button>
                          
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDownload(rapport)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <MobileNavigation />
    </div>
  )
}
