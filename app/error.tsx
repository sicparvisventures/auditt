'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { RefreshCw, Home } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Er is een fout opgetreden
          </h1>
          <p className="text-gray-600 mb-6">
            Er is een onverwachte fout opgetreden. Probeer de pagina te verversen of ga terug naar de homepage.
          </p>
        </div>

        <Alert variant="error" className="mb-6">
          <div className="text-sm">
            <strong>Foutmelding:</strong> {error.message}
            {error.digest && (
              <div className="mt-2 text-xs text-gray-500">
                Error ID: {error.digest}
              </div>
            )}
          </div>
        </Alert>

        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full text-white transition-colors"
            style={{ backgroundColor: '#132938' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f1f2e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#132938'}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Opnieuw proberen
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="secondary"
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Terug naar homepage
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Als het probleem aanhoudt, neem dan contact op met de technische ondersteuning.
          </p>
        </div>
      </div>
    </div>
  )
}
