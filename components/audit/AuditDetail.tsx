'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toaster'
import { PhotoModal } from '@/components/ui/PhotoModal'
import { AuditWithDetails } from '@/types'
import { formatDate, formatScore, formatPercentage, getPassStatus } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { clientDataService } from '@/lib/client-data'
// Temporarily disabled - causing compilation issues
// import { SimplePDFExporter, SimpleAuditData } from '@/lib/working-pdf-export'
// import { WorkingEmailService } from '@/lib/working-email-service'
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Camera,
  MessageSquare,
  Lightbulb,
  FileText,
  Calendar,
  User,
  Building2
} from 'lucide-react'

interface AuditDetailProps {
  audit: AuditWithDetails
}

export const AuditDetail: React.FC<AuditDetailProps> = ({ audit }) => {
  const router = useRouter()
  const { addToast } = useToast()
  const [generatingReport, setGeneratingReport] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<{url: string, alt: string, index: number, total: number} | null>(null)

  const passStatus = getPassStatus(audit.pass_percentage >= 80)
  const StatusIcon = audit.pass_percentage >= 80 ? CheckCircle : XCircle

  const groupedResults = audit.resultaten.reduce((acc, result) => {
    // Add safety check for checklist_item
    if (!result.checklist_item) {
      console.warn('Missing checklist_item for result:', result)
      return acc
    }
    
    // Debug logging for comments and improvements
    if (result.opmerkingen || result.verbeterpunt) {
      console.log('📝 AuditDetail - Result with comments/improvements:', {
        titel: result.checklist_item.titel,
        opmerkingen: result.opmerkingen,
        verbeterpunt: result.verbeterpunt
      })
    }
    
    const category = result.checklist_item.categorie
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(result)
    return acc
  }, {} as Record<string, typeof audit.resultaten>)

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true)

      addToast({
        title: 'PDF genereren...',
        message: 'Het PDF rapport wordt gegenereerd en geüpload.',
        variant: 'info'
      })

      // Import email service
      const { EmailServiceUpgrade } = await import('@/lib/email-service-upgrade')

      // Genereer PDF en verstuur email
      const result = await EmailServiceUpgrade.sendAuditReportWithPDF(audit)

      if (result.success) {
        addToast({
          title: 'Rapport klaar',
          message: 'PDF is gegenereerd en uw mail app wordt geopend. De PDF link staat in de email.',
          variant: 'success'
        })

        // Refresh na korte delay om database updates te tonen
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        throw new Error(result.error || 'PDF generatie mislukt')
      }

    } catch (err: any) {
      console.error('Report generation error:', err)
      addToast({
        title: 'Rapport fout',
        message: err.message || 'Er is een fout opgetreden bij het verzenden van het rapport',
        variant: 'error'
      })
    } finally {
      setGeneratingReport(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      addToast({
        title: 'PDF genereren...',
        message: 'Het PDF rapport wordt gegenereerd.',
        variant: 'info'
      })

      // Import PDF service
      const { pdfService } = await import('@/lib/pdf-service')
      
      // Download PDF
      await pdfService.downloadPDF(audit)

      addToast({
        title: 'PDF gedownload',
        message: 'Het PDF rapport is gedownload.',
        variant: 'success'
      })
    } catch (error: any) {
      console.error('PDF export error:', error)
      addToast({
        title: 'Export fout',
        message: error.message || 'Kon PDF niet genereren. Controleer uw browser instellingen.',
        variant: 'error'
      })
    }
  }

  return (
    <div id="audit-detail-content" className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-lino-caps text-gray-900">
              Audit Details
            </h1>
            <p className="text-gray-600">
              {audit.filiaal.naam} - {audit.filiaal.locatie}
            </p>
            <p className="text-sm text-gray-500">
              Door: {audit.district_manager.naam} • {formatDate(audit.audit_datum)}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <StatusIcon className={`h-5 w-5 ${passStatus.color}`} />
                <span className={`text-lg font-semibold ${passStatus.color}`}>
                  {passStatus.text}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Score: {formatScore(audit.totale_score)}/5.0 ({formatPercentage(audit.pass_percentage)})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleGenerateReport}
          disabled={generatingReport}
        >
          <Mail className="h-4 w-4 mr-2" />
          {generatingReport ? 'Genereren...' : 'Verstuur Rapport'}
        </Button>
      </div>

      {/* Audit Summary */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Audit Samenvatting
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <img src="/logo_poule.png" alt="Poule & Poulette Logo" className="h-5 w-auto" />
              <div>
                <p className="text-sm text-gray-500">Filiaal</p>
                <p className="font-medium">{audit.filiaal.naam}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Datum</p>
                <p className="font-medium">{formatDate(audit.audit_datum)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Auditor</p>
                <p className="font-medium">{audit.district_manager.naam}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{audit.status}</p>
              </div>
            </div>
          </div>

          {audit.opmerkingen && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Algemene Opmerkingen
              </h3>
              <p className="text-sm text-gray-600">{audit.opmerkingen}</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Results by Category */}
      <div className="space-y-6">
        {Object.entries(groupedResults).map(([categorie, results]) => (
          <Card key={categorie}>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                {categorie}
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {results.map((result) => {
                  const ResultIcon = result.resultaat === 'ok' ? CheckCircle : XCircle
                  const resultColor = result.resultaat === 'ok' ? 'text-success-600' : 'text-danger-600'

                  // Skip results without checklist_item
                  if (!result.checklist_item) {
                    return null
                  }

                  return (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <ResultIcon className={`h-5 w-5 mt-0.5 ${resultColor}`} />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {result.checklist_item.titel}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {result.checklist_item.beschrijving}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${result.resultaat === 'ok' ? 'badge-success' : 'badge-danger'}`}>
                            {result.resultaat === 'ok' ? 'OK' : 'Niet OK'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Score: {result.score}/5
                          </p>
                        </div>
                      </div>

                      {result.opmerkingen && (
                        <div className="mb-3">
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Opmerkingen</p>
                              <p className="text-sm text-gray-600">{result.opmerkingen}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {result.verbeterpunt && (
                        <div className="mb-3">
                          <div className="flex items-start space-x-2">
                            <Lightbulb className="h-4 w-4 text-warning-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Verbeterpunt</p>
                              <p className="text-sm text-gray-600">{result.verbeterpunt}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {result.foto_urls && result.foto_urls.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Camera className="h-4 w-4 text-gray-400" />
                            <p className="text-sm font-medium text-gray-900">
                              Foto's ({result.foto_urls.length})
                            </p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {result.foto_urls.map((photoUrl, index) => (
                              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={photoUrl}
                                  alt={`Audit foto ${index + 1}`}
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                  onClick={() => setSelectedPhoto({
                                    url: photoUrl,
                                    alt: `Audit foto ${index + 1}`,
                                    index: index,
                                    total: result.foto_urls.length
                                  })}
                                  onError={(e) => {
                                    console.error('Failed to load audit image:', photoUrl)
                                    const target = e.target as HTMLImageElement
                                    target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGNpcmNsZSBjeD0iNTAlIiBjeT0iNDAlIiByPSIyMCIgZmlsbD0iIzk3YTNiMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2OTczODMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZvdG8gbmlldCBiZXNjaGlrYmFhcjwvdGV4dD48L3N2Zz4=`
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Report Status */}
      {audit.rapport && (
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Rapport Status
            </h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium capitalize">{audit.rapport.status}</span>
                </p>
                {audit.rapport.verstuur_datum && (
                  <p className="text-sm text-gray-600">
                    Verzonden: {formatDate(audit.rapport.verstuur_datum)}
                  </p>
                )}
              </div>
              {audit.rapport.rapport_url && (
                <Button
                  variant="secondary"
                  onClick={() => window.open(audit.rapport.rapport_url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Rapport
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
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
