// Email service for sending audit reports
import { AuditData } from './pdf-types'

export interface EmailRecipients {
  filiaal_email: string
  manager_email: string | null
  district_manager_email?: string
}

export class EmailService {
  private static getRecipientEmails(auditData: AuditData): EmailRecipients {
    // This mapping should match the one in the database functions
    const emailMapping: Record<string, string> = {
      'km11@poulepoulette.com': 'CVH@POULEPOULETTE.COM',
      'pj70@poulepoulette.com': 'MP@POULEPOULETTE.COM', 
      'il36@poulepoulette.com': 'JDM@POULEPOULETTE.COM',
      'ts15@poulepoulette.com': 'DI@POULEPOULETTE.COM',
      'gk2@poulepoulette.com': 'JC@POULEPOULETTE.COM',
      'll34@poulepoulette.com': 'MB@POULEPOULETTE.COM',
      'tl24@poulepoulette.com': 'JR@POULEPOULETTE.COM',
      'sc2@poulepoulette.com': 'MF@POULEPOULETTE.COM',
      'ss3@poulepoulette.com': 'SM@POULEPOULETTE.COM'
    }

    // In a real implementation, this would come from the database
    // For now, we'll simulate based on filiaal naam
    const filiaalNaam = auditData.filiaal.naam.toLowerCase()
    let filiaal_email = 'info@poulepoulette.com' // default
    let manager_email: string | null = null

    // Try to determine email based on filiaal name pattern
    if (filiaalNaam.includes('gent') || filiaalNaam.includes('km')) {
      filiaal_email = 'km11@poulepoulette.com'
      manager_email = emailMapping[filiaal_email]
    } else if (filiaalNaam.includes('mechelen') || filiaalNaam.includes('il')) {
      filiaal_email = 'il36@poulepoulette.com'
      manager_email = emailMapping[filiaal_email]
    } else if (filiaalNaam.includes('antwerpen')) {
      filiaal_email = 'tl24@poulepoulette.com'
      manager_email = emailMapping[filiaal_email]
    } else {
      // Default to first in list
      filiaal_email = 'km11@poulepoulette.com'
      manager_email = emailMapping[filiaal_email]
    }

    return {
      filiaal_email,
      manager_email,
      district_manager_email: 'district@poulepoulette.be' // Optional
    }
  }

  static openMailApp(auditData: AuditData, attachments: string[] = []): void {
    const recipients = this.getRecipientEmails(auditData)
    const passStatus = auditData.pass_percentage >= 80 ? 'PASSED' : 'FAILED'
    
    const subject = `Audit Rapport - ${auditData.filiaal.naam} (${passStatus})`
    
    const body = `Beste collega,

Hierbij wordt het audit rapport voor filiaal ${auditData.filiaal.naam} gedeeld.

AUDIT SAMENVATTING:
• Filiaal: ${auditData.filiaal.naam} - ${auditData.filiaal.locatie}
• Audit datum: ${auditData.audit_datum}
• Auditor: ${auditData.district_manager.naam}
• Totaal score: ${auditData.totale_score}/5.0
• Percentage: ${auditData.pass_percentage}%
• Status: ${passStatus}

${auditData.opmerkingen ? `ALGEMENE OPMERKINGEN:\n${auditData.opmerkingen}\n` : ''}

Het volledige rapport met foto's en gedetailleerde bevindingen is bijgevoegd als PDF.

Met vriendelijke groeten,
${auditData.district_manager.naam}
District Manager`

    // Create recipient list
    const recipientsList = [
      recipients.filiaal_email,
      recipients.manager_email,
      recipients.district_manager_email
    ].filter(Boolean).join(',')

    // Create mailto link
    const mailtoLink = this.createMailtoLink({
      to: recipientsList,
      subject,
      body,
      attachments
    })

    // Open the mail app
    window.open(mailtoLink, '_blank')
  }

  private static createMailtoLink(params: {
    to: string
    subject: string
    body: string
    attachments?: string[]
  }): string {
    const { to, subject, body, attachments } = params
    
    // URL encode the parameters
    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(body)
    
    // Build mailto link
    let mailtoLink = `mailto:${encodeURIComponent(to)}?subject=${encodedSubject}&body=${encodedBody}`
    
    // Add CC if needed (district manager)
    // mailtoLink += `&cc=${encodeURIComponent('district@poulepoulette.be')}`
    
    // Note: Attachments via mailto are limited and browser-dependent
    // Most browsers don't support actual attachments via mailto
    // Users will need to attach files manually in their email client
    
    return mailtoLink
  }

  static getDownloadableEmailContent(auditData: AuditData): string {
    const recipients = this.getRecipientEmails(auditData)
    const passStatus = auditData.pass_percentage >= 80 ? 'PASSED' : 'FAILED'
    
    return `TO: ${recipients.filiaal_email}, ${recipients.manager_email}
SUBJECT: Audit Rapport - ${auditData.filiaal.naam} (${passStatus})

Beste collega,

Hierbij wordt het audit rapport voor filiaal ${auditData.filiaal.naam} gedeeld.

AUDIT SAMENVATTING:
• Filiaal: ${auditData.filiaal.naam} - ${auditData.filiaal.locatie}
• Audit datum: ${auditData.audit_datum}
• Auditor: ${auditData.district_manager.naam}
• Totaal score: ${auditData.totale_score}/5.0
• Percentage: ${auditData.pass_percentage}%
• Status: ${passStatus}

${auditData.opmerkingen ? `ALGEMENE OPMERKINGEN:\n${auditData.opmerkingen}\n` : ''}

Met vriendelijke groeten,
${auditData.district_manager.naam}
District Manager

---
Generated by P&P Audit Tool`
  }

  // Helper method to copy email content to clipboard
  static async copyEmailToClipboard(auditData: AuditData): Promise<void> {
    try {
      const content = this.getDownloadableEmailContent(auditData)
      await navigator.clipboard.writeText(content)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      throw new Error('Kon email tekst niet naar clipboard kopiëren')
    }
  }
}
