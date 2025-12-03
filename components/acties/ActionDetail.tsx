'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PhotoModal } from '@/components/ui/PhotoModal'
import { Action } from './Acties'
import { ActionCompletionForm } from './ActionCompletionForm'
import { ActionVerificationForm } from './ActionVerificationForm'

interface ActionDetailProps {
  action: Action
  onActionUpdate: () => void
  getUrgencyColor: (urgentie: string) => string
  getStatusColor: (status: string) => string
  getUrgencyLabel: (urgentie: string) => string
  getStatusLabel: (status: string) => string
}

export const ActionDetail: React.FC<ActionDetailProps> = ({
  action,
  onActionUpdate,
  getUrgencyColor,
  getStatusColor,
  getUrgencyLabel,
  getStatusLabel
}) => {
  const [showCompletionForm, setShowCompletionForm] = useState(false)
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<{url: string, alt: string, index: number, total: number} | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  const canComplete = action.status === 'pending' || action.status === 'in_progress'
  const canVerify = action.status === 'completed' && (action.voltooid_door !== action.geverifieerd_door)

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-lino-caps text-gray-900 mb-2">
              {action.titel}
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getUrgencyColor(action.urgentie)}`}>
                {getUrgencyLabel(action.urgentie)}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(action.status)}`}>
                {getStatusLabel(action.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Beschrijving</h3>
            <p className="text-gray-900">{action.beschrijving}</p>
          </div>

          {action.audit_resultaat?.verbeterpunt && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Verbeterpunt</h3>
              <p className="text-gray-900">{action.audit_resultaat.verbeterpunt}</p>
            </div>
          )}

          {action.audit_resultaat?.opmerkingen && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Opmerkingen</h3>
              <p className="text-gray-900">{action.audit_resultaat.opmerkingen}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Audit Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Informatie</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Filiaal:</span>
            <p className="font-medium">
              {action.audit?.filialen?.naam} - {action.audit?.filialen?.locatie}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Audit Datum:</span>
            <p className="font-medium">
              {action.audit?.audit_datum ? formatDate(action.audit.audit_datum) : 'N/A'}
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
      </Card>

      {/* Assignment Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Toewijzing</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Toegewezen aan:</span>
            <p className="font-medium">
              {action.toegewezen_gebruiker?.naam || 'Niet toegewezen'}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Deadline:</span>
            <p className={`font-medium ${isOverdue(action.deadline) && action.status !== 'completed' && action.status !== 'verified' ? 'text-red-600' : ''}`}>
              {action.deadline ? formatDate(action.deadline) : 'Geen deadline'}
              {isOverdue(action.deadline) && action.status !== 'completed' && action.status !== 'verified' && ' (Verlopen)'}
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
      </Card>

      {/* Completion Information */}
      {action.actie_onderneem && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uitgevoerde Actie</h3>
          <div className="space-y-4">
            <div>
              <span className="text-gray-600 text-sm">Beschrijving:</span>
              <p className="text-gray-900 mt-1">{action.actie_onderneem}</p>
            </div>
            {action.voltooid_gebruiker && (
              <div>
                <span className="text-gray-600 text-sm">Voltooid door:</span>
                <p className="text-gray-900 mt-1">{action.voltooid_gebruiker.naam}</p>
              </div>
            )}
            {action.voltooid_op && (
              <div>
                <span className="text-gray-600 text-sm">Voltooid op:</span>
                <p className="text-gray-900 mt-1">{formatDate(action.voltooid_op)}</p>
              </div>
            )}
            {action.foto_urls && action.foto_urls.length > 0 && (
              <div>
                <span className="text-gray-600 text-sm">Foto's:</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {action.foto_urls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Actie foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => setSelectedPhoto({
                          url: url,
                          alt: `Actie foto ${index + 1}`,
                          index: index,
                          total: action.foto_urls.length
                        })}
                        onError={(e) => {
                          console.error('Failed to load image:', url)
                          const target = e.target as HTMLImageElement
                          target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY5NzM4MyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvdG8gbmlldCBiZXNjaGlrYmFhcjwvdGV4dD48L3N2Zz4=`
                        }}
                      />
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Verification Information */}
      {action.verificatie_opmerkingen && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verificatie</h3>
          <div className="space-y-4">
            <div>
              <span className="text-gray-600 text-sm">Opmerkingen:</span>
              <p className="text-gray-900 mt-1">{action.verificatie_opmerkingen}</p>
            </div>
            {action.geverifieerd_gebruiker && (
              <div>
                <span className="text-gray-600 text-sm">Geverifieerd door:</span>
                <p className="text-gray-900 mt-1">{action.geverifieerd_gebruiker.naam}</p>
              </div>
            )}
            {action.geverifieerd_op && (
              <div>
                <span className="text-gray-600 text-sm">Geverifieerd op:</span>
                <p className="text-gray-900 mt-1">{formatDate(action.geverifieerd_op)}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {canComplete && (
          <Button
            onClick={() => setShowCompletionForm(true)}
            className="w-full"
          >
            Actie Voltooien
          </Button>
        )}
        
        {canVerify && (
          <Button
            onClick={() => setShowVerificationForm(true)}
            variant="outline"
            className="w-full"
          >
            Actie Verifiëren
          </Button>
        )}
      </div>

      {/* Completion Form Modal */}
      {showCompletionForm && (
        <ActionCompletionForm
          action={action}
          onClose={() => setShowCompletionForm(false)}
          onSuccess={onActionUpdate}
        />
      )}

      {/* Verification Form Modal */}
      {showVerificationForm && (
        <ActionVerificationForm
          action={action}
          onClose={() => setShowVerificationForm(false)}
          onSuccess={onActionUpdate}
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
