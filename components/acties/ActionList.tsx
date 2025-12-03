'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Action } from './Acties'

interface ActionListProps {
  actions: Action[]
  selectedAction: Action | null
  onActionSelect: (action: Action) => void
  getUrgencyColor: (urgentie: string) => string
  getStatusColor: (status: string) => string
  getUrgencyLabel: (urgentie: string) => string
  getStatusLabel: (status: string) => string
}

export const ActionList: React.FC<ActionListProps> = ({
  actions,
  selectedAction,
  onActionSelect,
  getUrgencyColor,
  getStatusColor,
  getUrgencyLabel,
  getStatusLabel
}) => {
  const router = useRouter()
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  if (actions.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <p>Geen acties gevonden</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <Card
          key={action.id}
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedAction?.id === action.id 
              ? 'ring-2 bg-[#f0f4f8]'
              + ' ' + 'ring-[#132938]' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => router.push(`/acties/detail?id=${action.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {action.titel}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(action.urgentie)}`}>
                  {getUrgencyLabel(action.urgentie)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(action.status)}`}>
                  {getStatusLabel(action.status)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {action.beschrijving}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {action.audit?.filialen && (
                  <span>
                    {action.audit.filialen.naam} - {action.audit.filialen.locatie}
                  </span>
                )}
                {action.deadline && (
                  <span className={isOverdue(action.deadline) && action.status !== 'completed' && action.status !== 'verified' ? 'text-red-600 font-medium' : ''}>
                    Deadline: {formatDate(action.deadline)}
                    {isOverdue(action.deadline) && action.status !== 'completed' && action.status !== 'verified' && ' (Verlopen)'}
                  </span>
                )}
                {action.toegewezen_gebruiker && (
                  <span>
                    Toegewezen aan: {action.toegewezen_gebruiker.naam}
                  </span>
                )}
              </div>
            </div>
            
            <div className="ml-4 flex-shrink-0">
              {action.audit_resultaat?.audit_checklist_items && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {action.audit_resultaat.audit_checklist_items.categorie}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Score: {action.audit_resultaat.score}/5
                  </div>
                  <div className="text-xs text-gray-500">
                    Gewicht: {action.audit_resultaat.audit_checklist_items.gewicht}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
