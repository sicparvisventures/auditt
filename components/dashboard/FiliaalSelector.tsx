'use client'

import React from 'react'
import { Filiaal } from '@/types'
import { Card, CardBody } from '@/components/ui/Card'
import { Building2, ChevronDown } from 'lucide-react'

interface FiliaalSelectorProps {
  filialen: Filiaal[]
  selectedFiliaal: string
  onFiliaalChange: (filiaalId: string) => void
  userRole?: string
}

export const FiliaalSelector: React.FC<FiliaalSelectorProps> = ({
  filialen,
  selectedFiliaal,
  onFiliaalChange,
  userRole
}) => {
  const selectedFiliaalData = filialen.find(f => f.id === selectedFiliaal)
  const canSelectAll = userRole === 'admin' || userRole === 'inspector'

  return (
    <Card>
      <CardBody className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-lg font-lino-caps text-gray-900">
                Geselecteerd Filiaal
              </h2>
              {selectedFiliaal === 'all' ? (
                <p className="text-xs sm:text-sm font-lino text-gray-600 truncate">
                  Alle Filialen
                </p>
              ) : selectedFiliaalData ? (
                <p className="text-xs sm:text-sm font-lino text-gray-600 truncate">
                  {selectedFiliaalData.naam}
                </p>
              ) : null}
            </div>
          </div>

          <div className="relative flex-shrink-0">
            <select
              value={selectedFiliaal}
              onChange={(e) => onFiliaalChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto min-w-[140px]"
            >
              {canSelectAll && (
                <option value="all">
                  Alle Filialen
                </option>
              )}
              {filialen.map((filiaal) => (
                <option key={filiaal.id} value={filiaal.id}>
                  {filiaal.naam}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
