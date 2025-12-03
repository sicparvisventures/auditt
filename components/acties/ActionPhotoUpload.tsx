'use client'

import React, { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Camera, X, Upload } from 'lucide-react'

interface ActionPhotoUploadProps {
  fotos: File[]
  onFotosChange: (fotos: File[]) => void
  maxFotos?: number
  required?: boolean
}

export const ActionPhotoUpload: React.FC<ActionPhotoUploadProps> = ({
  fotos,
  onFotosChange,
  maxFotos = 5,
  required = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    )

    const newFotos = [...fotos, ...newFiles].slice(0, maxFotos)
    onFotosChange(newFotos)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemovePhoto = (index: number) => {
    const newFotos = fotos.filter((_, i) => i !== index)
    onFotosChange(newFotos)
  }

  const getFilePreview = (file: File) => {
    return URL.createObjectURL(file)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors hover:border-gray-400 hover:bg-gray-50 ${
          fotos.length >= maxFotos ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => {
          if (fotos.length < maxFotos && fileInputRef.current) {
            fileInputRef.current.click()
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Klik om foto's te selecteren
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPEG, PNG, WebP • Max 10MB per foto • Max {maxFotos} foto's
          </p>
          {required && (
            <p className="text-xs text-red-500 mt-1">
              Minstens één foto is verplicht
            </p>
          )}
        </div>
      </div>

      {/* Current Photos */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={getFilePreview(foto)}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {foto.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Count */}
      {fotos.length > 0 && (
        <p className="text-xs text-gray-500">
          {fotos.length} foto(s) geselecteerd
        </p>
      )}
    </div>
  )
}
