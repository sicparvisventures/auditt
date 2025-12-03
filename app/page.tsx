'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Try to redirect to landing page
    const timer = setTimeout(() => {
      try {
        router.push('/landing')
      } catch (err) {
        console.error('Navigation error:', err)
        setError(true)
        setLoading(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ppgreen to-ppred">
        <div className="text-center text-white max-w-md mx-auto p-8">
          <div className="mb-6">
            <img src="/kipje.png" alt="AuditFlow" className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">AuditFlow</h1>
            <p className="text-lg opacity-90">Interne Audit Tool</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Navigation Issue</h2>
            <p className="mb-4">Er is een probleem met de navigatie. Probeer een van deze opties:</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/landing'}
                className="w-full bg-ppaccent text-white py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
              >
                Ga naar Landing Pagina
              </button>
              <button 
                onClick={() => window.location.href = '/pp-login'}
                className="w-full bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-colors"
              >
                Direct naar Login
              </button>
            </div>
          </div>
          
          <p className="text-sm opacity-75">
            Als dit probleem aanhoudt, herstart de development server
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ppgreen to-ppred">
      <div className="text-center text-white">
        <div className="mb-6">
          <img src="/kipje.png" alt="AuditFlow" className="w-20 h-20 mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-bold mb-2">AuditFlow</h1>
          <p className="text-lg opacity-90">Interne Audit Tool voor Poule & Poulette</p>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-lg">Laden...</p>
        </div>
        
        <p className="mt-4 text-sm opacity-75">
          Doorverwijzen naar AuditFlow...
        </p>
      </div>
    </div>
  )
}
