// Backup types for PDF export functionality

export interface AuditData {
  filiaal: {
    naam: string
    locatie: string
  }
  audit_datum: string
  district_manager: {
    naam: string
  }
  totale_score: number
  pass_percentage: number
  resultaten: Array<{
    checklist_item: {
      categorie: string
      titel: string
      beschrijving: string
      gewicht: number
    }
    resultaat: 'ok' | 'niet_ok'
    score: number
    opmerkingen: string | null
    verbeterpunt: string | null
    foto_urls: string[]
  }>
  opmerkingen: string | null
}

export interface EmailRecipients {
  filiaal_email: string
  manager_email: string | null
  district_manager_email?: string
}

