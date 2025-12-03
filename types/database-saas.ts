export interface Database {
  public: {
    Tables: {
      // Multi-tenant SaaS tables
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          domain: string | null
          tier: 'starter' | 'professional' | 'enterprise'
          status: 'active' | 'suspended' | 'cancelled'
          
          // Branding
          primary_color: string
          secondary_color: string
          accent_color: string
          background_color: string
          text_color: string
          primary_font: string
          accent_font: string
          
          // Assets
          logo_url: string | null
          favicon_url: string | null
          
          // Subscription
          subscription_id: string | null
          subscription_status: 'active' | 'cancelled' | 'past_due' | 'unpaid'
          trial_ends_at: string | null
          subscription_ends_at: string | null
          
          // Limits
          max_users: number
          max_filialen: number
          max_audits_per_month: number
          
          // Metadata
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          domain?: string | null
          tier?: 'starter' | 'professional' | 'enterprise'
          status?: 'active' | 'suspended' | 'cancelled'
          
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          background_color?: string
          text_color?: string
          primary_font?: string
          accent_font?: string
          
          logo_url?: string | null
          favicon_url?: string | null
          
          subscription_id?: string | null
          subscription_status?: 'active' | 'cancelled' | 'past_due' | 'unpaid'
          trial_ends_at?: string | null
          subscription_ends_at?: string | null
          
          max_users?: number
          max_filialen?: number
          max_audits_per_month?: number
          
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          domain?: string | null
          tier?: 'starter' | 'professional' | 'enterprise'
          status?: 'active' | 'suspended' | 'cancelled'
          
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          background_color?: string
          text_color?: string
          primary_font?: string
          accent_font?: string
          
          logo_url?: string | null
          favicon_url?: string | null
          
          subscription_id?: string | null
          subscription_status?: 'active' | 'cancelled' | 'past_due' | 'unpaid'
          trial_ends_at?: string | null
          subscription_ends_at?: string | null
          
          max_users?: number
          max_filialen?: number
          max_audits_per_month?: number
          
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      
      organization_settings: {
        Row: {
          id: string
          organization_id: string
          setting_key: string
          setting_value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          setting_key: string
          setting_value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          setting_key?: string
          setting_value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      
      organization_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          tier: 'starter' | 'professional' | 'enterprise'
          
          primary_color: string | null
          secondary_color: string | null
          accent_color: string | null
          background_color: string | null
          text_color: string | null
          primary_font: string | null
          accent_font: string | null
          
          checklist_items: any | null
          default_roles: any | null
          
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          tier: 'starter' | 'professional' | 'enterprise'
          
          primary_color?: string | null
          secondary_color?: string | null
          accent_color?: string | null
          background_color?: string | null
          text_color?: string | null
          primary_font?: string | null
          accent_font?: string | null
          
          checklist_items?: any | null
          default_roles?: any | null
          
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          tier?: 'starter' | 'professional' | 'enterprise'
          
          primary_color?: string | null
          secondary_color?: string | null
          accent_color?: string | null
          background_color?: string | null
          text_color?: string | null
          primary_font?: string | null
          accent_font?: string | null
          
          checklist_items?: any | null
          default_roles?: any | null
          
          created_at?: string
          updated_at?: string
        }
      }
      
      subscription_plans: {
        Row: {
          id: string
          name: string
          tier: 'starter' | 'professional' | 'enterprise'
          price_monthly: number | null
          price_yearly: number | null
          
          max_users: number | null
          max_filialen: number | null
          max_audits_per_month: number | null
          custom_branding: boolean
          api_access: boolean
          priority_support: boolean
          
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          tier: 'starter' | 'professional' | 'enterprise'
          price_monthly?: number | null
          price_yearly?: number | null
          
          max_users?: number | null
          max_filialen?: number | null
          max_audits_per_month?: number | null
          custom_branding?: boolean
          api_access?: boolean
          priority_support?: boolean
          
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          tier?: 'starter' | 'professional' | 'enterprise'
          price_monthly?: number | null
          price_yearly?: number | null
          
          max_users?: number | null
          max_filialen?: number | null
          max_audits_per_month?: number | null
          custom_branding?: boolean
          api_access?: boolean
          priority_support?: boolean
          
          created_at?: string
          updated_at?: string
        }
      }

      // Updated existing tables with organization support
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
          organization_id: string
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
          organization_id: string
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
          organization_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      
      gebruikers: {
        Row: {
          id: string
          email: string
          naam: string
          rol: 'district_manager' | 'coo' | 'filiaal_manager' | 'admin' | 'inspector' | 'storemanager' | 'developer'
          telefoon: string
          actief: boolean
          organization_id: string
          subscription_status: 'active' | 'cancelled' | 'past_due' | 'unpaid'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          naam: string
          rol: 'district_manager' | 'coo' | 'filiaal_manager' | 'admin' | 'inspector' | 'storemanager' | 'developer'
          telefoon: string
          actief?: boolean
          organization_id: string
          subscription_status?: 'active' | 'cancelled' | 'past_due' | 'unpaid'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          naam?: string
          rol?: 'district_manager' | 'coo' | 'filiaal_manager' | 'admin' | 'inspector' | 'storemanager' | 'developer'
          telefoon?: string
          actief?: boolean
          organization_id?: string
          subscription_status?: 'active' | 'cancelled' | 'past_due' | 'unpaid'
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
          organization_id: string
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
          organization_id: string
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
          organization_id?: string
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
          organization_id: string
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
          organization_id: string
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
          organization_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      organization_stats: {
        Row: {
          id: string
          name: string
          slug: string
          tier: 'starter' | 'professional' | 'enterprise'
          status: 'active' | 'suspended' | 'cancelled'
          user_count: number
          filialen_count: number
          audits_count: number
          max_users: number
          max_filialen: number
          max_audits_per_month: number
          created_at: string
        }
      }
    }
    Functions: {
      create_organization: {
        Args: {
          org_name: string
          org_slug: string
          org_tier?: string
          created_by_user_id?: string
        }
        Returns: string
      }
      validate_organization_slug: {
        Args: {
          slug: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
