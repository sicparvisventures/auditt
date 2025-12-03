// Verbeterde Email Service met PDF support
import { AuditWithDetails } from '@/types'
import { pdfService } from './pdf-service'
import { formatDate, formatScore, formatPercentage } from './utils'
import { supabaseDb } from './supabase-db'

export interface EmailRecipients {
  filiaal_email: string
  manager_email: string
  district_manager_email?: string
}

export class EmailServiceUpgrade {
  /**
   * Verstuur audit rapport via email met PDF bijlage
   */
  static async sendAuditReportWithPDF(audit: AuditWithDetails): Promise<{
    success: boolean
    pdfUrl?: string
    error?: string
  }> {
    try {
      // 1. Genereer en upload PDF
      console.log('📄 Generating PDF for audit:', audit.id)
      const pdfResult = await pdfService.generateAndUploadPDF(audit)

      if (!pdfResult.success || !pdfResult.pdfUrl) {
        return {
          success: false,
          error: pdfResult.error || 'PDF generation failed'
        }
      }

      console.log('✅ PDF generated and uploaded:', pdfResult.pdfUrl)

      // 2. Update rapport in database met PDF URL
      try {
        await supabaseDb.sendAuditReport(audit.id)
        console.log('✅ Report saved to database')
      } catch (dbError) {
        console.warn('⚠️ Database update failed:', dbError)
        // Continue anyway - PDF is generated
      }

      // 3. Open email client met PDF link
      const recipients = this.getRecipientEmails(audit)
      const emailContent = this.generateEmailContent(audit, pdfResult.pdfUrl)
      
      // Open mailto link (PDF URL wordt in email body gezet)
      const mailtoLink = this.createMailtoLink({
        to: [recipients.filiaal_email, recipients.manager_email].filter(Boolean).join(','),
        subject: emailContent.subject,
        body: emailContent.body,
        pdfUrl: pdfResult.pdfUrl
      })

      window.open(mailtoLink, '_blank')

      return {
        success: true,
        pdfUrl: pdfResult.pdfUrl
      }
    } catch (error: any) {
      console.error('❌ Email send error:', error)
      return {
        success: false,
        error: error.message || 'Email send failed'
      }
    }
  }

  /**
   * Haal ontvanger emails op op basis van filiaal
   */
  private static getRecipientEmails(audit: AuditWithDetails): EmailRecipients {
    const filiaalNaam = audit.filiaal.naam.toLowerCase()
    const filiaalEmail = audit.filiaal.email || 'info@poulepoulette.com'
    
    // Email mapping (zou uit database moeten komen, maar voor nu hardcoded)
    let managerEmail = 'district@poulepoulette.be'
    
    if (filiaalNaam.includes('gent') || filiaalNaam.includes('km')) {
      managerEmail = 'CVH@POULEPOULETTE.COM'
    } else if (filiaalNaam.includes('mechelen') || filiaalNaam.includes('il')) {
      managerEmail = 'JDM@POULEPOULETTE.COM'
    } else if (filiaalNaam.includes('antwerpen')) {
      managerEmail = 'JR@POULEPOULETTE.COM'
    } else if (filiaalNaam.includes('etterbeek') || filiaalNaam.includes('pj')) {
      managerEmail = 'MP@POULEPOULETTE.COM'
    } else if (filiaalNaam.includes('leuven') || filiaalNaam.includes('ts')) {
      managerEmail = 'DI@POULEPOULETTE.COM'
    } else if (filiaalNaam.includes('gk')) {
      managerEmail = 'JC@POULEPOULETTE.COM'
    } else if (filiaalNaam.includes('oostende') || filiaalNaam.includes('ll')) {
      managerEmail = 'MB@POULEPOULETTE.COM'
    } else if (filiaalNaam.includes('sc')) {
      managerEmail = 'MF@POULEPOULETTE.COM'
    } else if (filiaalNaam.includes('brugge') || filiaalNaam.includes('ss')) {
      managerEmail = 'SM@POULEPOULETTE.COM'
    }

    return {
      filiaal_email: filiaalEmail,
      manager_email: managerEmail,
      district_manager_email: audit.district_manager.email || undefined
    }
  }

  /**
   * Genereer email content
   */
  private static generateEmailContent(audit: AuditWithDetails, pdfUrl: string): {
    subject: string
    body: string
  } {
    const passStatus = audit.pass_percentage >= 80 ? 'PASSED' : 'FAILED'
    const subject = `Audit Rapport - ${audit.filiaal.naam} (${passStatus})`
    
    const body = `Beste collega,

Hierbij wordt het audit rapport voor filiaal ${audit.filiaal.naam} gedeeld.

AUDIT SAMENVATTING:
• Filiaal: ${audit.filiaal.naam} - ${audit.filiaal.locatie}
• Audit datum: ${formatDate(audit.audit_datum)}
• Auditor: ${audit.district_manager.naam}
• Totaal score: ${formatScore(audit.totale_score)}/5.0
• Percentage: ${formatPercentage(audit.pass_percentage)}
• Status: ${passStatus}

${audit.opmerkingen ? `ALGEMENE OPMERKINGEN:\n${audit.opmerkingen}\n` : ''}

Het volledige rapport met foto's en gedetailleerde bevindingen is beschikbaar via deze link:
${pdfUrl}

Of download het PDF bestand direct via de bovenstaande link.

Met vriendelijke groeten,
${audit.district_manager.naam}
District Manager`

    return { subject, body }
  }

  /**
   * Maak mailto link
   */
  private static createMailtoLink(params: {
    to: string
    subject: string
    body: string
    pdfUrl?: string
  }): string {
    const { to, subject, body, pdfUrl } = params
    
    // Mailto links ondersteunen geen bijlagen, dus voeg PDF URL toe aan body
    const fullBody = pdfUrl 
      ? `${body}\n\nPDF Download Link: ${pdfUrl}`
      : body

    const paramsArray = [
      `to=${encodeURIComponent(to)}`,
      `subject=${encodeURIComponent(subject)}`,
      `body=${encodeURIComponent(fullBody)}`
    ]

    return `mailto:${to}?${paramsArray.join('&')}`
  }

  /**
   * Voor automatische email verzending (vereist Supabase Edge Function of externe service)
   * Deze functie kan worden aangeroepen vanuit een Edge Function
   */
  static async sendEmailAutomatically(
    audit: AuditWithDetails,
    recipients: EmailRecipients,
    pdfUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    // Deze functie zou een API call maken naar een Edge Function of externe email service
    // Voor nu returnen we een placeholder
    console.log('📧 Would send email automatically:', {
      recipients,
      pdfUrl,
      auditId: audit.id
    })

    // TODO: Implementeer API call naar Edge Function
    // Example:
    // const { data, error } = await supabase.functions.invoke('send-email', {
    //   body: { audit, recipients, pdfUrl }
    // })

    return {
      success: false,
      error: 'Automatic email sending requires Edge Function setup'
    }
  }
}

