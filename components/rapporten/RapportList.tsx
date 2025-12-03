'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toaster'
import { Rapport } from '@/types'
import { formatDate } from '@/lib/utils'
import { 
  FileText, 
  Download, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  RefreshCw
} from 'lucide-react'

interface RapportListProps {
  rapporten: (Rapport & {
    audit: {
      id: string
      audit_datum: string
      totale_score: number
      pass_percentage: number
      filiaal: {
        naam: string
        locatie: string
      }
      district_manager: {
        naam: string
      }
    }
  })[]
  onRefresh: () => void
}

export const RapportList: React.FC<RapportListProps> = ({ rapporten, onRefresh }) => {
  const { addToast } = useToast()
  const [downloading, setDownloading] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-5 w-5 text-success-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-danger-600" />
      default:
        return <Clock className="h-5 w-5 text-warning-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Verzonden'
      case 'failed':
        return 'Mislukt'
      default:
        return 'In behandeling'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'badge-success'
      case 'failed':
        return 'badge-danger'
      default:
        return 'badge-warning'
    }
  }

  const handleDownload = async (rapport: Rapport) => {
    if (!rapport.rapport_url) {
      addToast({
        title: 'Rapport niet beschikbaar',
        message: 'Het rapport is nog niet gegenereerd',
        variant: 'warning'
      })
      return
    }

    try {
      setDownloading(rapport.id)
      
      // In a real implementation, this would download the actual PDF
      // For now, we'll simulate the download
      const link = document.createElement('a')
      link.href = rapport.rapport_url
      link.download = `audit-rapport-${rapport.audit.filiaal.naam}-${rapport.audit.audit_datum}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      addToast({
        title: 'Download gestart',
        message: 'Het rapport wordt gedownload',
        variant: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Download mislukt',
        message: 'Er is een fout opgetreden bij het downloaden',
        variant: 'error'
      })
    } finally {
      setDownloading(null)
    }
  }

  const handleViewAudit = (auditId: string) => {
    window.open(`/audits/detail?id=${auditId}`, '_blank')
  }

  if (rapporten.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Geen rapporten gevonden
            </h3>
            <p className="text-gray-500 mb-4">
              Er zijn nog geen rapporten gegenereerd.
            </p>
            <Button onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Vernieuwen
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-lino-caps text-gray-900">
          Rapporten
        </h1>
        <Button onClick={onRefresh} variant="secondary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Vernieuwen
        </Button>
      </div>

      <div className="space-y-3">
        {rapporten.map((rapport) => (
          <Card key={rapport.id} className="hover:shadow-md transition-shadow">
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(rapport.status)}
                    <h3 className="text-lg font-medium text-gray-900">
                      Audit Rapport - {rapport.audit.filiaal.naam}
                    </h3>
                    <span className={`badge ${getStatusColor(rapport.status)}`}>
                      {getStatusText(rapport.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Filiaal:</span> {rapport.audit.filiaal.naam} - {rapport.audit.filiaal.locatie}
                    </div>
                    <div>
                      <span className="font-medium">Datum:</span> {formatDate(rapport.audit.audit_datum)}
                    </div>
                    <div>
                      <span className="font-medium">Score:</span> {rapport.audit.totale_score.toFixed(1)}/5.0 ({rapport.audit.pass_percentage.toFixed(1)}%)
                    </div>
                  </div>


                  {rapport.verstuur_datum && (
                    <div className="mt-1 text-sm text-gray-500">
                      Verzonden op: {formatDate(rapport.verstuur_datum)}
                    </div>
                  )}
                </div>

                <div className="ml-4 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewAudit(rapport.audit.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Audit
                  </Button>
                  
                  {rapport.rapport_url && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(rapport)}
                      disabled={downloading === rapport.id}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      {downloading === rapport.id ? 'DOWNLOADEN...' : 'Download'}
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
