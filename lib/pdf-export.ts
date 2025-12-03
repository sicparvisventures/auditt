// PDF Export utility for audit detail pages
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { AuditData } from './pdf-types'

export interface PDFExportOptions {
  filename?: string
  quality?: number
  scale?: number
  includePhotos?: boolean
}

export class PDFExporter {
  private static instance: PDFExporter
  
  static getInstance(): PDFExporter {
    if (!PDFExporter.instance) {
      PDFExporter.instance = new PDFExporter()
    }
    return PDFExporter.instance
  }

  async exportAuditDetail(
    elementId: string, 
    auditData: AuditData, 
    options: PDFExportOptions = {}
  ): Promise<void> {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    const {
      filename = `audit-rapport-${auditData.filiaal.naam}-${auditData.audit_datum}`,
      quality = 0.98,
      scale = 2,
      includePhotos = true
    } = options

    try {
      // Create canvas from element
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: false,
        foreignObjectRendering: true
      })

      const imgData = canvas.toDataURL('image/png', quality)

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Add metadata
      this.addPDFMetadata(pdf, auditData)

      // Save the PDF
      pdf.save(`${filename}.pdf`)
    } catch (error: any) {
      console.error('PDF export error:', error)
      throw new Error(`PDF export failed: ${error.message}`)
    }
  }

  private addPDFMetadata(pdf: jsPDF, auditData: AuditData): void {
    // Add properties (basic version for compatibility)
    try {
      pdf.setProperties({
        title: `Audit Rapport - ${auditData.filiaal.naam}`,
        subject: `Audit uitgevoerd op ${auditData.audit_datum}`,
        author: auditData.district_manager.naam,
        creator: 'P&P Audit Tool',
        keywords: 'audit, rapport, kwaliteitscontrole'
      })
    } catch (e) {
      // Fallback if setProperties not available
      console.log('setProperties not available, skipping metadata')
    }

    // Add audit summary to first page
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    
    // Position at top of first page
    pdf.text(`Audit Rapport`, 20, 20)
    pdf.text(`Filiaal: ${auditData.filiaal.naam} - ${auditData.filiaal.locatie}`, 20, 30)
    pdf.text(`Datum: ${auditData.audit_datum}`, 20, 40)
    pdf.text(`Auditor: ${auditData.district_manager.naam}`, 20, 50)
    pdf.text(`Score: ${auditData.totale_score}/5.0 (${auditData.pass_percentage}%)`, 20, 60)
  }

  async exportElementAsImage(
    elementId: string, 
    filename?: string,
    options: { quality?: number; scale?: number } = {}
  ): Promise<string> {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    const { quality = 0.98, scale = 2 } = options

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    })

    return canvas.toDataURL('image/png', quality)
  }
}