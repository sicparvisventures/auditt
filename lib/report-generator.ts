import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { AuditWithDetails } from '@/types'
import { formatDate, formatScore, formatPercentage } from '@/lib/utils'

export interface ReportOptions {
  includePhotos: boolean
  includeImprovements: boolean
  includeTrends: boolean
}

export class ReportGenerator {
  private audit: AuditWithDetails
  private options: ReportOptions

  constructor(audit: AuditWithDetails, options: ReportOptions = {
    includePhotos: true,
    includeImprovements: true,
    includeTrends: false
  }) {
    this.audit = audit
    this.options = options
  }

  async generatePDF(): Promise<Blob> {
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
      `Filiaal: ${this.audit.filiaal.naam} - ${this.audit.filiaal.locatie}`,
      `Datum: ${formatDate(this.audit.audit_datum)}`,
      `Auditor: ${this.audit.district_manager.naam}`,
      `Score: ${formatScore(this.audit.totale_score)}/5.0 (${formatPercentage(this.audit.pass_percentage)})`,
      `Status: ${this.audit.pass_percentage >= 80 ? 'PASS' : 'FAIL'}`
    ]

    auditInfo.forEach(info => {
      doc.text(info, 20, yPosition)
      yPosition += 6
    })

    yPosition += 10

    // Results by Category
    const groupedResults = this.audit.resultaten.reduce((acc, result) => {
      const category = result.checklist_item.categorie
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(result)
      return acc
    }, {} as Record<string, typeof this.audit.resultaten>)

    Object.entries(groupedResults).forEach(([categorie, results]) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage()
        yPosition = 20
      }

      // Category header
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(categorie, 20, yPosition)
      yPosition += 10

      // Results
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      results.forEach(result => {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }

        const status = result.resultaat === 'ok' ? 'OK' : 'Niet OK'
        const statusColor = result.resultaat === 'ok' ? [0, 150, 0] : [200, 0, 0]

        // Item title and status
        doc.setFont('helvetica', 'bold')
        doc.text(result.checklist_item.titel, 20, yPosition)
        
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...statusColor)
        doc.text(status, pageWidth - 30, yPosition, { align: 'right' })
        doc.setTextColor(0, 0, 0)
        yPosition += 5

        // Description
        doc.setFontSize(9)
        const description = doc.splitTextToSize(result.checklist_item.beschrijving, pageWidth - 40)
        doc.text(description, 20, yPosition)
        yPosition += description.length * 4

        // Comments
        if (result.opmerkingen) {
          doc.setFontSize(8)
          doc.setFont('helvetica', 'italic')
          doc.text(`Opmerking: ${result.opmerkingen}`, 20, yPosition)
          yPosition += 4
        }

