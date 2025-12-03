'use client'

import React from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { KPIData } from '@/types'
import { formatScore, formatPercentage } from '@/lib/utils'

interface KPICardsProps {
  kpiData: KPIData | null
  filiaalNaam: string
}

export const KPICards: React.FC<KPICardsProps> = ({ kpiData, filiaalNaam }) => {
  if (!kpiData) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardBody className="p-4">
              <div className="h-16 bg-neutral-200 rounded"></div>
            </CardBody>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Totaal Audits',
      value: kpiData.totaal_audits.toString(),
      description: 'Uitgevoerde audits'
    },
    {
      title: 'Gemiddelde Score',
      value: formatScore(kpiData.gemiddelde_score),
      description: 'Op schaal van 0-5'
    },
    {
      title: 'Pass Percentage',
      value: formatPercentage(kpiData.pass_percentage),
      description: 'Audits met score ≥ 80%'
    },
    {
      title: 'Verbeterpunten',
      value: kpiData.verbeterpunten.length.toString(),
      description: 'Terugkerende problemen'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, index) => {
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardBody className="p-4">
                <div className="text-center">
                  <p className="text-xs font-medium text-olive mb-1">
                    {card.title}
                  </p>
                  <p className="text-lg font-semibold text-ppblack mb-1">
                    {card.value}
                  </p>
                  <p className="text-xs text-primary-600 leading-tight">
                    {card.description}
                  </p>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {kpiData.verbeterpunten.length > 0 && (
        <Card>
          <CardBody>
            <h3 className="text-lg font-lino-caps text-neutral-900 mb-4">
              Top Verbeterpunten - {filiaalNaam}
            </h3>
            <div className="space-y-3">
              {kpiData.verbeterpunten.map((punt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">
                      {punt.item}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Laatste voorkomen: {new Date(punt.laatste_voorkomen).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                      {punt.frequentie}x
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
