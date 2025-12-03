'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ActionPhotoUpload } from './ActionPhotoUpload'
import { clientDataService } from '@/lib/client-data'
import { useAuth } from '@/components/providers/AuthProvider'
import { Action } from './Acties'

interface ActionCompletionFormProps {
  action: Action
  onClose: () => void
  onSuccess: () => void
}

export const ActionCompletionForm: React.FC<ActionCompletionFormProps> = ({
  action,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth()
  const [actieOnderneem, setActieOnderneem] = useState('')
  const [fotos, setFotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!actieOnderneem.trim()) {
      setError('Beschrijving van de uitgevoerde actie is verplicht')
      return
    }

    if (fotos.length === 0) {
      setError('Minstens één foto is verplicht ter bevestiging')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Convert uploaded files to data URLs for storage
      const fotoUrls: string[] = []
      for (const file of fotos) {
        try {
          // Convert file to data URL for immediate storage and display
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
          fotoUrls.push(dataUrl)
          console.log('📸 Converted photo to data URL:', dataUrl.substring(0, 50) + '...')
        } catch (error) {
          console.error('Error converting photo to data URL:', error)
          // Fallback to a working placeholder if conversion fails
          fotoUrls.push(`data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BY3RpZSBGb3RvPC90ZXh0Pjwvc3ZnPg==`)
        }
      }

      // Update action status in Supabase
      const success = await clientDataService.updateActionStatus(
        action.id,
        'completed',
        user?.id || 'current-user',
        actieOnderneem,
        fotoUrls
      )

      if (!success) {
        setError('Er is een fout opgetreden bij het bijwerken van de actie')
        return
      }

      onSuccess()
    } catch (error) {
      console.error('Error completing action:', error)
      setError('Er is een fout opgetreden bij het voltooien van de actie')
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
              Actie Voltooien
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschrijving van de uitgevoerde actie *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--focus-ring-color': '#132938' } as React.CSSProperties}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #132938'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
                rows={4}
                value={actieOnderneem}
                onChange={(e) => setActieOnderneem(e.target.value)}
                placeholder="Beschrijf wat je hebt gedaan om de actie te voltooien..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto's ter bevestiging *
              </label>
              <ActionPhotoUpload
                fotos={fotos}
                onFotosChange={setFotos}
                maxFotos={5}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload minstens één foto ter bevestiging van de uitgevoerde actie
              </p>
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
                {loading ? 'BEZIG...' : 'Actie Voltooien'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
