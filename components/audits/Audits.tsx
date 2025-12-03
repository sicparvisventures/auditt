'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { FiliaalSelector } from '@/components/dashboard/FiliaalSelector'
import { MobileNavigation } from '@/components/dashboard/MobileNavigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Calendar, 
  User, 
  CheckCircle, 
  XCircle, 
  Eye,
  FileText,
  Clock,
  Plus,
  Filter,
  Search,
  Download
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Filiaal, Audit } from '@/types'
import { clientDataService } from '@/lib/client-data'
import { formatDate, formatScore, formatPercentage, getPassStatus } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export const Audits: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [filialen, setFilialen] = useState<Filiaal[]>([])
  const [selectedFiliaal, setSelectedFiliaal] = useState<string>('')
  const [audits, setAudits] = useState<Audit[]>([])
  const [filteredAudits, setFilteredAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  })

  useEffect(() => {
    if (user) {
      loadFilialen()
    }
  }, [user])

  useEffect(() => {
    if (selectedFiliaal) {
      loadAudits()
    }
  }, [selectedFiliaal])

  useEffect(() => {
    applyFilters()
  }, [audits, searchTerm, statusFilter, dateRange])

  const loadFilialen = async () => {
    try {
      setLoading(true)
      const data = await clientDataService.getFilialen()
      setFilialen(data)
      if (data.length > 0) {
        // For admin and management users, default to "all" filialen, otherwise first filiaal
        if (user?.rol === 'admin' || user?.rol === 'inspector' || user?.rol === 'coo' || user?.rol === 'district_manager') {
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
      const data = await clientDataService.getAudits({
        filiaalId: selectedFiliaal === 'all' ? undefined : selectedFiliaal
      })
      setAudits(data)
    } catch (err) {
      setError('Fout bij het laden van audits')
      console.error('Error loading audits:', err)
    }
  }

  const applyFilters = () => {
    let filtered = [...audits]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(audit => 
        audit.district_manager?.naam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.opmerkingen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(audit.audit_datum).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'pass') {
        filtered = filtered.filter(audit => audit.pass_percentage >= 80)
      } else if (statusFilter === 'fail') {
        filtered = filtered.filter(audit => audit.pass_percentage < 80)
      } else if (statusFilter === 'in_progress') {
        filtered = filtered.filter(audit => audit.status === 'in_progress')
      } else if (statusFilter === 'completed') {
        filtered = filtered.filter(audit => audit.status === 'completed')
      }
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter(audit => audit.audit_datum >= dateRange.from)
    }
    if (dateRange.to) {
      filtered = filtered.filter(audit => audit.audit_datum <= dateRange.to)
    }

    setFilteredAudits(filtered)
  }

  const handleFiliaalChange = (filiaalId: string) => {
    setSelectedFiliaal(filiaalId)
  }

  const handleViewAudit = (auditId: string) => {
    router.push(`/audits/detail?id=${auditId}`)
  }

  const handleNewAudit = () => {
    if (selectedFiliaal && selectedFiliaal !== 'all') {
      router.push(`/audits/new?filiaal=${selectedFiliaal}`)
    } else {
      router.push('/audits/new')
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateRange({ from: '', to: '' })
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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <main className="container mx-auto px-4 py-6 pb-28">
        {/* Title Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="text-center">
              <h1 className="text-3xl font-lino-caps text-neutral-900 mb-2">Audits</h1>
              <p className="text-neutral-600 font-lino">Beheer en bekijk alle uitgevoerde audits</p>
            </div>
          </CardHeader>
        </Card>

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <Button onClick={handleNewAudit} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nieuwe Audit</span>
            </Button>
          </div>

          <FiliaalSelector
            filialen={filialen}
            selectedFiliaal={selectedFiliaal}
            onFiliaalChange={handleFiliaalChange}
            userRole={user?.rol}
          />
        </div>

        {(
          <>
            {/* Filters Section */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Zoeken..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">Alle statussen</option>
                    <option value="pass">Geslaagd</option>
                    <option value="fail">Gefaald</option>
                    <option value="completed">Voltooid</option>
                    <option value="in_progress">In behandeling</option>
                  </select>

                  {/* Date From */}
                  <Input
                    type="date"
                    placeholder="Van datum"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  />

                  {/* Date To */}
                  <Input
                    type="date"
                    placeholder="Tot datum"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    {filteredAudits.length} van {audits.length} audits
                  </p>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Filters wissen
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Audits List */}
            <div className="mb-20">
              {filteredAudits.length === 0 ? (
                <Card>
                  <CardBody>
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-lino-caps text-gray-900 mb-2">
                        Geen audits gevonden
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {audits.length === 0 
                          ? "Er zijn nog geen audits uitgevoerd voor dit filiaal."
                          : "Geen audits gevonden die voldoen aan de huidige filters."
                        }
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={handleNewAudit}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nieuwe Audit Starten
                        </Button>
                        {audits.length > 0 && (
                          <Button variant="outline" onClick={clearFilters}>
                            Filters wissen
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-lino-caps text-gray-900">
                      Audits voor {selectedFiliaal === 'all' ? 'Alle Filialen' : selectedFiliaalData?.naam || ''}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exporteren
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredAudits.map((audit) => {
                      const passStatus = getPassStatus(audit.pass_percentage >= 80)
                      const StatusIcon = audit.pass_percentage >= 80 ? CheckCircle : XCircle

                      return (
                        <Card key={audit.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary-500">
                          <CardBody>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <StatusIcon className={`h-6 w-6 ${passStatus.color}`} />
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    Audit van {formatDate(audit.audit_datum)}
                                  </h3>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    audit.pass_percentage >= 80 
                                      ? 'bg-success-100 text-success-800' 
                                      : 'bg-danger-100 text-danger-800'
                                  }`}>
                                    {passStatus.text}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>{formatDate(audit.audit_datum)}</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span>{audit.district_manager?.naam || 'Onbekend'}</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">Score: {formatScore(audit.totale_score)}/5.0</span>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <span>Percentage: {formatPercentage(audit.pass_percentage)}</span>
                                  </div>
                                </div>

                                {audit.opmerkingen && (
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md line-clamp-2">
                                    <span className="font-medium">Opmerkingen:</span> {audit.opmerkingen}
                                  </p>
                                )}
                              </div>

                              <div className="ml-6 flex flex-col space-y-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewAudit(audit.id)}
                                  className="flex items-center space-x-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>Bekijken</span>
                                </Button>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-6">
                                  <span className={`inline-flex items-center space-x-1 ${
                                    audit.status === 'completed' ? 'text-success-600' : 
                                    audit.status === 'in_progress' ? 'text-warning-600' : 'text-gray-600'
                                  }`}>
                                    {audit.status === 'in_progress' && <Clock className="h-4 w-4" />}
                                    <span>
                                      Status: {audit.status === 'completed' ? 'Voltooid' : 
                                               audit.status === 'in_progress' ? 'In behandeling' : 'Geannuleerd'}
                                    </span>
                                  </span>
                                  <span className="text-gray-500">
                                    Aangemaakt: {formatDate(audit.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <MobileNavigation />
    </div>
  )
}
