// Working email service implementation
import { SimpleAuditData } from './working-pdf-export'

export class WorkingEmailService {
  static getRecipientEmails(filialNaam: string): { filiaal_email: string; manager_email: string } {
    // Simple mapping based on filial name patterns
    const naamlLower = filialNaam.toLowerCase()
    
    if (naamlLower.includes('gent') || naamlLower.includes('km')) {
      return {
        filiaal_email: 'km11@poulepoulette.com',
        manager_email: 'CVH@POULEPOULETTE.COM'
      }
    } else if (naamlLower.includes('mechelen') || naamlLower.includes('il')) {
      return {
        filiaal_email: 'il36@poulepoulette.com',
        manager_email: 'JDM@POULEPOULETTE.COM'
      }
    } else if (naamlLower.includes('antwerpen')) {
      return {
        filiaal_email: 'tl24@poulepoulette.com',
        manager_email: 'JR@POULEPOULETTE.COM'
      }
    } else {
      // Default fallback
      return {
        filiaal_email: 'info@poulepoulette.com',
        manager_email: 'district@poulepoulette.be'
      }
    }
  }

  static createEmailContent(auditData: SimpleAuditData): string {
    const passStatus = auditData.pass_percentage >= 80 ? 'PASSED' : 'FAILED'
    
    return `Beste collega,

Hierbij wordt het audit rapport voor filiaal ${auditData.filiaal.naam} gedeeld.

AUDIT SAMENVATTING:
• Filiaal: ${auditData.filiaal.naam} - ${auditData.filiaal.locatie}
• Audit datum: ${auditData.audit_datum}
• Auditor: ${auditData.district_manager.naam}
• Totaal score: ${auditData.totale_score}/5.0
• Percentage: ${auditData.pass_percentage}%
• Status: ${passStatus}

${auditData.opmerkingen ? `ALGEMENE OPMERKINGEN:\n${auditData.opmerkingen}\n` : ''}

Het volledige rapport is bijgevoegd als PDF.

Met vriendelijke groeten,
${auditData.district_manager.naam}
District Manager`
  }

  static openMailApp(auditData: SimpleAuditData): void {
    try {
      const recipients = this.getRecipientEmails(auditData.filiaal.naam)
      const passStatus = auditData.pass_percentage >= 80 ? 'PASSED' : 'FAILED'
      
      const subject = `Audit Rapport - ${auditData.filiaal.naam} (${passStatus})`
      const body = this.createEmailContent(auditData)
      
      // Create recipient list
      const toEmail = recipients.filiaal_email
      const ccEmail = recipients.manager_email
      
      // Create mailto link
      const subjectEncoded = encodeURIComponent(subject)
      const bodyEncoded = encodeURIComponent(body)
      const ccEncoded = encodeURIComponent(ccEmail)
      
      const mailtoLink = `mailto:${toEmail}?cc=${ccEncoded}&subject=${subjectEncoded}&body=${bodyEncoded}`
      
      // Open mail app
      window.open(mailtoLink, '_blank')
      
    } catch (error) {
      console.error('Mail app error:', error)
      throw new Error('Kon mail app niet openen. Controleer uw email instellingen.')
    }
  }

  static async copyEmailToClipboard(auditData: SimpleAuditData): Promise<void> {
    try {
      const recipients = this.getRecipientEmails(auditData.filiaal.naam)
      const body = this.createEmailContent(auditData)
      
      const emailText = `TO: ${recipients.filiaal_email}
CC: ${recipients.manager_email}

${body}`
      
      await navigator.clipboard.writeText(emailText)
    } catch (error) {
      console.error('Clipboard error:', error)
      throw new Error('Kon email tekst niet naar clipboard kopiëren')
    }
  }
}

