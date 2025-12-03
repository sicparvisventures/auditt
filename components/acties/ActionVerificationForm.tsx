'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { clientDataService } from '@/lib/client-data'
import { useAuth } from '@/components/providers/AuthProvider'
import { Action } from './Acties'

interface ActionVerificationFormProps {
  action: Action
  onClose: () => void
  onSuccess: () => void
}

export const ActionVerificationForm: React.FC<ActionVerificationFormProps> = ({
  action,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth()
  const [verificatieOpmerkingen, setVerificatieOpmerkingen] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!verificatieOpmerkingen.trim()) {
      setError('Verificatie opmerkingen zijn verplicht')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Update action verification in Supabase
      const success = await clientDataService.updateActionVerification(
        action.id,
        verificatieOpmerkingen,
        user?.id || 'current-user'
      )

      if (!success) {
        setError('Er is een fout opgetreden bij het bijwerken van de actie')
        return
      }

      onSuccess()
    } catch (error) {
      console.error('Error verifying action:', error)
      setError('Er is een fout opgetreden bij het verifiëren van de actie')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-lino-caps text-gray-900">
              Actie Verifiëren
            </h2>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              Sluiten
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.titel}
              </h3>
              <p className="text-gray-600 mb-4">
                {action.beschrijving}
              </p>
            </div>

            {action.actie_onderneem && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Uitgevoerde actie:
                </h4>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                  {action.actie_onderneem}
                </p>
              </div>
            )}

            {action.foto_urls && action.foto_urls.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Geüploade foto's:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {action.foto_urls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Actie foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => {
                          // Create a simple modal for verification photos
                          const modal = document.createElement('div')
                          modal.style.cssText = `
                            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                            background: rgba(0,0,0,0.9); display: flex; align-items: center; 
                            justify-content: center; z-index: 9999; cursor: pointer;
                          `
                          const img = document.createElement('img')
                          img.src = url
                          img.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain;'
                          modal.appendChild(img)
                          modal.onclick = () => document.body.removeChild(modal)
                          document.body.appendChild(modal)
                        }}
                        onError={(e) => {
                          console.error('Failed to load verification image:', url)
                          const target = e.target as HTMLImageElement
                          target.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGNpcmNsZSBjeD0iNTAlIiBjeT0iNDAlIiByPSIxNSIgZmlsbD0iIzk3YTNiMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2OTczODMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZvdG8gbmlldCBiZXNjaGlrYmFhcjwvdGV4dD48L3N2Zz4=`
                        }}
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verificatie opmerkingen *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                rows={4}
                value={verificatieOpmerkingen}
                onChange={(e) => setVerificatieOpmerkingen(e.target.value)}
                placeholder="Beschrijf je verificatie van de uitgevoerde actie. Is de actie correct uitgevoerd? Zijn er nog verbeterpunten?"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={loading}
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'BEZIG...' : 'Actie Verifiëren'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
