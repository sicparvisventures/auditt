'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AuditWithDetails } from '@/types'
import { formatDate } from '@/lib/utils'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Camera,
  MessageSquare,
  Lightbulb
} from 'lucide-react'

interface ViewAuditFormProps {
  audit: AuditWithDetails
}

export const ViewAuditForm: React.FC<ViewAuditFormProps> = ({ audit }) => {
  const router = useRouter()

  // Handle case where audit or resultaten might be undefined
  if (!audit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Audit niet gevonden
            </h3>
            <p className="text-gray-500 mb-4">
              De gevraagde audit kon niet worden geladen.
            </p>
            <button
              onClick={() => router.back()}
              className="text-primary-600 hover:text-primary-700"
            >
              Terug
            </button>
          </div>
        </div>
      </div>
    )
  }

  const groupedResults = (audit.resultaten || []).reduce((acc, result) => {
    const category = result.checklist_item?.categorie || 'Onbekend'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(result)
    return acc
  }, {} as Record<string, typeof audit.resultaten>)

  return (
    <div className="max-w-4xl mx-auto pb-24">
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
              {audit.filiaal?.naam || 'Onbekend Filiaal'} - {audit.filiaal?.locatie || 'Onbekende Locatie'}
            </p>
            <p className="text-sm text-gray-500">
              Door: {audit.district_manager?.naam || 'Onbekende Auditor'} • {formatDate(audit.audit_datum)}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              Voortgang
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: '100%' }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              100% voltooid
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-6">
        {Object.entries(groupedResults).map(([categorie, results]) => (
          <Card key={categorie}>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                {categorie}
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                {results.map((result) => {
                  const ResultIcon = result.resultaat === 'ok' ? CheckCircle : XCircle
                  const resultColor = result.resultaat === 'ok' ? 'text-success-600' : 'text-danger-600'
                  const resultBgColor = result.resultaat === 'ok' ? 'bg-success-50' : 'bg-danger-50'
                  const resultBorderColor = result.resultaat === 'ok' ? 'border-success-500' : 'border-danger-500'

                  return (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {result.checklist_item?.titel || 'Onbekend Item'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {result.checklist_item?.beschrijving || 'Geen beschrijving beschikbaar'}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="text-xs text-gray-500">
                            Gewicht: {result.checklist_item?.gewicht || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Result Display */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${resultBorderColor} ${resultBgColor}`}>
                          <ResultIcon className={`h-5 w-5 ${resultColor}`} />
                          <span className={resultColor}>
                            {result.resultaat === 'ok' ? 'OK' : 'Niet OK'}
                          </span>
                        </div>
                      </div>

                      {/* Opmerkingen */}
                      {result.opmerkingen && (
                        <div className="mb-4">
                          <label className="form-label">
                            <MessageSquare className="h-4 w-4 inline mr-1" />
                            Opmerkingen
                          </label>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{result.opmerkingen}</p>
                          </div>
                        </div>
                      )}

                      {/* Verbeterpunt (only for niet_ok) */}
                      {result.resultaat === 'niet_ok' && result.verbeterpunt && (
                        <div className="mb-4">
                          <label className="form-label">
                            <Lightbulb className="h-4 w-4 inline mr-1" />
                            Verbeterpunt
                          </label>
                          <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{result.verbeterpunt}</p>
                          </div>
                        </div>
                      )}

                      {/* Photo Display */}
                      {result.foto_urls && result.foto_urls.length > 0 && (
                        <div>
                          <label className="form-label">
                            <Camera className="h-4 w-4 inline mr-1" />
                            Foto's
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {result.foto_urls.map((photoUrl, index) => (
                              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={photoUrl}
                                  alt={`Audit foto ${index + 1}`}
                                  className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                  onClick={() => window.open(photoUrl, '_blank')}
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

      {/* General Opmerkingen */}
      {audit.opmerkingen && (
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Algemene Opmerkingen
            </h2>
          </CardHeader>
          <CardBody>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">{audit.opmerkingen}</p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
