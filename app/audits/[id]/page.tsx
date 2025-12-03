import AuditDetailClient from './AuditDetailClient'

// Generate static params for static export
export async function generateStaticParams() {
  // Return some common audit IDs for static generation
  // In a real app, you might want to fetch these from your database
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: 'demo' },
    { id: 'test' }
  ]
}

interface AuditDetailPageProps {
  params: {
    id: string
  }
}

export default function AuditDetailPage({ params }: AuditDetailPageProps) {
  return <AuditDetailClient params={params} />
}


