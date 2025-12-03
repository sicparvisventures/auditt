'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toaster'
import { AuditChecklistItem, Filiaal, Gebruiker, AuditFormData } from '@/types'
import { clientDataService } from '@/lib/client-data'
import { formatDate } from '@/lib/utils'
import { 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  XCircle, 
  Camera,
  MessageSquare,
  Lightbulb
} from 'lucide-react'
import { PhotoUpload } from './PhotoUpload'

interface NewAuditFormProps {
  filiaal: Filiaal
  checklistItems: AuditChecklistItem[]
  districtManager: Gebruiker
}

export const NewAuditForm: React.FC<NewAuditFormProps> = ({
  filiaal,
  checklistItems,
  districtManager
}) => {
  const router = useRouter()
  const { addToast } = useToast()
  
  const [formData, setFormData] = useState<AuditFormData>({
    filiaal_id: filiaal.id,
    audit_datum: new Date().toISOString(), // Gebruik volledige timestamp in plaats van alleen datum
    resultaten: checklistItems.map(item => ({
      checklist_item_id: item.id,
      resultaat: 'ok' as const,
      opmerkingen: '',
      foto_urls: [],
      verbeterpunt: ''
    })),
    opmerkingen: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(0)

  const handleResultChange = (itemId: string, resultaat: 'ok' | 'niet_ok') => {
    setFormData(prev => ({
      ...prev,
      resultaten: prev.resultaten.map(result =>
        result.checklist_item_id === itemId
          ? { ...result, resultaat }
          : result
      )
    }))
  }

  const handleOpmerkingenChange = (itemId: string, opmerkingen: string) => {
    setFormData(prev => ({
      ...prev,
      resultaten: prev.resultaten.map(result =>
        result.checklist_item_id === itemId
          ? { ...result, opmerkingen }
          : result
      )
    }))
  }

  const handleVerbeterpuntChange = (itemId: string, verbeterpunt: string) => {
    setFormData(prev => ({
      ...prev,
      resultaten: prev.resultaten.map(result =>
        result.checklist_item_id === itemId
          ? { ...result, verbeterpunt }
          : result
      )
    }))
  }

  const handlePhotoUpload = (itemId: string, photoUrls: string[]) => {
    setFormData(prev => ({
      ...prev,
      resultaten: prev.resultaten.map(result =>
        result.checklist_item_id === itemId
          ? { ...result, foto_urls: photoUrls }
          : result
      )
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError('')

      // Calculate scores
      const checklistItems = await clientDataService.getChecklistItems()
      let totalScore = 0
      let totalWeight = 0
      let passCount = 0

      formData.resultaten.forEach(result => {
        const item = checklistItems.find(i => i.id === result.checklist_item_id)
        if (item) {
          const score = result.resultaat === 'ok' ? 5 : 0
          totalScore += score * item.gewicht
          totalWeight += item.gewicht
          if (result.resultaat === 'ok') passCount++
        }
      })

      const averageScore = totalWeight > 0 ? totalScore / totalWeight : 0
      const passPercentage = checklistItems.length > 0 ? (passCount / checklistItems.length) * 100 : 0

      // Create audit record (let Supabase generate UUID)
      const newAudit = {
        filiaal_id: formData.filiaal_id,
        district_manager_id: districtManager.id,
        audit_datum: formData.audit_datum,
        status: 'completed' as const,
        totale_score: Math.round(averageScore * 100) / 100,
        pass_percentage: Math.round(passPercentage * 100) / 100,
        opmerkingen: formData.opmerkingen
      }

      // Add audit to database (Supabase generates UUID)
      const createdAudit = await clientDataService.createAudit(newAudit)
      const auditId = createdAudit.id

      // Save audit results with photos
      console.log('🔍 NewAuditForm - About to save results for audit:', auditId)
      console.log('📊 NewAuditForm - Form data resultaten:', formData.resultaten)
      console.log('📊 NewAuditForm - Form data resultaten length:', formData.resultaten.length)
      
      // Log each result in detail
      formData.resultaten.forEach((result, index) => {
        console.log(`📋 Result ${index + 1}:`, {
          checklist_item_id: result.checklist_item_id,
          resultaat: result.resultaat,
          opmerkingen: result.opmerkingen,
          verbeterpunt: result.verbeterpunt,
          foto_urls: result.foto_urls,
          foto_count: result.foto_urls?.length || 0
        })
      })
      
      // Clean and save audit results (only Supabase)
      const cleanedResults = formData.resultaten.map(result => ({
        ...result,
        opmerkingen: result.opmerkingen?.trim() || null,
        verbeterpunt: result.verbeterpunt?.trim() || null
      }))
      
      console.log('🧹 Cleaned results before saving:', cleanedResults.map(r => ({
        checklist_item_id: r.checklist_item_id,
        opmerkingen: r.opmerkingen,
        verbeterpunt: r.verbeterpunt
      })))
      
      await clientDataService.addAuditResults(auditId, cleanedResults)

      // Show success message with audit ID
      alert(`Audit succesvol opgeslagen! Audit ID: ${auditId}. Controleer de console voor debug informatie.`)

      // Create actions from audit results
      console.log('🔧 Creating actions from audit results...')
      let actionsCreated = await clientDataService.createActionsFromAuditResults(auditId)
      
      // If database functions don't exist, try manual creation
      if (!actionsCreated) {
        console.log('⚠️ Database functions not available, trying manual creation...')
        actionsCreated = await clientDataService.createActionsManually(auditId)
      }
      
      if (actionsCreated) {
        console.log('✅ Actions created successfully')
        addToast({
          title: 'Audit voltooid',
          message: 'De audit is succesvol opgeslagen en acties zijn aangemaakt',
          variant: 'success'
        })
      } else {
        console.log('⚠️ Failed to create actions')
        addToast({
          title: 'Audit voltooid',
          message: 'De audit is opgeslagen, maar er was een probleem met het aanmaken van acties',
          variant: 'warning'
        })
      }

      // Navigate to audit detail page to view the created audit
      router.push(`/audits/detail?id=${auditId}`)

    } catch (err) {
      setError('Fout bij het opslaan van de audit')
      console.error('Error saving audit:', err)
    } finally {
      setLoading(false)
    }
  }

  const getProgress = () => {
    const completed = formData.resultaten.filter(r => r.resultaat !== 'ok' || r.opmerkingen).length
    return (completed / formData.resultaten.length) * 100
  }

  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.categorie]) {
      acc[item.categorie] = []
    }
    acc[item.categorie].push(item)
    return acc
  }, {} as Record<string, AuditChecklistItem[]>)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-lino-caps text-gray-900">
              Nieuwe Audit
            </h1>
            <p className="text-gray-600">
              {filiaal.naam} - {filiaal.locatie}
            </p>
            <p className="text-sm text-gray-500">
              Door: {districtManager.naam} • {formatDate(formData.audit_datum)}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              Voortgang
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(getProgress())}% voltooid
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Checklist Items */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([categorie, items]) => (
          <Card key={categorie}>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">
                {categorie}
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                {items.map((item) => {
                  const result = formData.resultaten.find(r => r.checklist_item_id === item.id)
                  if (!result) return null

                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.titel}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.beschrijving}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="text-xs text-gray-500">
                            Gewicht: {item.gewicht}
                          </span>
                        </div>
                      </div>

                      {/* Result Selection */}
                      <div className="flex items-center space-x-4 mb-4">
                        <button
                          onClick={() => handleResultChange(item.id, 'ok')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                            result.resultaat === 'ok'
                              ? 'border-success-500 bg-success-50 text-success-700'
                              : 'border-gray-300 hover:border-success-300'
                          }`}
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span>OK</span>
                        </button>

                        <button
                          onClick={() => handleResultChange(item.id, 'niet_ok')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                            result.resultaat === 'niet_ok'
                              ? 'border-danger-500 bg-danger-50 text-danger-700'
                              : 'border-gray-300 hover:border-danger-300'
                          }`}
                        >
                          <XCircle className="h-5 w-5" />
                          <span>Niet OK</span>
                        </button>
                      </div>

                      {/* Opmerkingen */}
                      <div className="mb-4">
                        <label className="form-label">
                          <MessageSquare className="h-4 w-4 inline mr-1" />
                          Opmerkingen
                        </label>
                        <textarea
                          value={result.opmerkingen}
                          onChange={(e) => handleOpmerkingenChange(item.id, e.target.value)}
                          className="form-input"
                          rows={2}
                          placeholder="Voeg opmerkingen toe..."
                        />
                      </div>

                      {/* Verbeterpunt (only for niet_ok) */}
                      {result.resultaat === 'niet_ok' && (
                        <div className="mb-4">
                          <label className="form-label">
                            <Lightbulb className="h-4 w-4 inline mr-1" />
                            Verbeterpunt
                          </label>
                          <textarea
                            value={result.verbeterpunt}
                            onChange={(e) => handleVerbeterpuntChange(item.id, e.target.value)}
                            className="form-input"
                            rows={2}
                            placeholder="Beschrijf het verbeterpunt..."
                            required
                          />
                        </div>
                      )}

                {/* Photo Upload */}
                <div>
                  <label className="form-label">
                    <Camera className="h-4 w-4 inline mr-1" />
                    Foto's
                  </label>
                  <PhotoUpload
                    itemId={item.id}
                    currentPhotos={formData.resultaten.find(r => r.checklist_item_id === item.id)?.foto_urls || []}
                    onPhotosChange={handlePhotoUpload}
                  />
                </div>
                    </div>
                  )
                })}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* General Opmerkingen */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Algemene Opmerkingen
          </h2>
        </CardHeader>
        <CardBody>
          <textarea
            value={formData.opmerkingen}
            onChange={(e) => setFormData(prev => ({ ...prev, opmerkingen: e.target.value }))}
            className="form-input"
            rows={4}
            placeholder="Voeg algemene opmerkingen toe over de audit..."
          />
        </CardBody>
      </Card>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          size="lg"
        >
          {loading ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Opslaan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Audit Voltooien
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
