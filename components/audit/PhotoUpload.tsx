'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { uploadFile, validateFile, deleteFile } from '@/lib/file-upload'
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/components/ui/Toaster'

interface PhotoUploadProps {
  itemId: string
  currentPhotos: string[]
  onPhotosChange: (itemId: string, photoUrls: string[]) => void
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  itemId,
  currentPhotos,
  onPhotosChange
}) => {
  const [uploading, setUploading] = useState(false)
  const { addToast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    const newPhotoUrls: string[] = []

    try {
      for (const file of acceptedFiles) {
        // Validate file
        const validation = validateFile(file)
        if (!validation.valid) {
          addToast({
            title: 'Bestand geweigerd',
            message: validation.error || 'Ongeldig bestand',
            variant: 'error'
          })
          continue
        }

        // Upload file
        const result = await uploadFile(file, 'audit-photos', `${itemId}/${Date.now()}-${file.name}`)
        
        if (result.success && result.url) {
          newPhotoUrls.push(result.url)
        } else {
          addToast({
            title: 'Upload mislukt',
            message: result.error || 'Onbekende fout',
            variant: 'error'
          })
        }
      }

      if (newPhotoUrls.length > 0) {
        onPhotosChange(itemId, [...currentPhotos, ...newPhotoUrls])
        addToast({
          title: 'Foto\'s geüpload',
          message: `${newPhotoUrls.length} foto(s) succesvol geüpload`,
          variant: 'success'
        })
      }

    } catch (error) {
      addToast({
        title: 'Upload fout',
        message: 'Er is een fout opgetreden bij het uploaden',
        variant: 'error'
      })
    } finally {
      setUploading(false)
    }
  }, [itemId, currentPhotos, onPhotosChange, addToast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5,
    disabled: uploading
  })

  const handleRemovePhoto = async (photoUrl: string) => {
    try {
      const result = await deleteFile(photoUrl, 'audit-photos')
      
      if (result.success) {
        const updatedPhotos = currentPhotos.filter(url => url !== photoUrl)
        onPhotosChange(itemId, updatedPhotos)
        addToast({
          title: 'Foto verwijderd',
          message: 'Foto succesvol verwijderd',
          variant: 'success'
        })
      } else {
        addToast({
          title: 'Verwijderen mislukt',
          message: result.error || 'Onbekende fout',
          variant: 'error'
        })
      }
    } catch (error) {
      addToast({
        title: 'Verwijderen fout',
        message: 'Er is een fout opgetreden bij het verwijderen',
        variant: 'error'
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`photo-upload-area ${isDragActive ? 'dragover' : ''} ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Laat de foto\'s hier los...'
              : 'Sleep foto\'s hierheen of klik om te selecteren'
            }
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPEG, PNG, WebP • Max 10MB per foto • Max 5 foto's
          </p>
        </div>
      </div>

      {/* Current Photos */}
      {currentPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentPhotos.map((photoUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={photoUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handleRemovePhoto(photoUrl)}
                className="absolute top-2 right-2 bg-danger-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <Alert variant="info">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2" />
            Foto's worden geüpload...
          </div>
        </Alert>
      )}

      {/* Photo Count */}
      {currentPhotos.length > 0 && (
        <p className="text-xs text-gray-500">
          {currentPhotos.length} foto(s) geüpload
        </p>
      )}
    </div>
  )
}
