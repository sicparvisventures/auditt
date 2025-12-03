'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { MobileNavigation } from '@/components/dashboard/MobileNavigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import { PhotoModal } from '@/components/ui/PhotoModal'
import { ActionCompletionForm } from './ActionCompletionForm'
import { ActionVerificationForm } from './ActionVerificationForm'
import { clientDataService } from '@/lib/client-data'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Camera,
  FileText
} from 'lucide-react'

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
  // Enriched data
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

interface ActionDetailPageProps {
  actionId: string
}

export const ActionDetailPage: React.FC<ActionDetailPageProps> = ({ actionId }) => {
  const { user } = useAuth()
  const router = useRouter()
  const [action, setAction] = useState<Action | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCompletionForm, setShowCompletionForm] = useState(false)
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<{url: string, alt: string, index: number, total: number} | null>(null)

  useEffect(() => {
    loadAction()
  }, [actionId])

  const loadAction = async () => {
    try {
      setLoading(true)
      setError('')
      
      const actionData = await clientDataService.getActionById(actionId)
      
      if (!actionData) {
        setError('Actie niet gevonden')
        return
      }

      // Transform the data to match our Action interface
      const transformedAction: Action = {
        id: actionData.id,
        audit_id: actionData.audit_id,
        audit_resultaat_id: actionData.audit_resultaat_id,
        titel: actionData.titel,
        beschrijving: actionData.beschrijving,
        urgentie: actionData.urgentie,
        status: actionData.status,
        toegewezen_aan: actionData.toegewezen_aan,
        deadline: actionData.deadline,
        actie_onderneem: actionData.actie_onderneem,
        foto_urls: actionData.foto_urls || [],
        voltooid_door: actionData.voltooid_door,
        voltooid_op: actionData.voltooid_op,
        geverifieerd_door: actionData.geverifieerd_door,
        geverifieerd_op: actionData.geverifieerd_op,
        verificatie_opmerkingen: actionData.verificatie_opmerkingen,
        created_at: actionData.created_at,
        updated_at: actionData.updated_at,
        // Enriched data from joins
        audit: actionData.audits ? {
          id: actionData.audits.id,
          filiaal_id: actionData.audits.filiaal_id,
          audit_datum: actionData.audits.audit_datum,
          totale_score: actionData.audits.totale_score,
          pass_percentage: actionData.audits.pass_percentage,
          filialen: actionData.audits.filialen
        } : undefined,
        audit_resultaat: actionData.audit_resultaten ? {
          checklist_item_id: actionData.audit_resultaten.checklist_item_id,
          resultaat: actionData.audit_resultaten.resultaat,
          score: actionData.audit_resultaten.score,
          opmerkingen: actionData.audit_resultaten.opmerkingen,
          verbeterpunt: actionData.audit_resultaten.verbeterpunt,
          audit_checklist_items: actionData.audit_resultaten.audit_checklist_items
        } : undefined
      }

      setAction(transformedAction)
    } catch (error) {
      console.error('Error loading action:', error)
      setError('Fout bij het laden van de actie')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUrgencyColor = (urgentie: string) => {
    switch (urgentie) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'in_progress': return 'border-gray-200' + ' ' + 'text-[#132938] bg-[#f0f4f8]'
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'verified': return 'text-purple-600 bg-purple-50 border-purple-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
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

  const handleActionUpdate = () => {
    loadAction()
    setShowCompletionForm(false)
    setShowVerificationForm(false)
  }

  const canComplete = action?.status === 'pending' || action?.status === 'in_progress'
  const canVerify = action?.status === 'completed' && (action?.voltooid_door !== action?.geverifieerd_door)

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

  if (!action) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert variant="error">
            Actie niet gevonden
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/acties')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar Acties
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-lino-caps text-gray-900 mb-2">
                {action.titel}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getUrgencyColor(action.urgentie)}`}>
                  {getUrgencyLabel(action.urgentie)}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(action.status)}`}>
                  {getStatusLabel(action.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Beschrijving */}
            <Card>
              <CardHeader>
                  <h2 className="text-xl font-lino-caps text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Beschrijving
                  </h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700 leading-relaxed">
                  {action.beschrijving}
                </p>
              </CardBody>
            </Card>

            {/* Verbeterpunt */}
            {action.audit_resultaat?.verbeterpunt && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-lino-caps text-gray-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Verbeterpunt
                  </h2>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700 leading-relaxed">
                    {action.audit_resultaat.verbeterpunt}
                  </p>
                </CardBody>
              </Card>
            )}

            {/* Opmerkingen */}
            {action.audit_resultaat?.opmerkingen && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-lino-caps text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Opmerkingen
                  </h2>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700 leading-relaxed">
                    {action.audit_resultaat.opmerkingen}
                  </p>
                </CardBody>
              </Card>
            )}

            {/* Uitgevoerde Actie */}
            {action.actie_onderneem && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-lino-caps text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Uitgevoerde Actie
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Beschrijving:</h3>
                      <p className="text-gray-900">{action.actie_onderneem}</p>
                    </div>
                    
                    {action.voltooid_gebruiker && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Voltooid door:</h3>
                        <p className="text-gray-900">{action.voltooid_gebruiker.naam}</p>
                      </div>
                    )}
                    
                    {action.voltooid_op && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Voltooid op:</h3>
                        <p className="text-gray-900">{formatDate(action.voltooid_op)}</p>
                      </div>
                    )}
                    
                    {action.foto_urls && action.foto_urls.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Foto's:</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {action.foto_urls.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Actie foto ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-75 transition-opacity"
                                onClick={() => setSelectedPhoto({
                                  url: url,
                                  alt: `Actie foto ${index + 1}`,
                                  index: index,
                                  total: action.foto_urls.length
                                })}
                                onError={(e) => {
                                  console.error('Failed to load action image:', url)
                                  const target = e.target as HTMLImageElement
                                  target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGNpcmNsZSBjeD0iNTAlIiBjeT0iNDAlIiByPSIyMCIgZmlsbD0iIzk3YTNiMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2OTczODMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZvdG8gbmlldCBiZXNjaGlrYmFhcjwvdGV4dD48L3N2Zz4=`
                                }}
                              />
                              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                Actie foto {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Verificatie */}
            {action.verificatie_opmerkingen && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-lino-caps text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Verificatie
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Opmerkingen:</h3>
                      <p className="text-gray-900">{action.verificatie_opmerkingen}</p>
                    </div>
                    
                    {action.geverifieerd_gebruiker && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Geverifieerd door:</h3>
                        <p className="text-gray-900">{action.geverifieerd_gebruiker.naam}</p>
                      </div>
                    )}
                    
                    {action.geverifieerd_op && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Geverifieerd op:</h3>
                        <p className="text-gray-900">{formatDate(action.geverifieerd_op)}</p>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Audit Informatie */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Audit Informatie</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Filiaal:</span>
                    <p className="font-medium">
                      {action.audit?.filialen?.naam} - {action.audit?.filialen?.locatie}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Audit Datum:</span>
                    <p className="font-medium">
                      {action.audit?.audit_datum 
                        ? new Date(action.audit.audit_datum).toLocaleDateString('nl-NL', {
                            day: '2-digit',
                            month: '2-digit', 
                            year: 'numeric'
                          }) + ', ' + 
                          new Date(action.audit.audit_datum).toLocaleTimeString('nl-NL', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Score:</span>
                    <p className="font-medium">
                      {action.audit_resultaat?.score}/5
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Gewicht:</span>
                    <p className="font-medium">
                      {action.audit_resultaat?.audit_checklist_items?.gewicht}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Categorie:</span>
                    <p className="font-medium">
                      {action.audit_resultaat?.audit_checklist_items?.categorie}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Checklist Item:</span>
                    <p className="font-medium">
                      {action.audit_resultaat?.audit_checklist_items?.titel}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Toewijzing */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Toewijzing</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Toegewezen aan:</span>
                    <p className="font-medium">
                      {action.toegewezen_gebruiker?.naam || 'Niet toegewezen'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Deadline:</span>
                    <p className="font-medium">
                      {action.deadline ? formatDate(action.deadline) : 'Geen deadline'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Aangemaakt:</span>
                    <p className="font-medium">
                      {formatDate(action.created_at)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Laatst bijgewerkt:</span>
                    <p className="font-medium">
                      {formatDate(action.updated_at)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {canComplete && (
                <Button
                  onClick={() => setShowCompletionForm(true)}
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Actie Voltooien
                </Button>
              )}
              
              {canVerify && (
                <Button
                  onClick={() => setShowVerificationForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Actie Verifiëren
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileNavigation />

      {/* Completion Form Modal */}
      {showCompletionForm && action && (
        <ActionCompletionForm
          action={action}
          onClose={() => setShowCompletionForm(false)}
          onSuccess={handleActionUpdate}
        />
      )}

      {/* Verification Form Modal */}
      {showVerificationForm && action && (
        <ActionVerificationForm
          action={action}
          onClose={() => setShowVerificationForm(false)}
          onSuccess={handleActionUpdate}
        />
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          photoUrl={selectedPhoto.url}
          photoAlt={selectedPhoto.alt}
          photoIndex={selectedPhoto.index}
          totalPhotos={selectedPhoto.total}
        />
      )}
    </div>
  )
}
