// Working PDF export implementation
import jsPDF from 'jspdf'

export interface SimpleAuditData {
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
  }>
  opmerkingen: string | null
}

export class SimplePDFExporter {
  static async exportAudit(auditData: SimpleAuditData): Promise<void> {
    try {
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      let y = 20 // Starting position
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Add title
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('AUDIT RAPPORT', pageWidth / 2, y, { align: 'center' })
      y += 15
      
      // Add subtitle
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`${auditData.filiaal.naam} - ${auditData.filiaal.locatie}`, pageWidth / 2, y, { align: 'center' })
      y += 10
      
      // Add audit information
      pdf.setFontSize(10)
      pdf.text(`Audit datum: ${auditData.audit_datum}`, 20, y)
      y += 7
      pdf.text(`Auditor: ${auditData.district_manager.naam}`, 20, y)
      y += 7
      pdf.text(`Totaal score: ${auditData.totale_score}/5.0`, 20, y)
      y += 7
      pdf.text(`Percentage: ${auditData.pass_percentage}%`, 22, y)
      y += 15
      
      // Add audit results grouped by category
      const groupedResults = this.groupResultsByCategory(auditData.resultaten)
      
      for (const [category, results] of Object.entries(groupedResults)) {
        // Check if we need a new page
        if (y > pageHeight - 50) {
          pdf.addPage()
          y = 20
        }
        
        // Add category header
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text(category.toUpperCase(), 20, y)
        y += 8
        
        // Add items in this category
        for (const result of results) {
          // Check if we need a new page
          if (y > pageHeight - 30) {
            pdf.addPage()
            y = 20
          }
          
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          
          // Add checkmark or X based on result
          const statusSymbol = result.resultaat === 'ok' ? '✓' : '✗'
          const statusText = result.resultaat === 'ok' ? 'OK' : 'NIET OK'
          
          pdf.text(`${statusSymbol} ${result.checklist_item.titel}`, 25, y)
          y += 6
          
          pdf.setFontSize(9)
          pdf.text(`   Score: ${result.score}/5 | Gewicht: ${result.checklist_item.gewicht}`, 25, y)
          y += 5
          
          // Add comments if available
          if (result.opmerkingen && result.opmerkingen.trim() !== '') {
            pdf.text(`   Opmerkingen: ${result.opmerkingen}`, 25, y)
            y += 5
          }
          
          // Add improvement points if available
          if (result.verbeterpunt && result.verbeterpunt.trim() !== '') {
            pdf.text(`   Verbeterpunt: ${result.verbeterpunt}`, 25, y)
            y += 5
          }
          
          y += 5 // Extra space between items
        }
        
        y += 5 // Extra space between categories
      }
      
      // Add general comments if available
      if (auditData.opmerkingen && auditData.opmerkingen.trim() !== '') {
        if (y > pageHeight - 50) {
          pdf.addPage()
          y = 20
        }
        
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('ALGEMENE OPMERKINGEN', 20, y)
        y += 8
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        
        // Split long text into multiple lines
        const lines = pdf.splitTextToSize(auditData.opmerkingen, pageWidth - 40)
        for (const line of lines) {
          if (y > pageHeight - 15) {
            pdf.addPage()
            y = 20
          }
          pdf.text(line, 20, y)
          y += 6
        }
      }
      
      // Add footer
      const finalPageCount = pdf.getNumberOfPages()
      for (let i = 1; i <= finalPageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.text(`Pagina ${i} van ${finalPageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      }
      
      // Generate filename and save
      const filename = `audit-rapport-${auditData.filiaal.naam.replace(/\s+/g, '-')}-${auditData.audit_datum}`
      pdf.save(`${filename}.pdf`)
      
    } catch (error) {
      console.error('PDF generation error:', error)
      throw new Error('Kon PDF niet genereren. Probeer het opnieuw.')
    }
  }
  
  private static groupResultsByCategory(results: SimpleAuditData['resultaten']) {
    const grouped: { [category: string]: SimpleAuditData['resultaten'] } = {}
    
    for (const result of results) {
      const category = result.checklist_item.categorie
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(result)
    }
    
    return grouped
  }
}

