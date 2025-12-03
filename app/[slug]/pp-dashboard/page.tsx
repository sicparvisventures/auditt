import OrganizationDashboardClient from './OrganizationDashboardClient'

// Generate static params for static export
export async function generateStaticParams() {
  // Return common organization slugs for static generation
  return [
    { slug: 'pp' },
    { slug: 'demo' },
    { slug: 'test' }
  ]
}

interface OrganizationDashboardPageProps {
  params: {
    slug: string
  }
}

export default function OrganizationDashboardPage({ params }: OrganizationDashboardPageProps) {
  return <OrganizationDashboardClient slug={params.slug} />
}