        // Improvement point
        if (result.verbeterpunt) {
          doc.setFontSize(8)
          doc.setFont('helvetica', 'italic')
          doc.setTextColor(255, 140, 0) // Orange
          doc.text(`Verbeterpunt: ${result.verbeterpunt}`, 20, yPosition)
          doc.setTextColor(0, 0, 0)
          yPosition += 4
        }

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        yPosition += 8
      })

      yPosition += 10
    })

    // General comments
    if (this.audit.opmerkingen) {
      if (yPosition > pageHeight - 50) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Algemene Opmerkingen', 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const comments = doc.splitTextToSize(this.audit.opmerkingen, pageWidth - 40)
      doc.text(comments, 20, yPosition)
      yPosition += comments.length * 4
    }

    // Footer
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Pagina ${i} van ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
      doc.text(
        `Gegenereerd op ${formatDate(new Date())}`,
        pageWidth - 20,
        pageHeight - 10,
        { align: 'right' }
      )
    }

    return doc.output('blob')
  }

  async generateHTML(): Promise<string> {
    const groupedResults = this.audit.resultaten.reduce((acc, result) => {
      const category = result.checklist_item.categorie
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(result)
      return acc
    }, {} as Record<string, typeof this.audit.resultaten>)

    const passStatus = this.audit.pass_percentage >= 80 ? 'PASS' : 'FAIL'
    const statusColor = this.audit.pass_percentage >= 80 ? '#22c55e' : '#ef4444'

    let html = `
      <!DOCTYPE html>
      <html lang="nl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Audit Rapport - ${this.audit.filiaal.naam}</title>
        <style>
          body {
            font-family: 'Inter', system-ui, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #f2740a;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #f2740a;
            margin: 0;
            font-size: 28px;
          }
          .header h2 {
            color: #666;
            margin: 5px 0 0 0;
            font-weight: normal;
          }
          .audit-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .audit-info h3 {
            margin-top: 0;
            color: #333;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: bold;
            color: white;
            background: ${statusColor};
          }
          .category {
            margin-bottom: 30px;
          }
          .category h3 {
            background: #f2740a;
            color: white;
            padding: 10px 15px;
            margin: 0 0 15px 0;
            border-radius: 5px;
          }
          .item {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
          }
          .item-title {
            font-weight: bold;
            color: #333;
            margin: 0;
          }
          .item-status {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            color: white;
          }
          .status-ok {
            background: #22c55e;
          }
          .status-nok {
            background: #ef4444;
          }
          .item-description {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
          }
          .item-comments {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
            font-style: italic;
          }
          .item-improvement {
            background: #fef3c7;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #f59e0b;
          }
          .photos {
            margin-top: 10px;
          }
          .photo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 10px;
          }
          .photo {
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .photo img {
            width: 100%;
            height: 120px;
            object-fit: cover;
          }
          .general-comments {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
          }
          .general-comments h3 {
            margin-top: 0;
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; padding: 15px; }
            .category { page-break-inside: avoid; }
            .item { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Poule & Poulette</h1>
          <h2>Interne Audit Rapport</h2>
        </div>

        <div class="audit-info">
          <h3>Audit Informatie</h3>
          <div class="info-grid">
            <div class="info-item">
              <span>Filiaal:</span>
              <span>${this.audit.filiaal.naam} - ${this.audit.filiaal.locatie}</span>
            </div>
            <div class="info-item">
              <span>Datum:</span>
              <span>${formatDate(this.audit.audit_datum)}</span>
            </div>
            <div class="info-item">
              <span>Auditor:</span>
              <span>${this.audit.district_manager.naam}</span>
            </div>
            <div class="info-item">
              <span>Score:</span>
              <span>${formatScore(this.audit.totale_score)}/5.0 (${formatPercentage(this.audit.pass_percentage)})</span>
            </div>
            <div class="info-item">
              <span>Status:</span>
              <span class="status-badge">${passStatus}</span>
            </div>
          </div>
        </div>
    `

    // Results by category
    Object.entries(groupedResults).forEach(([categorie, results]) => {
      html += `
        <div class="category">
          <h3>${categorie}</h3>
      `

      results.forEach(result => {
        const statusClass = result.resultaat === 'ok' ? 'status-ok' : 'status-nok'
        const statusText = result.resultaat === 'ok' ? 'OK' : 'Niet OK'

        html += `
          <div class="item">
            <div class="item-header">
              <h4 class="item-title">${result.checklist_item.titel}</h4>
              <span class="item-status ${statusClass}">${statusText}</span>
            </div>
            <div class="item-description">${result.checklist_item.beschrijving}</div>
        `

        if (result.opmerkingen) {
          html += `
            <div class="item-comments">
              <strong>Opmerking:</strong> ${result.opmerkingen}
            </div>
          `
        }

        if (result.verbeterpunt) {
          html += `
            <div class="item-improvement">
              <strong>Verbeterpunt:</strong> ${result.verbeterpunt}
            </div>
          `
        }

        if (result.foto_urls && result.foto_urls.length > 0) {
          html += `
            <div class="photos">
              <strong>Foto's:</strong>
              <div class="photo-grid">
          `
          result.foto_urls.forEach(photoUrl => {
            html += `
              <div class="photo">
                <img src="${photoUrl}" alt="Audit foto" />
              </div>
            `
          })
          html += `
              </div>
            </div>
          `
        }

        html += `
          </div>
        `
      })

      html += `
        </div>
      `
    })

    // General comments
    if (this.audit.opmerkingen) {
      html += `
        <div class="general-comments">
          <h3>Algemene Opmerkingen</h3>
          <p>${this.audit.opmerkingen}</p>
        </div>
      `
    }

    // Footer
    html += `
        <div class="footer">
          <p>Rapport gegenereerd op ${formatDate(new Date())}</p>
          <p>Poule & Poulette - Interne Audit Tool</p>
        </div>
      </body>
      </html>
    `

    return html
  }

  async generateExcel(): Promise<Blob> {
    // This would require a library like xlsx
    // For now, return a simple CSV
    const csv = this.generateCSV()
    return new Blob([csv], { type: 'text/csv' })
  }

  private generateCSV(): string {
    const headers = [
      'Categorie',
      'Item',
      'Beschrijving',
      'Resultaat',
      'Score',
      'Opmerkingen',
      'Verbeterpunt',
      'Foto\'s'
    ]

    const rows = this.audit.resultaten.map(result => [
      result.checklist_item.categorie,
      result.checklist_item.titel,
      result.checklist_item.beschrijving,
      result.resultaat === 'ok' ? 'OK' : 'Niet OK',
      result.score.toString(),
      result.opmerkingen || '',
      result.verbeterpunt || '',
      result.foto_urls?.join(';') || ''
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    return csvContent
  }
}
