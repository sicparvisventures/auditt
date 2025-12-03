import React from 'react'
import Image from 'next/image'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'LADEN...' 
}) => {
  const sizes = {
    sm: { width: 16, height: 16 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 }
  }

  const currentSize = sizes[size]

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin">
        <Image
          src="/pootje.png"
          alt="LADEN..."
          width={currentSize.width}
          height={currentSize.height}
          className="object-contain"
          priority
        />
      </div>
      {text && (
        <p className="mt-4 text-sm text-olive font-bacon">
          {text}
        </p>
      )}
    </div>
  )
}
