import { AuditResultaat, AuditChecklistItem } from '@/types'

export interface ScoringResult {
  totale_score: number
  pass_percentage: number
  is_pass: boolean
  breakdown: {
    item_id: string
    item_titel: string
    gewicht: number
    score: number
    gewogen_score: number
  }[]
}

/**
 * Calculate audit score based on results and checklist items
 * Uses a 0-5 scale with weighted scoring
 * Pass threshold is 80% (4.0/5.0)
 */
export const calculateAuditScore = (
  resultaten: AuditResultaat[],
  checklistItems: AuditChecklistItem[]
): ScoringResult => {
  const breakdown = resultaten.map(resultaat => {
    const item = checklistItems.find(item => item.id === resultaat.checklist_item_id)
    if (!item) {
      throw new Error(`Checklist item not found for resultaat ${resultaat.id}`)
    }

    // Convert result to 0-5 scale
    const score = resultaat.resultaat === 'ok' ? 5 : 0
    
    // Apply weight (default weight is 1)
    const gewogen_score = score * item.gewicht

    return {
      item_id: item.id,
      item_titel: item.titel,
      gewicht: item.gewicht,
      score,
      gewogen_score
    }
  })

  // Calculate total weighted score
  const totale_gewogen_score = breakdown.reduce((sum, item) => sum + item.gewogen_score, 0)
  const totale_gewicht = breakdown.reduce((sum, item) => sum + item.gewicht, 0)
  
  // Calculate average score (0-5 scale)
  const totale_score = totale_gewicht > 0 ? totale_gewogen_score / totale_gewicht : 0
  
  // Convert to percentage (0-100)
  const pass_percentage = (totale_score / 5) * 100
  
  // Pass threshold is 80%
  const is_pass = pass_percentage >= 80

  return {
    totale_score: Math.round(totale_score * 100) / 100, // Round to 2 decimals
    pass_percentage: Math.round(pass_percentage * 100) / 100,
    is_pass,
    breakdown
  }
}

/**
 * Get score color class for UI display
 */
export const getScoreColor = (score: number): string => {
  if (score >= 4.0) return 'text-success-600' // Green
  if (score >= 3.0) return 'text-warning-600' // Yellow
  return 'text-danger-600' // Red
}

/**
 * Get pass/fail status text
 */
export const getPassStatus = (isPass: boolean): { text: string; color: string } => {
  if (isPass) {
    return { text: 'Pass', color: 'text-success-600' }
  }
  return { text: 'Fail', color: 'text-danger-600' }
}

/**
 * Calculate KPI metrics for dashboard
 */
export interface KPIMetrics {
  totaal_audits: number
  gemiddelde_score: number
  pass_percentage: number
  verbeterpunten: {
    item: string
    frequentie: number
    laatste_voorkomen: string
  }[]
}

export const calculateKPIMetrics = (
  audits: Array<{ totale_score: number; pass_percentage: number; created_at: string }>,
  resultaten: Array<{ checklist_item_id: string; resultaat: 'ok' | 'niet_ok'; created_at: string }>,
  checklistItems: AuditChecklistItem[]
): KPIMetrics => {
  const totaal_audits = audits.length
  
  if (totaal_audits === 0) {
    return {
      totaal_audits: 0,
      gemiddelde_score: 0,
      pass_percentage: 0,
      verbeterpunten: []
    }
  }

  const gemiddelde_score = audits.reduce((sum, audit) => sum + audit.totale_score, 0) / totaal_audits
  const pass_percentage = audits.reduce((sum, audit) => sum + (audit.pass_percentage >= 80 ? 1 : 0), 0) / totaal_audits * 100

  // Calculate improvement points (items that failed most frequently)
  const failedResults = resultaten.filter(r => r.resultaat === 'niet_ok')
  const itemFailures = new Map<string, { count: number; lastOccurrence: string }>()
  
  failedResults.forEach(result => {
    const existing = itemFailures.get(result.checklist_item_id)
    if (existing) {
      existing.count++
      if (result.created_at > existing.lastOccurrence) {
        existing.lastOccurrence = result.created_at
      }
    } else {
      itemFailures.set(result.checklist_item_id, {
        count: 1,
        lastOccurrence: result.created_at
      })
    }
  })

  const verbeterpunten = Array.from(itemFailures.entries())
    .map(([itemId, data]) => {
      const item = checklistItems.find(i => i.id === itemId)
      return {
        item: item?.titel || 'Onbekend item',
        frequentie: data.count,
        laatste_voorkomen: data.lastOccurrence
      }
    })
    .sort((a, b) => b.frequentie - a.frequentie)
    .slice(0, 5) // Top 5 improvement points

  return {
    totaal_audits,
    gemiddelde_score: Math.round(gemiddelde_score * 100) / 100,
    pass_percentage: Math.round(pass_percentage * 100) / 100,
    verbeterpunten
  }
}
