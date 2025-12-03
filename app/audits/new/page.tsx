'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { NewAuditForm } from '@/components/audit/NewAuditForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert } from '@/components/ui/Alert'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { clientDataService } from '@/lib/client-data'
import { Filiaal, AuditChecklistItem } from '@/types'
import { ArrowLeft } from 'lucide-react'

export default function NewAuditPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const filiaalId = searchParams.get('filiaal')

  const [filiaal, setFiliaal] = useState<Filiaal | null>(null)
  const [checklistItems, setChecklistItems] = useState<AuditChecklistItem[]>([])
  const [filialen, setFilialen] = useState<Filiaal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFiliaalSelector, setShowFiliaalSelector] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/pp-login')
      return
    }

    loadData()
  }, [user, router])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('Loading data...')

      // Load checklist items from Supabase
      console.log('Loading checklist items...')
      const checklistData = await clientDataService.getChecklistItems()
      console.log('Checklist items loaded:', checklistData.length)
      setChecklistItems(checklistData)

      // Load filialen from Supabase
      console.log('Loading filialen...')
      const filialenData = await clientDataService.getFilialen()
      console.log('Filialen loaded:', filialenData.length)
      setFilialen(filialenData)

      // If filiaalId is provided and it's not "all", load that specific filiaal
      if (filiaalId && filiaalId !== 'all') {
        console.log('Loading specific filiaal:', filiaalId)
        const filiaalData = await clientDataService.getFiliaalById(filiaalId)
        if (!filiaalData) {
          throw new Error('Filiaal niet gevonden')
        }
        console.log('Filiaal loaded:', filiaalData.naam)
        setFiliaal(filiaalData)
      } else {
        // Show filiaal selector if no filiaalId provided or if filiaalId is "all"
        console.log('No specific filiaalId or filiaalId is "all", showing selector')
        setShowFiliaalSelector(true)
      }

      console.log('Data loading completed successfully')

    } catch (err) {
      console.error('Error in loadData:', err)
      setError('Fout bij het laden van gegevens: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleFiliaalSelect = (selectedFiliaal: Filiaal) => {
    setFiliaal(selectedFiliaal)
    setShowFiliaalSelector(false)
  }

  if (loading) {
    return <LoadingSpinner text="Audit gegevens laden..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert variant="error">
            {error}
          </Alert>
        </div>
      </div>
    )
  }

  if (showFiliaalSelector) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <div className="mb-4">
              <Button
                variant="secondary"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Terug</span>
              </Button>
            </div>

            {/* Title Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Nieuwe Audit
                  </h1>
                  <p className="text-gray-600">
                    Selecteer een filiaal om een audit te starten
                  </p>
                </div>
              </CardHeader>
            </Card>

            {/* Filialen Grid */}
            <div className="grid gap-4">
              {filialen.map((filiaalItem) => (
                <Card key={filiaalItem.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardBody>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                          <img src="/logo_poule.png" alt="Poule & Poulette" className="h-6 w-auto" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {filiaalItem.naam}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {filiaalItem.locatie}
                          </p>
                          <p className="text-xs text-gray-500">
                            {filiaalItem.adres}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleFiliaalSelect(filiaalItem)}
                        size="sm"
                      >
                        Selecteren
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!filiaal || !checklistItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert variant="error">
            Filiaal of checklist items niet gevonden
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <NewAuditForm
          filiaal={filiaal}
          checklistItems={checklistItems}
          districtManager={user}
        />
      </div>
    </div>
  )
}
