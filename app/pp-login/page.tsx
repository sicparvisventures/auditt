'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { Building2 } from 'lucide-react'
import Image from 'next/image'

export default function PPLoginPage() {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { signIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn(userId)
      
      if (result.success) {
        // Redirect naar PP dashboard
        router.push('/pp-dashboard')
        router.refresh()
      } else {
        setError(result.error || 'Inloggen mislukt')
      }
    } catch (err) {
      setError('Er is een onverwachte fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8" style={{backgroundImage: 'url(/pp1.jpg)'}}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 max-w-md w-full -mt-24">
        <div className="bg-olive bg-opacity-90 rounded-lg shadow-lg border border-primary-600">
          {/* Header Section */}
          <div className="text-center px-6 pt-6 pb-4 border-b border-primary-600 border-opacity-30">
            <div className="flex justify-center mb-4">
              <img src="/logo.svg" alt="Poule & Poulette Logo" className="h-16 w-auto" />
            </div>
            <p className="mt-2 text-sm text-ppwhite">
              Interne Audit Tool
            </p>
          </div>

          {/* Form Section */}
          <div className="px-6 py-6">
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <Alert variant="error" className="bg-red-950 border-red-800 text-red-100">
                  {error}
                </Alert>
              )}

              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-ppwhite mb-1">
                  User ID
                </label>
                <Input
                  id="userId"
                  name="userId"
                  type="text"
                  autoComplete="username"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase())}
                  placeholder="Voer uw 5-cijferige User ID in"
                  maxLength={5}
                  className="bg-ppwhite border-primary-300 text-ppblack placeholder-primary-500 focus:border-olive focus:ring-olive"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-christmas hover:bg-accent-900 text-ppwhite font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2">
                        <Image
                          src="/pootje.png"
                          alt="LADEN..."
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                      </div>
                      <span className="font-bacon uppercase">INLOGGEN...</span>
                    </>
                  ) : (
                    'Inloggen'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center mt-6 space-y-4">
          <p className="text-xs text-primary-300 flex items-center justify-center gap-2">
            Voor technische ondersteuning:{' '}
            <a 
              href="mailto:sicparvisventures@gmail.com?subject=Technische ondersteuning Interne Audit Tool&body=Hallo,%0D%0A%0D%0AIk heb technische ondersteuning nodig voor de Interne Audit Tool.%0D%0A%0D%0ABeschrijf hier uw probleem:%0D%0A%0D%0AMet vriendelijke groet"
              className="text-christmas hover:text-accent-900 transition-colors duration-200 cursor-pointer"
            >
              <Image
                src="/been.png"
                alt="Technische ondersteuning"
                width={20}
                height={20}
                className="object-contain mix-blend-multiply hover:mix-blend-normal filter brightness-110 contrast-125"
              />
            </a>
          </p>
          
          <button
            onClick={() => router.push('/organization-login')}
            className="text-sm text-primary-300 hover:text-white underline transition-colors"
          >
            ← Terug naar organisatie selectie
          </button>
        </div>
      </div>
    </div>
  )
}