import OrganizationLoginClient from './OrganizationLoginClient'

// Generate static params for static export
export async function generateStaticParams() {
  // Return common organization slugs for static generation
  return [
    { slug: 'pp' },
    { slug: 'demo' },
    { slug: 'test' }
  ]
}

interface OrganizationLoginPageProps {
  params: {
    slug: string
  }
}

export default function OrganizationLoginPage({ params }: OrganizationLoginPageProps) {
  return <OrganizationLoginClient slug={params.slug} />
}
