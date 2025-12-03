export interface Database {
  public: {
    Tables: {
      filialen: {
        Row: {
          id: string
          naam: string
          locatie: string
          district_manager_id: string
          adres: string
          telefoon: string
          email: string
          status: 'actief' | 'inactief'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          naam: string
          locatie: string
          district_manager_id: string
          adres: string
          telefoon: string
          email: string
          status?: 'actief' | 'inactief'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          naam?: string
          locatie?: string
          district_manager_id?: string
          adres?: string
          telefoon?: string
          email?: string
          status?: 'actief' | 'inactief'
          created_at?: string
          updated_at?: string
        }
      }
      gebruikers: {
        Row: {
          id: string
          email: string
          naam: string
          rol: 'district_manager' | 'coo' | 'filiaal_manager' | 'admin'
          telefoon: string
          actief: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          naam: string
          rol: 'district_manager' | 'coo' | 'filiaal_manager' | 'admin'
          telefoon: string
          actief?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          naam?: string
          rol?: 'district_manager' | 'coo' | 'filiaal_manager' | 'admin'
          telefoon?: string
          actief?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      audit_checklist_items: {
        Row: {
          id: string
          categorie: string
          titel: string
          beschrijving: string
          gewicht: number
          volgorde: number
          actief: boolean
          created_at: string
        }
        Insert: {
          id?: string
          categorie: string
          titel: string
          beschrijving: string
          gewicht: number
          volgorde: number
          actief?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          categorie?: string
          titel?: string
          beschrijving?: string
          gewicht?: number
          volgorde?: number
          actief?: boolean
          created_at?: string
        }
      }
      audits: {
        Row: {
          id: string
          filiaal_id: string
          district_manager_id: string
          audit_datum: string
          status: 'in_progress' | 'completed' | 'cancelled'
          totale_score: number
          pass_percentage: number
          opmerkingen: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filiaal_id: string
          district_manager_id: string
          audit_datum: string
          status?: 'in_progress' | 'completed' | 'cancelled'
          totale_score?: number
          pass_percentage?: number
          opmerkingen?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filiaal_id?: string
          district_manager_id?: string
          audit_datum?: string
          status?: 'in_progress' | 'completed' | 'cancelled'
          totale_score?: number
          pass_percentage?: number
          opmerkingen?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_resultaten: {
        Row: {
          id: string
          audit_id: string
          checklist_item_id: string
          resultaat: 'ok' | 'niet_ok'
          score: number
          opmerkingen: string | null
          foto_urls: string[]
          verbeterpunt: string | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          checklist_item_id: string
          resultaat: 'ok' | 'niet_ok'
          score: number
          opmerkingen?: string | null
          foto_urls?: string[]
          verbeterpunt?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          checklist_item_id?: string
          resultaat?: 'ok' | 'niet_ok'
          score?: number
          opmerkingen?: string | null
          foto_urls?: string[]
          verbeterpunt?: string | null
          created_at?: string
        }
      }
      rapporten: {
        Row: {
          id: string
          audit_id: string
          rapport_url: string | null
          verstuurd_naar: string[]
          verstuur_datum: string | null
          status: 'pending' | 'sent' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          rapport_url?: string | null
          verstuurd_naar?: string[]
          verstuur_datum?: string | null
          status?: 'pending' | 'sent' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          rapport_url?: string | null
          verstuurd_naar?: string[]
          verstuur_datum?: string | null
          status?: 'pending' | 'sent' | 'failed'
          created_at?: string
        }
      }
      acties: {
        Row: {
          id: string
          audit_id: string
          audit_resultaat_id: string
          titel: string
          beschrijving: string
          urgentie: 'low' | 'medium' | 'high' | 'critical'
          status: 'pending' | 'in_progress' | 'completed' | 'verified'
          toegewezen_aan: string | null
          deadline: string | null
          actie_onderneem: string | null
          foto_urls: string[]
          voltooid_door: string | null
          voltooid_op: string | null
          geverifieerd_door: string | null
          geverifieerd_op: string | null
          verificatie_opmerkingen: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          audit_resultaat_id: string
          titel: string
          beschrijving: string
          urgentie?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'pending' | 'in_progress' | 'completed' | 'verified'
          toegewezen_aan?: string | null
          deadline?: string | null
          actie_onderneem?: string | null
          foto_urls?: string[]
          voltooid_door?: string | null
          voltooid_op?: string | null
          geverifieerd_door?: string | null
          geverifieerd_op?: string | null
          verificatie_opmerkingen?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          audit_resultaat_id?: string
          titel?: string
          beschrijving?: string
          urgentie?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'pending' | 'in_progress' | 'completed' | 'verified'
          toegewezen_aan?: string | null
          deadline?: string | null
          actie_onderneem?: string | null
          foto_urls?: string[]
          voltooid_door?: string | null
          voltooid_op?: string | null
          geverifieerd_door?: string | null
          geverifieerd_op?: string | null
          verificatie_opmerkingen?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notificaties: {
        Row: {
          id: string
          gebruiker_id: string
          type: string
          titel: string
          bericht: string
          actie_id: string | null
          gelezen: boolean
          created_at: string
        }
        Insert: {
          id?: string
          gebruiker_id: string
          type: string
          titel: string
          bericht: string
          actie_id?: string | null
          gelezen?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          gebruiker_id?: string
          type?: string
          titel?: string
          bericht?: string
          actie_id?: string | null
          gelezen?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
