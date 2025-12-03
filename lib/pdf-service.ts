// PDF Service voor audit rapporten met Supabase Storage integratie
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { supabase } from './supabase'
import { AuditWithDetails } from '@/types'
import { formatDate, formatScore, formatPercentage } from './utils'

export interface PDFGenerationResult {
  success: boolean
  pdfUrl?: string
  pdfBlob?: Blob
  error?: string
}

export class PDFService {
  private static instance: PDFService

  static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService()
    }
    return PDFService.instance
  }

  /**
   * Genereer PDF van audit en sla op in Supabase Storage
   */
  async generateAndUploadPDF(
    audit: AuditWithDetails,
    elementId?: string
  ): Promise<PDFGenerationResult> {
    try {
      // Genereer PDF
      const pdfBlob = await this.generatePDF(audit, elementId)

      // Upload naar Supabase Storage
      const fileName = `reports/${audit.id}.pdf`
      const { data, error: uploadError } = await supabase.storage
        .from('audit-photos')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('PDF upload error:', uploadError)
        return {
          success: false,
          pdfBlob,
          error: uploadError.message || 'PDF upload failed'
        }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audit-photos')
        .getPublicUrl(fileName)

      return {
        success: true,
        pdfUrl: publicUrl,
        pdfBlob
      }
    } catch (error: any) {
      console.error('PDF generation error:', error)
      return {
        success: false,
        error: error.message || 'PDF generation failed'
      }
    }
  }

  /**
   * Genereer PDF Blob van audit
   */
  async generatePDF(
    audit: AuditWithDetails,
    elementId?: string
  ): Promise<Blob> {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Poule & Poulette', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    doc.setFontSize(16)
    doc.setFont('helvetica', 'normal')
    doc.text('Interne Audit Rapport', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    // Audit Info
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Audit Informatie', 20, yPosition)
    yPosition += 10

    doc.setFont('helvetica', 'normal')
    const auditInfo = [
      `Filiaal: ${audit.filiaal.naam} - ${audit.filiaal.locatie}`,
      `Datum: ${formatDate(audit.audit_datum)}`,
      `Auditor: ${audit.district_manager.naam}`,
      `Score: ${formatScore(audit.totale_score)}/5.0 (${formatPercentage(audit.pass_percentage)})`,
      `Status: ${audit.pass_percentage >= 80 ? 'PASS' : 'FAIL'}`
    ]

    auditInfo.forEach(info => {
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(info, 20, yPosition)
      yPosition += 6
    })

    yPosition += 10

    // Results by Category
    const groupedResults = audit.resultaten.reduce((acc, result) => {
      if (!result.checklist_item) return acc
      const category = result.checklist_item.categorie
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(result)
      return acc
    }, {} as Record<string, typeof audit.resultaten>)

    Object.entries(groupedResults).forEach(([category, results]) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        doc.addPage()
        yPosition = 20
      }

      // Category header
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(category, 20, yPosition)
      yPosition += 8

      // Results
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      results.forEach(result => {
        if (!result.checklist_item) return

        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }

        const status = result.resultaat === 'ok' ? 'OK' : 'NIET OK'
        const statusColor = result.resultaat === 'ok' ? [0, 128, 0] : [255, 0, 0]

        doc.setTextColor(...statusColor)
        doc.text(`• ${result.checklist_item.titel} - ${status} (${result.score}/5)`, 25, yPosition)
        yPosition += 6

        if (result.opmerkingen) {
          doc.setTextColor(100, 100, 100)
          doc.setFontSize(9)
          doc.text(`  Opmerking: ${result.opmerkingen}`, 30, yPosition, { maxWidth: pageWidth - 50 })
          yPosition += 6
        }

        if (result.verbeterpunt) {
          doc.setTextColor(255, 140, 0)
          doc.text(`  Verbeterpunt: ${result.verbeterpunt}`, 30, yPosition, { maxWidth: pageWidth - 50 })
          yPosition += 6
        }

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
        yPosition += 3
      })

      yPosition += 5
    })

    // General comments
    if (audit.opmerkingen) {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Algemene Opmerkingen', 20, yPosition)
      yPosition += 8

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(audit.opmerkingen, pageWidth - 40)
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, 20, yPosition)
        yPosition += 6
      })
    }

    // Metadata
    doc.setProperties({
      title: `Audit Rapport - ${audit.filiaal.naam}`,
      subject: `Audit uitgevoerd op ${formatDate(audit.audit_datum)}`,
      author: audit.district_manager.naam,
      creator: 'P&P Audit Tool',
      keywords: 'audit, rapport, kwaliteitscontrole'
    })

    // Return as Blob
    return doc.output('blob')
  }

  /**
   * Download PDF lokaal
   */
  async downloadPDF(audit: AuditWithDetails, filename?: string): Promise<void> {
    const pdfBlob = await this.generatePDF(audit)
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `audit-rapport-${audit.filiaal.naam}-${audit.audit_datum}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export const pdfService = PDFService.getInstance()

