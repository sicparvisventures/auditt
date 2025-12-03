'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Audit } from '@/types'
import { 
  Calendar, 
  User, 
  CheckCircle, 
  XCircle, 
  Eye,
  FileText,
  Clock,
  Trash2
} from 'lucide-react'
import { formatDate, formatScore, formatPercentage, getPassStatus } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { clientDataService } from '@/lib/client-data'

interface AuditListProps {
  audits: Audit[]
  filiaalId: string
  onAuditDeleted?: () => void
}

export const AuditList: React.FC<AuditListProps> = ({ audits, filiaalId, onAuditDeleted }) => {
  const router = useRouter()
  const { user } = useAuth()
  const [deletingAuditId, setDeletingAuditId] = useState<string | null>(null)

  const handleViewAudit = (auditId: string) => {
    router.push(`/audits/detail?id=${auditId}`)
  }

  const handleNewAudit = () => {
    if (filiaalId && filiaalId !== 'all') {
      router.push(`/audits/new?filiaal=${filiaalId}`)
    } else {
      router.push('/audits/new')
    }
  }

  const handleDeleteAudit = async (auditId: string) => {
    if (!user || user.rol !== 'admin') {
      return
    }

    if (!confirm('Weet je zeker dat je deze audit wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
      return
    }

    try {
      setDeletingAuditId(auditId)
      await clientDataService.deleteAudit(auditId)
      
      // Refresh the audit list
      if (onAuditDeleted) {
        onAuditDeleted()
      }
    } catch (error) {
      console.error('Error deleting audit:', error)
      alert('Er is een fout opgetreden bij het verwijderen van de audit.')
    } finally {
      setDeletingAuditId(null)
    }
  }

  if (audits.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Geen audits gevonden
            </h3>
            <p className="text-gray-500 mb-4">
              Er zijn nog geen audits uitgevoerd voor dit filiaal.
            </p>
            <Button onClick={handleNewAudit}>
              Nieuwe Audit Starten
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-lino-caps text-gray-900">
          Recente Audits
        </h2>
        <Button onClick={handleNewAudit}>
          Nieuwe Audit
        </Button>
      </div>

      <div className="space-y-3">
        {audits.map((audit) => {
          const passStatus = getPassStatus(audit.pass_percentage >= 80)
          const StatusIcon = audit.pass_percentage >= 80 ? CheckCircle : XCircle

          return (
            <Card key={audit.id} className="hover:shadow-md transition-shadow">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <StatusIcon className={`h-5 w-5 ${passStatus.color}`} />
                      <h3 className="text-lg font-medium text-gray-900">
                        Audit van {formatDate(audit.audit_datum)}
                      </h3>
                      <span className={`badge ${audit.pass_percentage >= 80 ? 'badge-success' : 'badge-danger'}`}>
                        {passStatus.text}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(audit.audit_datum)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{audit.district_manager?.naam || 'Onbekend'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span>Score: {formatScore(audit.totale_score)}/5.0</span>
                        <span>({formatPercentage(audit.pass_percentage)})</span>
                      </div>
                    </div>

                    {audit.opmerkingen && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {audit.opmerkingen}
                      </p>
                    )}
                  </div>

                  <div className="ml-4 flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAudit(audit.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Bekijken
                    </Button>
                    
                    {user?.rol === 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAudit(audit.id)}
                        disabled={deletingAuditId === audit.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingAuditId === audit.id ? 'Verwijderen...' : ''}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">
                        Status: {audit.status === 'completed' ? 'Voltooid' : audit.status === 'in_progress' ? 'Bezig' : 'Geannuleerd'}
                      </span>
                      <span className="text-gray-500">
                        Aangemaakt: {formatDate(audit.created_at)}
                      </span>
                    </div>
                    
                    {audit.status === 'in_progress' && (
                      <div className="flex items-center space-x-1 text-warning-600">
                        <Clock className="h-4 w-4" />
                        <span>In behandeling</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
