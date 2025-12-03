import { Database } from './database'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Type aliases for easier use
export type Filiaal = Tables<'filialen'>
export type Gebruiker = Tables<'gebruikers'>
export type AuditChecklistItem = Tables<'audit_checklist_items'>
export type Audit = Tables<'audits'>
export type AuditResultaat = Tables<'audit_resultaten'>
export type Rapport = Tables<'rapporten'>

// Extended types with relations
export interface AuditWithDetails extends Audit {
  filiaal: Filiaal
  district_manager: Gebruiker
  resultaten: (AuditResultaat & {
    checklist_item: AuditChecklistItem
  })[]
  rapport?: Rapport
}

export interface FiliaalWithStats extends Filiaal {
  district_manager: Gebruiker
  recente_audits: Audit[]
  gemiddelde_score: number
  pass_percentage: number
  totaal_audits: number
}

// Form types
export interface AuditFormData {
  filiaal_id: string
  audit_datum: string
  resultaten: {
    checklist_item_id: string
    resultaat: 'ok' | 'niet_ok'
    opmerkingen?: string
    foto_urls?: string[]
    verbeterpunt?: string
  }[]
  opmerkingen?: string
}

// KPI types
export interface KPIData {
  totaal_audits: number
  gemiddelde_score: number
  pass_percentage: number
  verbeterpunten: {
    item: string
    frequentie: number
    laatste_voorkomen: string
  }[]
  trends: {
    periode: string
    score: number
    audits: number
  }[]
}

// Dashboard filter types
export interface DashboardFilters {
  filiaal_id?: string
  datum_van?: string
  datum_tot?: string
  score_min?: number
  score_max?: number
  status?: 'pass' | 'fail'
}

// User roles
export type UserRole = 'admin' | 'inspector' | 'storemanager' | 'developer'

// Audit status
export type AuditStatus = 'in_progress' | 'completed' | 'cancelled'

// Result types
export type AuditResult = 'ok' | 'niet_ok'

// Report status
export type ReportStatus = 'pending' | 'sent' | 'failed'
